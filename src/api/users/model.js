import joi from 'joi';
import mongoose from 'mongoose';
import {
    DATABASE,
    GENDER,
    USER_TYPE,
    COUNTRIES,
    ACCESS_LEVEL,
    USER_ROLE,
  } from "../../constant/index.js";


const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const validateVerifyEmail = joi.object({
    code: joi.string().min(10).min(5).max(5).trim().required(),
    email: joi.string().email().optional()
})

export const validateVerifyResetCode = joi.object({
    id: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").required(),
    resetCode: joi.string().min(5).max(5).trim().required(),
    email: joi.string().email().optional()
})

export const validateForgortPassword = joi.object({
    email: joi.string().email().required(),
    password: joi.string().trim().required(),
    createdBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
})

export const validateAdminUpdate = joi.object({
  code: joi.string().min(5).max(5).optional(),
  email: joi.string().email().optional(),
  password: joi.string().trim().optional(),
  userType: joi.string().valid("ADMIN", "USER").trim().optional(),
  updatedBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
})

export const validateLogin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    currentIp: joi.string().trim().optional(),
    userType: joi.string()
     .valid(...Object.keys(USER_TYPE))
     .optional(),
    type: joi.string().optional(),
})

export const validateCreate = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    phone: joi.string().trim().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    country: joi.string().valid(...COUNTRIES.map(country => country.name)).required(),
})

export const validateUserUpdate = joi.object({
    firstName: joi.string().trim().optional(),
    lastName: joi.string().trim().optional(),
    phone: joi.string().trim().optional(),
    email: joi.string().email().optional(),
    password: joi.string().optional(),
    country: joi.string().valid(...COUNTRIES.map(country => country.name)).optional(),
    profileImage: joi.string().trim().optional(),
    updatedBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
})

export const schema = {
    userType: {
      type: String,
      enum: Object.values(USER_TYPE),
      default: USER_TYPE.USER,
    },
    code: { type: String, select: true },
    country: { type: String, select: true },
    resetCode: { type: String, select: true },
    canResetPassword: { type: String, default: false, select: true },
    balance: { type: Number, default: 0, select: true },
    transactionPin: { type: String, default: "0000", select: false},
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    profileImage: { type: String, trim: true, select: true },
    gender: { type: String, enum: Object.values(GENDER) },
    // birthDate: { type: Date },
    address: { type: String },
    password: { type: String, trim: true, required: true, select: false },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      // eslint-disable-next-line no-useless-escape
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      required: true,
    },
    phone: { type: String, trim: true, required: true, unique: true },
   //  guarantorPhone: { type: String },
    isProfileComplete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    approvedBy: { type: ObjectId },
    approvedDate: { type: Date },
    verifiedBy: { type: ObjectId },
    verifiedDate: { type: Date },
    disengagedBy: { type: ObjectId },
    disengagedDate: { type: Date },
    accessLevel: { type: Number, default: ACCESS_LEVEL.DELETE, min: 0, max: 10, select: true },
    emailNotification: { type: Boolean, default: true },
    smsNotification: { type: Boolean, default: false },
    notifications: { type: Array, default: [] },
    //* Authentication
    lastLogin: { type: Date },
    currentLogin: { type: Date },
    lastIp: { type: String },
    currentIp: { type: String },
    createdBy: { type: ObjectId, select: false },
    updatedBy: { type: ObjectId, select: false },
    deleted: { type: Number, enum: [0, 1], default: 0, select: false },
    deletedAt: { type: Date, select: false },
    deletedBy: { type: ObjectId, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);

newSchema.index({ phone: 1, email: 1 }, { unique: true });
newSchema.index({ surname: 1 });
newSchema.index({ surname: "text", email: "text", phone: "text" });

newSchema.set("collection", "users");

const Users = mongoose.model("Users", newSchema);
 
   
export default Users; 