import { CHAT, USER_TYPE } from "../../constant/index.js";

export const isAdminUser = (user) => !!user && user.userType === USER_TYPE.ADMIN;

const idOf = (value) => `${(value && value._id) || (value && value.id) || value || ""}`;

export const roomType = (room) => (room && room.type) || CHAT.ROOM_TYPE.SUPPORT;

export const memberIds = (room) => ((room && room.members) || []).map(idOf);

/**
 * Who may read or post in a room:
 *  - SUPPORT: the customer it belongs to, and every admin.
 *  - GROUP:   only admins who are members of that group.
 * Customers can therefore never see another customer's chat, an admin group, or anyone else's support room.
 */
export function canAccessRoom(user, room) {
  if (!user || !room) return false;
  if (roomType(room) === CHAT.ROOM_TYPE.GROUP) {
    return isAdminUser(user) && memberIds(room).includes(idOf(user.id));
  }
  if (isAdminUser(user)) return true;
  return !!room.customer && idOf(room.customer) === idOf(user.id);
}

// Mongo filter selecting exactly the rooms `canAccessRoom` allows.
export function roomAccessFilter(user) {
  if (isAdminUser(user)) {
    return { $or: [{ type: { $ne: CHAT.ROOM_TYPE.GROUP } }, { type: CHAT.ROOM_TYPE.GROUP, members: user.id }] };
  }
  return { type: { $ne: CHAT.ROOM_TYPE.GROUP }, customer: user.id };
}

// Socket.IO channels that should receive an event about a room.
export function audienceOf(room) {
  if (roomType(room) === CHAT.ROOM_TYPE.GROUP) return memberIds(room).map((id) => `user:${id}`);
  return ["admins", ...(room.customer ? [`user:${idOf(room.customer)}`] : [])];
}
