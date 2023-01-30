import mongoose from "mongoose";

import { DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const schema = {
  name: { type: String, trim: true, unique: true },
  sortCode: { type: String, trim: true },
  bankCode: { type: String, trim: true },
  shortName: { type: String, trim: true },
  country: { type: String, required: true, default: "NG" },
  website: { type: String },
  createdBy: { type: ObjectId, ref: "User", required: true },
  updatedBy: { type: ObjectId, ref: "User" },
  erp: { type: Number, default: DATABASE.ERP_VERSION, select: false },
};

const options = DATABASE.OPTIONS;

const newSchema = new Schema(schema, options);
newSchema.set("collection", "bank");

const Bank = mongoose.model("Bank", newSchema);

export default Bank;
