import mongoose from "mongoose";
import joi from 'joi';
import { BLOG, DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


// class BlogPost {
//     id: string;                        // Unique identifier for the post
//     title: string;                     // Title of the blog post
//     content: string;                   // Main content of the post
//     authorId: string;                  // Reference to the author of the post
//     createdAt: Date;                   // Timestamp when the post was created
//     updatedAt: Date;                   // Timestamp for the last update
//     publishedAt?: Date;                // Timestamp when the post was published
//     status: 'draft' | 'published';     // Status of the post
//     tags?: string[];                   // Optional tags for categorization
//     callToActions?: CallToAction[];    // Optional list of CTAs
//     comments?: Comment[];              // Optional list of comments
//     media?: Media[];                   // Optional list of media items (images, videos, GIFs)
//   }
  
//   class Media {
//     id: string;                        // Unique identifier for each media item
//     type: 'image' | 'video' | 'gif';   // Type of media
//     url: string;                       // URL of the media
//     altText?: string;                  // Optional alt text for accessibility and SEO
//   }
  
//   class CallToAction {
//     type: 'button' | 'link';           // Type of CTA
//     label: string;                     // Text on the button or link
//     url: string;                       // URL for the CTA action
//   }
  
//   class Comment {
//     id: string;                        // Unique identifier for the comment
//     authorId: string;                  // Reference to the author of the comment
//     content: string;                   // Comment text
//     createdAt: Date;                   // Timestamp when the comment was created
//     isApproved: boolean;               // Flag to indicate if the comment is approved
//     likes: number;                     // Count of likes on the comment
//     replies?: Comment[];               // Optional replies to the comment
//   }

export const validateCreateBlog = joi.object({
    title: joi.string().trim().min(4).required(),
    subTitle: joi.string().trim().min(4).required(),
    content: joi.string().required(),
    author: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
    createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
    enableComments: joi.boolean().required(),
    enableCommentReplies: joi.boolean().required(),
    media: joi.array().items({
        type: joi.string().valid('image', 'video', 'gif').required(),
        altText: joi.string().trim().required(),
        url: joi.string().required()
    }).optional(),
    status: joi.string().trim().valid(...Object.values(BLOG.STATUS)).required(),
    tags: joi.array()
    .items(
        joi.string().required()
    ).optional()
});

export const validateUpdateBlog = joi.object({
    title: joi.string().trim().min(4).optional(),
    content: joi.string().optional(),
    author: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
    enableComments: joi.boolean().optional(),
    enableCommentReplies: joi.boolean().optional(),
    updatedBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
    media: joi.array().items({
        type: joi.string().valid('image', 'video', 'gif').required(),
        altText: joi.string().trim().required(),
        url: joi.string().required()
    }).optional(),
    status: joi.string().trim().valid(...Object.values(BLOG.STATUS)).optional(),
    tags: joi.array()
    .items(
        joi.string().required()
    ).optional()
});

export const validatePublishData = joi.object({
    status: joi.string().trim().valid(...Object.values(BLOG.STATUS)).optional(),
    createdBy: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .optional(),
});

export const validateLikePost = joi.object({
    blogId: joi
    .string()
    .regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")
    .required(),
    like: joi.number().min(1).max(1).required(),
    type: joi.string().valid('increase', 'decrease').required(),
});

const schema = {
    title: { type: String, required: true, select: true },
    subTitle: { type: String, select: true },
    code: { type: String, required: true, unique: true },
    content: { type: String, required: true, select: true },
    author: { type: ObjectId, ref: 'Users', required: true, select: true },
    status: { type: String, enum: Object.values(BLOG.STATUS), default: BLOG.STATUS.DRAFT, select: true},
    tags: [{ type: String }],
    slug: { type: String, required: true },
    likes: { type: Number, select: true },
    enableComments: { type: Boolean, required: true, default: false, select: true },
    enableCommentReplies: { type: Boolean, required: true, default: false, select: true },
    comments: [{ type: ObjectId, ref: 'Comment' }],
    media: [{ type: ObjectId, ref: 'Media' }],
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

newSchema.set('collection', 'blogs');

const Blog = mongoose.model('Blog', newSchema);

export default Blog;

