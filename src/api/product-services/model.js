import joi from "joi";
import mongoose from "mongoose";
import { APPLICATION, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

export const validateCreate = joi.object({
  title: joi.string().trim().required(),
  subTitle: joi.string().trim().optional(),
  url: joi.string().optional(),
  description: joi.string().required(),
  features: joi.array().items(joi.string()).optional(),
  status: joi.string().valid(...Object.values(STATUS)).optional(),
  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  title: joi.string().trim().optional(),
  subTitle: joi.string().trim().optional(),
  url: joi.string().optional(),
  description: joi.string().optional(),
  features: joi.array().items(joi.string()).optional(),
  status: joi.string().valid(...Object.values(STATUS)).optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  code: { type: String, trim: true },
  title: { type: String, trim: true, required: true },
  subTitle: { type: String, trim: true, select: true },
  description: { type: String, trim: true, required: true },
  url: { type: String, trim: true, },
  image: {
    type: String,
    select: true,
  },
  features: {
    type: Array,
    select: true,
  },
  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.ACTIVE,
    required: true,
    select: true,
  },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ name: 1 }, { unique: true });

newSchema.set("collection", "product-services");

const ProductServices = mongoose.model("ProductServices", newSchema);

export default ProductServices;
