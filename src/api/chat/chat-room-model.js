import mongoose from "mongoose";
import joi from "joi";
import { CHAT, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const objectId = joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID");

// Only admin-only groups are created through the API; support rooms are created automatically per customer.
export const validateCreateRoom = joi.object({
  name: joi.string().trim().min(2).max(60).required(),
  members: joi.array().items(objectId).min(1).required(),
  createdBy: objectId.optional(),
});

export const validateUpdateRoom = joi.object({
  name: joi.string().trim().min(2).max(60).optional(),
  members: joi.array().items(objectId).min(1).optional(),
  updatedBy: objectId.optional(),
});


const chatRoomSchema = {
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(CHAT.ROOM_TYPE), default: CHAT.ROOM_TYPE.SUPPORT, select: true },
  // SUPPORT rooms belong to exactly one customer; every admin can read them by role.
  customer: { type: ObjectId, ref: 'Users', select: true },
  // GROUP rooms: the admins who can see the room. SUPPORT rooms keep [customer, ...admins at creation] for older clients.
  members: [{ type: ObjectId, ref: 'Users' }],
  lastMessage: { type: String, select: true },
  lastMessageAt: { type: Date, select: true },
  code: { type: String, select: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;

const newSchema = new Schema(chatRoomSchema, options);

newSchema.index({ type: 1, customer: 1 });
newSchema.index({ members: 1, type: 1 });
newSchema.index({ lastMessageAt: -1 });

newSchema.set("collection", "chatRoom");

const ChatRoom = mongoose.model("ChatRoom", newSchema);

export default ChatRoom;
