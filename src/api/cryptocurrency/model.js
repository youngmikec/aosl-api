import mongoose from 'mongoose';
import joi from 'joi';

import { AIRTIME, DATABASE } from '../../constant/index.js';



const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateCreate = joi.object({
    name: joi.string().trim().required(),
    shortName: joi.string().trim().required(),
    rate: joi.number().required(),
    cryptoImage: joi.string().optional(),
    barcode: joi.string().optional(),
    walletAddress: joi.string().trim().required(),
    bankName: joi.string().trim().required(),
    accountName: joi.string().trim().required(),
    accountNumber: joi.string().trim().required(),
    exchangePlatform: joi.string().trim().required(),
    networks: joi.array().items(
        joi.object({
            networkName: joi.string().required(),
            networkId: joi.string().optional()
        })
    ).optional(),
    paymentSteps: joi.array().items(
        joi.object({
            title: joi.string().required(),
            description: joi.string().required()
        })
    ).optional(),
    paymentDescription: joi.string().optional(),
    createdBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})

export const validateUpdate = joi.object({
    name: joi.string().trim().optional(),
    shortName: joi.string().trim().optional(),
    rate: joi.number().optional(),
    cryptoImage: joi.string().optional(),
    barcode: joi.string().optional(),
    walletAddress: joi.string().trim().optional(),
    bankName: joi.string().trim().optional(),
    accountName: joi.string().trim().optional(),
    accountNumber: joi.string().trim().optional(),
    exchangePlatform: joi.string().trim().optional(),
    networks: joi.array().items(
        joi.object({
            networkName: joi.string().required(),
            networkId: joi.string().optional()
        })
    ).optional(),
    paymentSteps: joi.array().items(
        joi.object({
            title: joi.string().required(),
            description: joi.string().required()
        })
    ).optional(),
    paymentDescription: joi.string().optional(),
    updatedBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})


export const schema = {
    name: { type: String, trim: true, unique: true, required: true  },
    shortName: { type: String, trim: true },
    walletAddress: { type: String, trim: true },
    exchangePlatform: { type: String, trim: true },
    bankName: { type: String, trim: true, select: true },
    accountName: { type: String, trim: true, select: true },
    accountNumber: { type: String, trim: true, select: true },
    code: { type: String, trim: true },
    rate: { type: Number, default: 1, select: true },
    cryptoImage: { 
        type: String, 
        select: true,
    },
    barcode: { 
        type: String, 
        select: true,
    },
    networks: [
        {
          networkName: { type: String, select: true },
          networkId: { type: String, select: true }
        }
        
    ],

    status: { 
        type: String, 
        enum: Object.values(AIRTIME.STATUS),
        default: 'DEACTIVATED', 
        required: true, 
        select: true
    },

    paymentDescription: { type: String },
    paymentSteps: { type: Array, default: [], select: true },

    createdBy: { type: ObjectId, ref: "Users", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "Users", select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS

const newSchema = new Schema(schema, options);

newSchema.index({name: 1}, { unique: true});
newSchema.set('collection', 'cryptocurrency');

const Cryptocurrency = mongoose.model('Cryptocurrency', newSchema);

export default Cryptocurrency;