import mongoose from "mongoose";
import joi from "joi";
import { CHAT, DATABASE } from "../../constant/index.js";


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const objectId = joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID");

// The sender always comes from the authenticated user, never from the request. `sender`/`recipient` are still
// accepted (and ignored) so the v1 clients, which send them, keep working.
export const validateSendMessage = joi.object({
  room: objectId.required(),
  message: joi.string().trim().min(1).max(CHAT.MAX_MESSAGE_LENGTH).required(),
  sender: objectId.optional(),
  recipient: objectId.optional(),
  createdBy: objectId.optional(),
});

export const validateUpdateMessage = joi.object({
  message: joi.string().trim().min(1).max(CHAT.MAX_MESSAGE_LENGTH).optional(),
  updatedBy: objectId.optional(),
});


const chatMessageSchema = {
  sender: { type: ObjectId, ref: 'Users', required: true },
  // Optional: group rooms have no single recipient, and support rooms are addressed to the room.
  recipient: { type: ObjectId, ref: 'Users' },
  room: { type: ObjectId, ref: 'ChatRoom', required: true },
  message: { type: String, required: true },
  // Users who have seen the message. The sender is always included; messages without this field are legacy and count as read.
  readBy: [{ type: ObjectId, ref: 'Users' }],
  createdAt: { type: Date, select: true },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(chatMessageSchema, options);

newSchema.index({ room: 1, createdAt: -1 });

newSchema.set("collection", "chatmessage");

const ChatMessage = mongoose.model("ChatMessage", newSchema);

export default ChatMessage;
