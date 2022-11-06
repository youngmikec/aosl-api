import mongoose from 'mongoose';
import { AIRTIME } from '../../constant/index';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


export const schema = {
    name: { type: String, trim: true, unique: true, required: true  },
    shortName: { type: String, trim: true },
    code: { type: String, trim: true },
    rate: { type: Number, default: 1, select: true },
    networkImage: { 
        type: String, 
        select: true,
        default: "https://upload.wikimedia.org/wikipedia/commons/a/af/MTN_Logo.svg"
    },
    txnNetwork: { type: String, trim: true, select: true },
    txnNetworkNumber: { type: String, trim: true, select: true },
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

