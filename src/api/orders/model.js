import mongoose from 'mongoose';
import joi from 'joi';
import { DATABASE, ORDERS } from '../../constant';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
    orderType: joi.string().trim().valid(...Object.values(ORDERS.TYPES)).required(),
    sendersPhone: joi.string().trim().optional(),
    amount: joi.number().required(),
    amountReceivable: joi.number().required(),

    paymentMethod: joi.string().trim()
    .valid(...Object.values(ORDERS.PAYMENT_METHOD))
    .required(),

    proofImage: joi.string().optional(),
    walletAddress: joi.string().trim().optional()
    .when("paymentMethod", {
        is: ORDERS.PAYMENT_METHOD.WALLET,
        then: joi.required(),
        otherwise: joi.forbidden(),
      }),
    bankName: joi.string().trim().optional()
    .when('paymentMethod', {
        is: ORDERS.PAYMENT_METHOD.BANK,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    accountName: joi.string().trim().optional()
    .when('paymentMethod', {
        is: ORDERS.PAYMENT_METHOD.BANK,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    accountNumber: joi.string().trim().optional()
    .when('paymentMethod', {
        is: ORDERS.PAYMENT_METHOD.BANK,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),


    airtime: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.AIRTIME,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    cryptocurrency: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.BUY_CRYPTO || ORDERS.TYPES.SELL_CRYPTO,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    network: joi.string().trim()
    // .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.BUY_CRYPTO || ORDERS.TYPES.SELL_CRYPTO,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    giftcard: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.GIFTCARD,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    cardType: joi.string().trim().valid('PHYSICAL', 'ECODE')
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.GIFTCARD,
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    cardNumber: joi.string().trim().min(10)
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.GIFTCARD,
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    // user: joi.string()
    // .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    // .required(),
    createdBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})



export const validateUpdate = joi.object({
    orderType: joi.string().trim().valid(...Object.values(ORDERS.TYPES)).required(),
    sendersPhone: joi.string().trim().optional()
    .when('orderType', {
        is: ORDERS.TYPES.AIRTIME,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    amount: joi.number().optional(),
    amountReceivable: joi.number().optional(),

    paymentMethod: joi.string().trim()
    .valid(...Object.values(ORDERS.PAYMENT_METHOD))
    .optional(),

    proofImage: joi.string().optional(),
    walletAddress: joi.string().trim().optional()
    .when("paymentMethod", {
        is: ORDERS.PAYMENT_METHOD.WALLET,
        then: joi.required(),
        otherwise: joi.forbidden(),
      }),
    bankName: joi.string().trim().optional()
    .when('paymentMethod', {
        is: ORDERS.PAYMENT_METHOD.BANK,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    accountName: joi.string().trim().optional()
    .when('paymentMethod', {
        is: ORDERS.PAYMENT_METHOD.BANK,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),
    accountNumber: joi.string().trim().optional()
    .when('paymentMethod', {
        is: ORDERS.PAYMENT_METHOD.BANK,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),


    airtime: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.AIRTIME,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    cryptocurrency: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.BUY_CRYPTO || ORDERS.TYPES.SELL_CRYPTO,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    network: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.BUY_CRYPTO || ORDERS.TYPES.SELL_CRYPTO,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    giftcard: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
    .when('orderType', {
        is: ORDERS.TYPES.GIFTCARD,
        then: joi.required(),
        otherwise: joi.forbidden(),
    }),

    updatedBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})

export const validatePublicUpdate = joi.object({
    
    updatedBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})


export const schema = {
    orderCode: { type: String, trim: true, select: true },
    sendersPhone: { type: String, trim: true, select: true },
    amount: { type: Number, select: true },
    amountReceivable: { type: Number, select: true },
    user: { type: ObjectId, ref: "Users", required: true, select: true},
    orderType: { 
        type: String, 
        enum: Object.values(ORDERS.TYPES),
        required: true,
        select: true
    },
    status: { 
        type: String, 
        enum: Object.values(ORDERS.STATUS),
        required: true,
        default: 'PENDING',
        select: true
    },
    proofImage: { 
        type: String, 
        select: true,
    },
    paymentMethod: { 
        type: String, 
        enum: Object.values(ORDERS.PAYMENT_METHOD),
        required: true,
        default: 'BANK',
        select: true
    },
    network: { type: String, select: true},
    bankName: { type: String, select: true},
    accountName: { type: String, select: true},
    accountNumber: { type: String, select: true},
    walletAddress: { type: String, select: true},
    platform: { type: String, select: true},
    airtime: { type: ObjectId, ref: "Airtime", select: true },
    cryptocurrency: { type: ObjectId, ref: "Cryptocurrency", select: true },
    giftcard: { type: ObjectId, ref: "Giftcard", select: true },
    createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
    approvedBy: { type: ObjectId, ref: "Users", select: true },
    updatedBy: { type: ObjectId, ref: "Users", select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.set('collection', 'orders');

const Orders = mongoose.model('Orders', newSchema);

export default Orders;