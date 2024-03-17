import joi from "joi";
import mongoose from "mongoose";
import { JOB, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  title: joi.string().trim().required(),
  description: joi.string().trim().required(),
  renumeration: joi.number().optional(),
  jobImage: joi.string().optional(),
  companyName: joi.string().trim().optional(),
  termDuration: joi.string().trim().required(),
  type: joi.string().valid(...Object.values(JOB.TYPE)).trim().required(),
  paymentDuration: joi.string().valid(...Object.values(JOB.PAYMENTDURATION)).trim().required(),
  paymentMethod: joi.string().valid(...Object.values(JOB.PAYMENTMETHOD)).trim().required(),
  jobRequirements: joi.array().items(joi.string()).required(),
  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  title: joi.string().trim().optional(),
  description: joi.string().trim().optional(),
  renumeration: joi.number().optional(),
  jobImage: joi.string().optional(),
  companyName: joi.string().trim().optional(),
  type: joi.string().valid(...Object.values(JOB.TYPE)).trim().optional(),
  termDuration: joi.string().trim().optional(),
  paymentDuration: joi.string().valid(...Object.values(JOB.PAYMENTDURATION)).trim().optional(),
  paymentMethod: joi.string().valid(...Object.values(JOB.PAYMENTMETHOD)).trim().optional(),
  jobRequirements: joi.array().items(joi.string()).optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  title: { type: String, trim: true, unique: true, required: true },
  description: { type: String, trim: true },
  code: { type: String, trim: true },
  renumeration: { type: Number, default: 1, select: true },
  jobImage: {
    type: String,
    select: true,
    default: "https://upload.wikimedia.org/wikipedia/commons/a/af/MTN_Logo.svg",
  },
  workMode: { 
    type: String, 
    trim: true, 
    enum: Object.values(JOB.WORKMODE),
    select: true 
  },
  type: {
    type: String,
    enum: Object.values(JOB.TYPE),
    default: JOB.STATUS.WORK,
    required: true,
    select: true,
  },
  status: {
    type: String,
    enum: Object.values(JOB.STATUS),
    default: JOB.STATUS.OPEN,
    required: true,
    select: true,
  },
  jobRequirements: {
    type: Array,
    default: [],
    select: true,
    required: true,
  },
  companyName: { type: String, default: 'AOSL', trim: true },
  termDuration: {
    type: String,
    required: true,
    select: true,
  },
  paymentDuration: {
    type: String,
    enum: Object.values(JOB.PAYMENTDURATION),
    default: JOB.PAYMENTDURATION.HOURLY,
    required: true,
    select: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(JOB.PAYMENTMETHOD),
    default: JOB.PAYMENTMETHOD.BANK,
    required: true,
    select: true,
  },
  createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ name: 1 }, { unique: true });

newSchema.set("collection", "jobs");

const Jobs = mongoose.model("Jobs", newSchema);

export default Jobs;
