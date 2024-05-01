import mongoose from "mongoose";
import joi from "joi";
import { DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


export const validateCreateRoom = joi.object({
  name: joi.string().required(),
  roomImage: joi.string().optional(),
  members: joi.array().items(joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")).required(),
  createdBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateUpdateRoom = joi.object({
  name: joi.string().optional(),
  roomImage: joi.string().optional(),
  members: joi.array().items(joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")).optional(),
  updatedBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});


const chatRoomSchema = {
  name: { type: String, required: true },
  members: [{ type: ObjectId, ref: 'Users' }],
  roomImage: { type: String, select: true, default: 'https://aosl-online.com/wp-content/uploads/2024/01/LOGO-W.png' },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;

const newSchema = new Schema(chatRoomSchema, options);

newSchema.set("collection", "chatRoom");

const ChatRoom = mongoose.model("ChatRoom", newSchema);

export default ChatRoom;
