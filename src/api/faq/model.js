import joi from "joi";
import mongoose from "mongoose";
import { DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  question: joi.string().trim().min(5).required(),
  answer: joi.string().trim().min(5).required(),
  category: joi.string().trim().required(),
  order: joi.number().integer().min(0).optional(),
  isPublished: joi.boolean().optional(),
  createdBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateUpdate = joi.object({
  question: joi.string().trim().min(5).optional(),
  answer: joi.string().trim().min(5).optional(),
  category: joi.string().trim().optional(),
  order: joi.number().integer().min(0).optional(),
  isPublished: joi.boolean().optional(),
  updatedBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const schema = {
  code: { type: String, trim: true, select: true },
  question: { type: String, trim: true, required: true, select: true },
  answer: { type: String, trim: true, required: true, select: true },
  category: { type: String, trim: true, required: true, select: true },
  // Lower numbers appear first within a category.
  order: { type: Number, default: 0, select: true },
  isPublished: { type: Boolean, default: true, select: true },
  createdAt: { type: Date, select: true },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedAt: { type: Date, select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;
const newSchema = new Schema(schema, options);
newSchema.index({ category: 1, order: 1 });
newSchema.set("collection", "faqs");

const Faqs = mongoose.model("Faqs", newSchema);

export default Faqs;
