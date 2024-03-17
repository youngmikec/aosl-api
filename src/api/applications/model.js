import joi from "joi";
import mongoose from "mongoose";
import { APPLICATION, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  firstName: joi.string().trim().required(),
  lastName: joi.string().trim().required(),
  email: joi.string().email().required(),
  phoneNumber: joi.string().required(),
  state: joi.string().required(),
  nationality: joi.string().required(),
  certLevel: joi.string().valid(...Object.values(APPLICATION.CERTLEVEL)).required(),
  address: joi.string().required(),
  role: joi.string().required(),
  biography: joi.string().optional(),
  resume: joi.string().optional(),
  skills: joi.string().optional(),
  experienceYears: joi.number().required(),
  status: joi.string().valid(...Object.values(APPLICATION.STATUS)).optional(),
  job: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  firstName: joi.string().trim().optional(),
  lastName: joi.string().trim().optional(),
  email: joi.string().email().optional(),
  phoneNumber: joi.string().optional(),
  state: joi.string().optional(),
  nationality: joi.string().optional(),
  certLevel: joi.string().valid(...Object.values(APPLICATION.CERTLEVEL)).optional(),
  address: joi.string().optional(),
  role: joi.string().optional(),
  biography: joi.string().optional(),
  resume: joi.string().optional(),
  skills: joi.string().optional(),
  experienceYears: joi.number().optional(),
  status: joi.string().valid(...Object.values(APPLICATION.STATUS)).optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true },
  phoneNumber: { type: String, trim: true, required: true },
  state: { type: String, trim: true, required: true },
  nationality: { type: String, trim: true, required: true },
  address: { type: String, trim: true, required: true },
  biography: { type: String },
  code: { type: String, trim: true },
  resume: {
    type: String,
    select: true,
  },
  certLevel: { 
    type: String, 
    trim: true, 
    enum: Object.values(APPLICATION.CERTLEVEL),
    select: true 
  },
  role: { type: String, required: true, select: true },
  experienceYears: { type: Number, required: true, select: true },
  skills: {
    type: String,
    select: true
  },
  status: {
    type: String,
    enum: Object.values(APPLICATION.STATUS),
    default: APPLICATION.STATUS.APPLIED,
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

newSchema.set("collection", "applications");

const Applications = mongoose.model("Applications", newSchema);

export default Applications;
