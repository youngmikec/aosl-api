import mongoose from "mongoose";
import joi from "joi";
import { DATABASE } from "../../constant/index.js";


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateSendMessage = joi.object({
  sender: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
  recipient: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
  room: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
  message: joi.string().required(),
  createdBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateUpdateMessage = joi.object({
  sender: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
  recipient: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
  room: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
  message: joi.string().optional(),
  updatedBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});


const chatMessageSchema = {
  sender: { type: ObjectId, ref: 'Users', required: true },
  recipient: { type: ObjectId, ref: 'Users', required: true },
  room: { type: ObjectId, ref: 'ChatRoom', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(chatMessageSchema, options);

newSchema.set("collection", "chatmessage");

const ChatMessage = mongoose.model("ChatMessage", newSchema);

export default ChatMessage;
