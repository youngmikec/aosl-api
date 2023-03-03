import mongoose from "mongoose";
import joi from "joi";
import { DATABASE, GIFTCARD } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  name: joi.string().trim().required(),
  shortName: joi.string().trim().required(),
  type: joi
    .string()
    .trim()
    .valid(...Object.values(GIFTCARD.TYPE))
    .required(),
  rate: joi.number().required(),
  giftcardImage: joi.string().optional(),
  barcode: joi.string().optional(),
  walletAddress: joi.string().trim().required(),
  bankName: joi.string().trim().required(),
  accountName: joi.string().trim().required(),
  accountNumber: joi.string().trim().required(),
  exchangePlatform: joi.string().trim().required(),
  currencies: joi
    .array()
    .items(
      joi.object({
        rate: joi.number().required(),
        name: joi.string().optional(),
      })
    )
    .optional(),
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
  type: joi
    .string()
    .trim()
    .valid(...Object.values(GIFTCARD.TYPE))
    .optional(),
  rate: joi.number().optional(),
  giftcardImage: joi.string().optional(),
  barcode: joi.string().optional(),
  walletAddress: joi.string().trim().optional(),
  bankName: joi.string().trim().optional(),
  accountName: joi.string().trim().optional(),
  accountNumber: joi.string().trim().optional(),
  exchangePlatform: joi.string().trim().optional(),
  currencies: joi
    .array()
    .items(
      joi.object({
        rate: joi.number().required(),
        name: joi.string().optional(),
      })
    )
    .optional(),
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
  name: { type: String, select: true },
  code: { type: String, select: true },
  rate: { type: Number, default: 1, select: true },
  bankName: { type: String, trim: true, select: true },
  accountName: { type: String, trim: true, select: true },
  accountNumber: { type: String, trim: true, select: true },
  giftcardImage: {
    type: String,
    select: true,
  },
  barcode: {
    type: String,
    select: true,
  },
  type: {
    type: String,
    enum: Object.values(GIFTCARD.TYPE),
    default: GIFTCARD.TYPE.PHYSICAL,
    required: true,
    select: true,
  },

  currencies: [
    {
      rate: { type: Number, select: true },
      name: { type: String, select: true },
    },
  ],

  status: {
    type: String,
    enum: Object.values(GIFTCARD.STATUS),
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

newSchema.set("collection", "giftcards");

const Giftcard = mongoose.model("Giftcard", newSchema);

export default Giftcard;
