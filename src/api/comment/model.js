import mongoose from "mongoose";
import joi from 'joi';
import { DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validatePostComment = joi.object({
    content: joi.string().required(),
    isGuest: joi.boolean().required(),
    commenterName: joi.string().trim().when('isGuest', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional()
    }),
    commenterEmail: joi.string().optional(),
    blog: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
    user: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .when('isGuest', {
        is: false,
        then: joi.required(),
        otherwise: joi.forbidden()
    }),
    createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateUpdateComment = joi.object({
    content: joi.string().optional(),
    blog: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
    isApproved: joi.boolean().optional(),
    likes: joi.number().optional(),
    updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional()
});

export const validateLikePost = joi.object({
    commentId: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
    like: joi.number().min(1).max(1).required(),
    type: joi.string().valid('increase', 'decrease').required(),
});


const schema = {
    code: { type: String, required: true, unique: true },
    isGuest: { type: Boolean, default: true },
    commenterName: { type: String, select: true },
    commenterEmail: { type: String, select: true },
    content: { type: String, required: true, select: true },
    blog: { type: ObjectId, ref: 'Blog', select: true },
    author: { type: ObjectId, ref: 'Users', select: true },
    isApproved: { type: Boolean, default: true, select: true },
    replies: [{ type: ObjectId, ref: 'Comment' }],
    likes: { type: Number, select: true },

    user: { type: ObjectId, ref: 'Users', select: true},
    createdBy: { type: ObjectId, ref: 'Users', select: true},
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
    updatedBy: { type: ObjectId, ref: 'Users'},
    publishedAt: { type: Date, select: false },
    deleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.set('collection', 'comments');

const Comment = mongoose.model('Comment', newSchema);

export default Comment;

