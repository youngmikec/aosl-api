import mongoose from "mongoose";
import joi from "joi";
import { DATABASE, ORDERS } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// "transactions": [{
    //   "item_list": {
    //       "items": [{
    //           "name": "item",
    //           "sku": "item",
    //           "price": "1.00",
    //           "currency": "USD",
    //           "quantity": 1
    //       }]
    //   },
    //   "amount": {
    //       "currency": "USD",
    //       "total": "1.00"
    //   },
    //   "description": "This is the payment description."
    // }]

export const validatePayment = joi.object({
  transaction: joi.array().items({
    item_list: joi.object({
      items: joi.array().items({
        name: joi.string().trim().required(),
        serviceCode: joi.string().trim().required(),
        price: joi.string().trim().required(),
        quantity: joi.number().default(1).required(),
      }).required(),
    }).required(),
    amount: joi.object({
      currency: joi.string().trim().required(),
      total: joi.string().trim().required(),
    }).required(),
    description: joi.string().trim().required(),
  }).required(),
})

export const validateCreate = joi.object({
  amount: joi.number().required(),
  userDetails: joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().trim().required(),
    address: joi.string().required(),
  }).required(),

  paymentMethod: joi
    .string()
    .trim()
    .valid(...Object.values(ORDERS.PAYMENT_METHOD))
    .optional(),
  status: joi
    .string()
    .trim()
    .valid(...Object.values(ORDERS.STATUS))
    .optional(),
  paymentGateway: joi
    .string()
    .trim()
    .valid(...Object.values(ORDERS.PAYMENT_GATEWAY))
    .optional(),

  productService: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
  
  createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdate = joi.object({
  amount: joi.number().required(),
  userDetails: joi.object({
    firstName: joi.string().trim().optional(),
    lastName: joi.string().trim().optional(),
    email: joi.string().email().optional(),
    phoneNumber: joi.string().trim().optional(),
    address: joi.string().optional(),
  }).optional(),

  paymentMethod: joi
    .string()
    .trim()
    .valid(...Object.values(ORDERS.PAYMENT_METHOD))
    .optional(),
  status: joi
    .string()
    .trim()
    .valid(...Object.values(ORDERS.STATUS))
    .optional(),
  paymentGateway: joi
    .string()
    .trim()
    .valid(...Object.values(ORDERS.PAYMENT_GATEWAY))
    .optional(),

  productService: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),

  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validatePublicUpdate = joi.object({
  updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const schema = {
  orderCode: { type: String, trim: true, select: true },
  amount: { type: Number, select: true },
  userDetails: {
    firstName: { type: String, trim: true, select: true },
    lastName: { type: String, trim: true, select: true },
    email: { type: String, trim: true, select: true },
    phoneNumber: { type: String, trim: true, select: true },
    address: { type: String, trim: true, select: true },
  },
  invoiceUrl: { type: String, select: true },
  status: {
    type: String,
    enum: Object.values(ORDERS.STATUS),
    required: true,
    default: "PENDING",
    select: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(ORDERS.PAYMENT_METHOD),
    required: true,
    default: ORDERS.PAYMENT_METHOD.GATEWAY,
    select: true,
  },
  paymentGateway: {
    type: String,
    enum: Object.values(ORDERS.PAYMENT_GATEWAY),
    required: true,
    default: ORDERS.PAYMENT_GATEWAY.PAYPAL,
    select: true,
  },
  productService: { type: ObjectId, ref: "ProductServices", select: true },
  createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
  approvedBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.set("collection", "orders");

const Orders = mongoose.model("Orders", newSchema);

export default Orders;
