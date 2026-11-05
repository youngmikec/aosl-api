import aqp from "api-query-params";
import mongoose from "mongoose";
import { CHAT } from "../../constant/index.js";
import { generateModelCode } from "../../util/index.js";
import Users from "../users/model.js";
import ChatMessage, { validateSendMessage } from "./model.js";
import ChatRoom, { validateCreateRoom, validateUpdateRoom } from "./chat-room-model.js";
import { audienceOf, canAccessRoom, isAdminUser, memberIds, roomAccessFilter, roomType } from "./access.js";
import { publish } from "./emitter.js";

const module = "Chat";

// Only these user fields are ever sent to a client with a chat record.
const PERSON_FIELDS = "firstName lastName userType profileImage";
const asObjectId = (id) => new mongoose.Types.ObjectId(`${id}`);
const fullName = (u) => `${u.firstName || ""} ${u.lastName || ""}`.trim();

async function loadRoom(roomId) {
  if (!mongoose.Types.ObjectId.isValid(`${roomId}`)) throw new Error("Invalid room.");
  const room = await ChatRoom.findOne({ _id: roomId, deleted: { $ne: true } }).exec();
  if (!room) throw new Error("Conversation not found.");
  return room;
}

// Same message for "no such room" and "not yours", so ids cannot be probed.
export async function loadAccessibleRoom(user, roomId) {
  const room = await loadRoom(roomId);
  if (!canAccessRoom(user, room)) throw new Error("Conversation not found.");
  return room;
}

/* ─── rooms ─────────────────────────────────────────────────── */

async function unreadByRoom(user, roomIds) {
  if (roomIds.length === 0) return {};
  const rows = await ChatMessage.aggregate([
    {
      $match: {
        room: { $in: roomIds.map(asObjectId) },
        deleted: { $ne: true },
        sender: { $ne: asObjectId(user.id) },
        // Legacy messages have no readBy and count as read; new ones list who has seen them.
        readBy: { $exists: true, $ne: asObjectId(user.id) },
      },
    },
    { $group: { _id: "$room", unread: { $sum: 1 } } },
  ]).exec();
  return rows.reduce((acc, r) => ({ ...acc, [`${r._id}`]: r.unread }), {});
}

