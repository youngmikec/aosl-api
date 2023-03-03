import joi from "joi";
import mongoose from "mongoose";
import { AIRTIME, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  name: joi.string().trim().required(),
  shortName: joi.string().trim().required(),
  rate: joi.number().required(),
  networkImage: joi.string().optional(),
  txnNetwork: joi.string().trim().required(),
  txnNetworkNumber: joi.string().trim().required(),
  paymentSteps: joi
    .array()
    .items(
      joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
      })
    )
    .optional(),
  paymentDescription: joi.string().optional(),
  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  name: joi.string().trim().optional(),
  shortName: joi.string().trim().optional(),
  rate: joi.number().optional(),
  networkImage: joi.string().optional(),
  txnNetwork: joi.string().trim().optional(),
  txnNetworkNumber: joi.string().trim().optional(),
  paymentSteps: joi
    .array()
    .items(
      joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
      })
    )
    .optional(),
  status: joi.string().valid("ACTIVE", "DEACTIVATED").optional(),
  paymentDescription: joi.string().optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  name: { type: String, trim: true, unique: true, required: true },
  shortName: { type: String, trim: true },
  code: { type: String, trim: true },
  rate: { type: Number, default: 1, select: true },
  networkImage: {
    type: String,
    select: true,
    default: "https://upload.wikimedia.org/wikipedia/commons/a/af/MTN_Logo.svg",
  },
  txnNetwork: { type: String, trim: true, select: true },
  txnNetworkNumber: { type: String, trim: true, select: true },
  status: {
    type: String,
    enum: Object.values(AIRTIME.STATUS),
    default: "ACTIVE",
    required: true,
    select: true,
  },

  paymentDescription: { type: String },
  paymentSteps: { type: Array, default: [], select: true },

  createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ name: 1 }, { unique: true });

newSchema.set("collection", "airtime");

const Airtime = mongoose.model("Airtime", newSchema);

export default Airtime;
