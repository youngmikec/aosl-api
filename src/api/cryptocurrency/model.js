import mongoose from 'mongoose';
import joi from 'joi';

import { AIRTIME, DATABASE } from '../../constant/index';



const { Schema } = mongoose;
const { ObjectId } = Schema.Types;



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
          networkSlug: { type: String, select: true }
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

    createdBy: { type: ObjectId, ref: "User", required: true, select: true },
    updatedBy: { type: ObjectId, ref: "User", select: false },
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