export const fetchRoomsService = async (user, query = {}) => {
  try {
    const { filter, sort } = aqp(query);
    // Client-supplied filters are narrowed by the access filter; ownership fields are never taken from the client.
    delete filter.customer;
    delete filter.members;
    delete filter.$or;
    delete filter.$and;
    let search = null;
    if (filter.q) {
      search = new RegExp(`${filter.q}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
      delete filter.q;
    }
    filter.deleted = { $ne: true };
    const and = [filter, roomAccessFilter(user)];
    if (search) and.push({ name: { $regex: search } });

    const rooms = await ChatRoom.find({ $and: and })
      .populate("members", PERSON_FIELDS)
      .populate("customer", `${PERSON_FIELDS} email`)
      .sort(sort && Object.keys(sort).length ? sort : { lastMessageAt: -1, createdAt: -1 })
      .limit(200)
      .exec();

    const unread = await unreadByRoom(user, rooms.map((r) => `${r.id}`));
    const payload = rooms.map((r) => ({ ...r.toJSON(), unread: unread[`${r.id}`] || 0 }));
    const count = payload.length;
    return { payload, total: count, count, msg: `${count} ${module} room(s) retrieved successfully!`, skip: 0, limit: 200, sort };
  } catch (err) {
    throw new Error(`Error retrieving chat rooms. ${err.message}`);
  }
};

// A customer's own support conversation, created on first use for accounts that pre-date chat rooms.
export async function ensureSupportRoom(customer) {
  const customerId = `${customer.id || customer._id}`;
  let room = await ChatRoom.findOne({ type: CHAT.ROOM_TYPE.SUPPORT, customer: customerId, deleted: { $ne: true } }).exec();
  if (room) return room;

  const admins = await Users.find({ userType: "ADMIN" }).select("_id").exec();
  room = await new ChatRoom({
    name: fullName(customer) || customer.email || "Customer",
    type: CHAT.ROOM_TYPE.SUPPORT,
    customer: customerId,
    members: [customerId, ...admins.map((a) => a._id)],
    code: await generateModelCode(ChatRoom),
    createdBy: customerId,
  }).save();
  await Users.findOneAndUpdate({ _id: customerId }, { chatRoom: room._id }).exec();

  publish(audienceOf(room), "room:new", { ...room.toJSON(), unread: 0 });
  return room;
}

export const mySupportRoomService = async (user) => {
  const account = await Users.findById(user.id).exec();
  if (!account) throw new Error("User record not found.");
  const room = await ensureSupportRoom(account);
  const populated = await ChatRoom.findById(room.id).populate("customer", `${PERSON_FIELDS} email`).exec();
  const unread = await unreadByRoom(user, [`${room.id}`]);
  return { ...populated.toJSON(), unread: unread[`${room.id}`] || 0 };
};

async function adminMembers(ids) {
  const unique = Array.from(new Set(ids.map(String)));
  const admins = await Users.find({ _id: { $in: unique }, userType: "ADMIN" }).select("_id").exec();
  if (admins.length !== unique.length) throw new Error("Groups can only include admin accounts.");
  return unique;
}

export const createGroupService = async (user, data) => {
  try {
    if (!isAdminUser(user)) throw new Error("Only admins can create groups.");
    const { error } = validateCreateRoom.validate(data);
    if (error) throw new Error(error.message);

    const members = await adminMembers([...data.members, user.id]);
    const room = await new ChatRoom({
      name: data.name,
      type: CHAT.ROOM_TYPE.GROUP,
      members,
      code: await generateModelCode(ChatRoom),
      createdBy: user.id,
    }).save();

    const populated = await ChatRoom.findById(room.id).populate("members", PERSON_FIELDS).exec();
    const json = { ...populated.toJSON(), unread: 0 };
    publish(audienceOf(room), "room:new", json);
    return json;
  } catch (err) {
    throw new Error(`Error creating group. ${err.message}`);
  }
};

export const updateGroupService = async (user, roomId, data) => {
  try {
    const { error } = validateUpdateRoom.validate(data);
    if (error) throw new Error(error.message);
    const room = await loadAccessibleRoom(user, roomId);
    if (roomType(room) !== CHAT.ROOM_TYPE.GROUP) throw new Error("Only group conversations can be edited.");

    const previous = memberIds(room);
    if (data.name) room.name = data.name;
    if (data.members) room.members = await adminMembers([...data.members, user.id]);
    room.updatedBy = user.id;
    await room.save();

    const populated = await ChatRoom.findById(room.id).populate("members", PERSON_FIELDS).exec();
    const json = { ...populated.toJSON(), unread: 0 };
    publish(audienceOf(room), "room:updated", json);
    const removed = previous.filter((id) => !memberIds(room).includes(id));
    if (removed.length) publish(removed.map((id) => `user:${id}`), "room:removed", { id: `${room.id}` });
    return json;
  } catch (err) {
    throw new Error(`Error updating group. ${err.message}`);
  }
};

export const deleteRoomService = async (user, roomId) => {
  try {
    const room = await loadAccessibleRoom(user, roomId);
    if (!isAdminUser(user)) throw new Error("Insufficient privileges.");
    const audience = audienceOf(room);
    // Messages go with the room so no orphaned conversations remain.
    await ChatMessage.deleteMany({ room: room._id }).exec();
    await ChatRoom.deleteOne({ _id: room._id }).exec();
    publish(audience, "room:removed", { id: `${room.id}` });
    return { id: `${room.id}` };
  } catch (err) {
    throw new Error(`Error deleting conversation. ${err.message}`);
  }
};

/* ─── messages ──────────────────────────────────────────────── */

// Newest `limit` messages (optionally older than `before`), returned oldest-first so a client can append them.
// metadata.total is the number of messages up to the cursor, so `total > count` means more history exists.
export const fetchMessagesService = async (user, query = {}) => {
  try {
    const room = await loadAccessibleRoom(user, query.room);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || CHAT.PAGE_SIZE, 1), CHAT.MAX_PAGE_SIZE);

    const filter = { room: room._id, deleted: { $ne: true } };
    if (query.before) {
      const cursor = mongoose.Types.ObjectId.isValid(`${query.before}`) && `${query.before}`.length === 24
        ? (await ChatMessage.findById(query.before).select("createdAt").exec())?.createdAt
        : new Date(`${query.before}`);
      if (cursor && !Number.isNaN(cursor.getTime())) filter.createdAt = { $lt: cursor };
    }

    const total = await ChatMessage.countDocuments(filter).exec();
    const rows = await ChatMessage.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .populate("sender", PERSON_FIELDS)
      .exec();
    const payload = rows.reverse().map((m) => m.toJSON());
    const count = payload.length;
    return { payload, total, count, msg: `${count} message(s) retrieved successfully!`, skip: 0, limit, sort: "createdAt" };
  } catch (err) {
    throw new Error(`Error retrieving messages. ${err.message}`);
  }
};

/**
 * The single place a message is created, used by both the REST endpoint and the socket handler.
 * The sender is the authenticated user; membership is checked; recipients are notified in real time.
 */
export async function createMessage(user, data, { exceptSocketId } = {}) {
  const { error } = validateSendMessage.validate(data);
  if (error) throw new Error(error.message);

  const room = await loadAccessibleRoom(user, data.room);
  const now = new Date();
  const message = await new ChatMessage({
    sender: user.id,
    // Support rooms: an admin's message is addressed to the customer; group rooms have no single recipient.
    recipient: roomType(room) === CHAT.ROOM_TYPE.SUPPORT && isAdminUser(user) ? room.customer : undefined,
    room: room._id,
    message: data.message,
    readBy: [user.id],
    createdAt: now,
    createdBy: user.id,
  }).save();

  room.lastMessage = data.message.slice(0, 140);
  room.lastMessageAt = now;
  await room.save();

  const populated = await ChatMessage.findById(message.id).populate("sender", PERSON_FIELDS).exec();
  const json = populated.toJSON();
  publish([...audienceOf(room)], "message:new", json, exceptSocketId);
  return json;
}

export const sendMessageService = async (user, data) => {
  try {
    return await createMessage(user, data);
  } catch (err) {
    throw new Error(`Error sending message. ${err.message}`);
  }
};

export async function markRoomRead(user, roomId, { exceptSocketId } = {}) {
  const room = await loadAccessibleRoom(user, roomId);
  const result = await ChatMessage.updateMany(
    { room: room._id, sender: { $ne: user.id }, readBy: { $exists: true, $ne: user.id }, deleted: { $ne: true } },
    { $addToSet: { readBy: user.id } },
  ).exec();
  const read = (result && (result.nModified ?? result.modifiedCount)) || 0;
  if (read > 0) {
    publish(audienceOf(room), "message:read", { room: `${room.id}`, reader: `${user.id}`, at: new Date().toISOString() }, exceptSocketId);
  }
  return { room: `${room.id}`, read };
}

export async function deleteChatService(recordId) {
  const result = await ChatMessage.findOneAndRemove({ _id: recordId });
  if (!result) throw new Error(`ChatMessage record not found.`);
  return result;
}

/* ─── one-off upgrade of rooms created before types existed ─── */

export async function migrateChatRooms() {
  const legacy = await ChatRoom.find({ type: { $exists: false } }).populate("members", "userType").exec();
  for (const room of legacy) {
    const customer = (room.members || []).find((m) => m && m.userType !== "ADMIN");
    const last = await ChatMessage.findOne({ room: room._id }).sort({ createdAt: -1 }).select("message createdAt").exec();
    await ChatRoom.updateOne(
      { _id: room._id },
      {
        $set: {
          type: CHAT.ROOM_TYPE.SUPPORT,
          ...(customer ? { customer: customer._id } : {}),
          ...(last ? { lastMessage: `${last.message}`.slice(0, 140), lastMessageAt: last.createdAt } : {}),
        },
      },
    ).exec();
  }
  return legacy.length;
}
