import joi from "joi";
import mongoose from "mongoose";
import { AIRTIME, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  title: joi.string().trim().required(),
  subject: joi.string().trim().required(),
  message: joi.string().trim().required(),
  status: joi
    .string()
    .trim()
    .valid("PENDING", "PUBLISHED", "DECLINED")
    .optional(),

  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  title: joi.string().trim().required(),
  subject: joi.string().trim().required(),
  message: joi.string().trim().required(),
  status: joi
    .string()
    .trim()
    .valid("PENDING", "PUBLISHED", "DECLINED")
    .optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  code: { type: String, trim: true, unique: true, required: true },
  title: { type: String, trim: true, required: true },
  subject: { type: String, trim: true },
  message: { type: String, trim: true },
  status: { type: String, default: "PUBLISHED", select: true },
  subscribers: { type: Array, select: true, required: true },

  createdAt: { type: Date, select: true },
  createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
  updatedAt: { type: Date, select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ code: 1 }, { unique: true });

newSchema.set("collection", "newsletter");

const Newsletter = mongoose.model("Newsletter", newSchema);

export default Newsletter;
