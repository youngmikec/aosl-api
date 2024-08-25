import joi from "joi";
import mongoose from "mongoose";
import { AOSL_APP, DATABASE, INVOICE, PAYMENT } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
  services: joi.array().items({
    // serviceId: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
    name: joi.string().trim().required(),
    amount: joi.number().required(),
    quantity: joi.number().required(),
    totalAmount: joi.number().required(),
  }).required(),
  clientName: joi.string().trim().required(),
  clientEmail: joi.string().trim().required(),
  clientPhone: joi.string().trim().required(),
  clientAddress: joi.string().trim().required(),
  tax: joi.number().optional(),
  discount: joi.number().optional(),
  issueDate: joi.date().required(),
  dueDate: joi.date().required(),
  totalAmount: joi.number().required(),
  createdBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateClientDetails = joi.object({
  clientName: joi.string().optional(),
  clientEmail: joi.string().email().optional(),
  clientPhone: joi.string().optional(),
  clientAddress: joi.string().optional(),
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateCreateOrder = joi.object({
  purchaseItems: joi.array().items({
    name: joi.string().required(),
    description: joi.string().required(),
    quantity: joi.number().min(1).required(),
    unit_amount: joi.number().required()
  }).required(),
  invoiceCode: joi.string().required(),
  totalAmount: joi.number().required(),
  currency_code: joi.string().required(),
});

const schema = {
  invoiceCode: { type: String, select: true, trim: true, required: true },
  issueDate: { type: Date, select: true, required: true },
  dueDate: { type: Date, select: true, required: true },
  clientName: { type: String, select: true, required: false },
  clientEmail: { type: String, select: true, required: false },
  clientPhone: { type: String, select: true, required: false },
  clientAddress: { type: String, select: true, required: false },
  invoiceUrl: { type: String, select: true },

  services: {
    type: [
      {
        name: { type: String, select: true },
        amount: { type: Number, select: true },
        quantity: { type: Number, select: true },
        totalAmount: { type: Number, select: true },
      },
    ],
    select: true,
  },
  status: {
    type: String,
    enum: Object.values(INVOICE.STATUS),
    default: INVOICE.STATUS.PENDING,
  },
  companyName: { type: String, select: true, default: AOSL_APP.COMPANY_DATA.NAME },
  // companyAddress: { type: String, select: true, default: AOSL_APP.COMPANY_DATA.ADDRESS },
  companyPhone: { type: String, select: true, default: AOSL_APP.COMPANY_DATA.PHONE },
  companyEmail: { type: String, select: true, default: AOSL_APP.COMPANY_DATA.EMAIL },

  subTotal: { type: Number, select: true },
  tax: { type: Number, select: true, default: INVOICE.TAX },
  discount: { type: Number, select: true, default: INVOICE.DISCOUNT }, // in percentage
  totalAmount: { type: Number, select: true },
  amountPaid: { type: Number, select: true, default: 0 },
  balanceAmount: { type: Number, select: true, default: 0 },
  currency: { type: String, select: true, default: INVOICE.CURRENCY.GBP },
  paymentMethod: {type: String, select: true, default: PAYMENT.PAYMENT_METHOD.GATEWAY},
  paymentGateway: { type: String, select: true, default: PAYMENT.GATEWAY.PAYPAL},

  createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);
newSchema.set("collection", "invoices");

const Invoice = mongoose.model("Invoice", newSchema);

export default Invoice;