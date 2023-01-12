import mongoose from 'mongoose';
import joi from 'joi';
import { DATABASE } from '../../constant';


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


export const validateCreate = joi.object({
    fullName: joi.string().trim().required(),
    phone: joi.string().trim().max(11).required(),
    email: joi.string().email().required(),
    subject: joi.string().required(),
    message: joi.string().max(5000).required(),
    createdBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})

export const validateUpdate = joi.object({
    fullName: joi.string().trim().optional(),
    phone: joi.string().trim().max(11).optional(),
    email: joi.string().email().optional(),
    subject: joi.string().optional(),
    message: joi.string().max(5000).optional(),
    createdBy: joi.string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
})


export const schema = {
    fullName: { type: String, required: true, select: true },
    phone: { type: String, required: true, select: true },
    email: { type: String, required: true, select: true },
    code: { type: String, trim: true },
    subject: { type: String, required: true, select: true },
    message: { type: String, required: true, select: true },

    createdAt: { type: Date, select: true },
    createdBy: { type: ObjectId, ref: "Users", select: true },
    updatedAt: { type: Date, select: true },
    updatedBy: { type: ObjectId, ref: "Users", select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;
const newSchema = new Schema(schema, options);

newSchema.set('collection', 'mails');

const Mails = mongoose.model('Mails', newSchema);

export default Mails;

