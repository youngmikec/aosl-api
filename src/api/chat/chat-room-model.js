import mongoose from "mongoose";
import joi from "joi";
import { DATABASE } from "../../constant/index.js";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


export const validateCreateRoom = joi.object({
  name: joi.string().required(),
  roomImage: joi.string().optional(),
  members: joi.array().items(joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")).required(),
  createdBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});

export const validateUpdateRoom = joi.object({
  name: joi.string().optional(),
  roomImage: joi.string().optional(),
  members: joi.array().items(joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID")).optional(),
  updatedBy: joi.string().regex(DATABASE.OBJECT_ID_REGEX, "valid objectID").optional(),
});


const chatRoomSchema = {
  name: { type: String, required: true },
  members: [{ type: ObjectId, ref: 'Users' }],
  roomImage: { type: String, select: true, default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAjCAYAAAATx8MeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAS6SURBVHgB7ZdfTFNXHMe/9962FEtbSq2FIlBANpUp00znpiY6g7psGuYIJlsivkwzHzad8WG6zC3L9EEzX8Q3o9GFxG0RGC4zxAg6HTFg5I/SWQRpgUILLW25bbn39t670yXLXncuvpjwSW7Ow/3z+53f93fP+R5ggQVeLBxeAN3d3Xqf11vmLi+vrK+vT3Z0dCQxDxjMg51b122LJ5hjPJ9YH5+N2wRBhKwoAavVcm5waOgsNMJCIx/tXn0SwvQtRk7tmEvN2dKyDFlOg1EVV2xm5swrZWUnVVXVNGlN8h38eNvXAwPebzmGRUJgoajsPyU36A1gWBYcp4OqKlv+6u9/+LCnxwtKqGdy+vRpd3Njw+M91RtNVqsNja1/YjwYhd1sxtbVq7DS7Sb1Z5GKx3G2pbXj2ahvKyjRgZIx//Ptxfl5piOfHAKjy8G+Dz+FKspgiXwZkqIIXyCAEY8H+Vbzlrff+MB+pakpTBODuqfmYhOpTZVuIK0AigEcq4POYABrNILJyoI+M6oq0iQ5RVaQbbevBSXUSTntEscRecAZANJLUP+7RxobfCKBCJEukRl5Hl6PRw9KqOWDwDqc+Q40Nv+Mts5BlJeUYn9NDWwWC/xEtistLejq60OFzYalubmoKC42tN+/TxWCOqndVSvev9R8A+9tr0ZluRPhcBQ3b7QiHo1AZPUYHfXDSRJKxmIYj0Swd2lBLXmtmSYGdVK5FnNk84Y3sWH7HiyfnEVyIpxZmyBDQOdICGutFjhJ1WQ+gXh7O9x6NgBKqHsqx2q5K6VlRIeHYDBaYCooRI7LiTxXAfjxcRTa8uAil0oafYnNCqMuqwuUUFeq8K31f6xNiChyFYMzOyEIAozZKUiSilWrVqKkrAIWvR5iLAq3ffHIxGtV10EJdaUYx6bu0sVLapREDMpcCpGpEBouXkHvEw/u9T1GeGoKkfExyNEolucX7Kqrq5NpY2ja+2Rddm86GYQizOBq60/o7exDcDCEoQEvmtva4Pf5wIuiumzfvmFogH5JICh8rEAReOikCD4/cAh8OI7fb9/B0WNHESRVCnmfQhAl5mlTk4M87gMlmirVOZWuFhQFYngcLO+HJS8XNXW1sJhzwJBFM+MYVI5F3yy7FxrQ5BLsrtVXhWTEWmIzQ54OQZwMIub1I+obQYj0FJEOg9Mp3OkPVNfW7t/24MGtSzTfp5Lv8OFvcpN86uTQs+Gi58N6SIID77zqIhuiBFESyCAhQTxVIq2ia5Qn/komi+nY5q6u3tp166p++b9xqORzOJYclNPJA5zehGjCgB87/bg7GAa3aBFMmW3F5SIS5uG3JyGkJAUGgw4VFSX3JIm7TROH2k9duHDx3UePfBcmJ6fd0WgSDMPh9aI87KgsxOBUHDf7x4jxE2E0snC5nA2XL5/6jGEYhSaGJrt64kRDUSAw8Z0kSfWjoyFiUYhDYIinIgmyLAeTKQs5OdnfX7t29itoYF4Hh+PHfzgSDEbO+P0TnNNph98fhJn8gaWlrp7z50+sgUY0HxwynDr1xTm9XrdsxYryEUlKIz/fjuJi5/WqquW7MA/mVal/aWz8dbHHM/Llxo1renbu3HwVCyywwEvK32fN/17XlJTZAAAAAElFTkSuQmCC' },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: ObjectId, ref: "Users", select: true },
  updatedBy: { type: ObjectId, ref: "Users", select: false },
  deleted: { type: Boolean, default: false, select: false },
  deletedAt: { type: Date, select: false },
  deletedBy: { type: ObjectId, select: false },
}

const options = DATABASE.OPTIONS;

const newSchema = new Schema(chatRoomSchema, options);

newSchema.set("collection", "chatRoom");

const ChatRoom = mongoose.model("ChatRoom", newSchema);

export default ChatRoom;
