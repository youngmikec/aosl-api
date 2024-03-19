import aqp from "api-query-params";
import { generateModelCode, setLimit } from "../../util/index.js";

import Users from "../users/model.js";
import ChatMessage, { validateSendMessage } from "./model.js";
import ChatRoom, { validateCreateRoom } from './chat-room-model.js'

const module = 'ChatMessage';

export const fetchChatsService = async (query) => {
  try {
      let { filter, skip, population, sort, projection } = aqp(query);
      const searchQuery = filter.q ? filter.q : false;
      if(searchQuery) {
          const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          filter.$or = [
            { name: { $regex: new RegExp(searchString, "i") } },
            { shortName: { $regex: new RegExp(searchString, "i") } },
            { $text: { $search: escaped, $caseSensitive: false } },
          ];
          delete filter.q;
      }
      let { limit } = aqp(query);
      limit = setLimit(limit);
      if (!filter.deleted) filter.deleted = 0;

      const total = await ChatMessage.countDocuments(filter).exec();

      const result = await ChatMessage.find(filter)
          .populate(population)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .select(projection)
          .exec();
      
      if(!result){
          throw new Error(`${module} record not found`);
      }
      const count = result.length;
      const msg = `${count} ${module} record(s) retrieved successfully!`;
      return { payload: result, total, count, msg, skip, limit, sort };

  }catch ( err ) {
      throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
}

export const fetchChatRoomService = async (query) => {
  try {
      let { filter, skip, population, sort, projection } = aqp(query);
      const searchQuery = filter.q ? filter.q : false;
      if(searchQuery) {
          const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          filter.$or = [
            { name: { $regex: new RegExp(searchString, "i") } },
            { shortName: { $regex: new RegExp(searchString, "i") } },
            { $text: { $search: escaped, $caseSensitive: false } },
          ];
          delete filter.q;
      }
      let { limit } = aqp(query);
      limit = setLimit(limit);
      if (!filter.deleted) filter.deleted = 0;

      const total = await ChatRoom.countDocuments(filter).exec();

      const result = await ChatRoom.find(filter)
          .populate(population)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .select(projection)
          .exec();
      
      if(!result){
          throw new Error(`${module} record not found`);
      }
      const count = result.length;
      const msg = `${count} ${module} record(s) retrieved successfully!`;
      return { payload: result, total, count, msg, skip, limit, sort };

  }catch ( err ) {
      throw new Error(`Error retrieving ${module} record ${error.message}`);
  }
}

export const sendMessageService = async (data) => {
    try {
      const { error } = validateSendMessage.validate(data);
      if(error) throw new Error(`${error.message}`);

      const { recipient, sender } = data;

      if(sender){
        const creator = await Users.findById(sender).exec();
        if (!creator) throw new Error(`User ${sender} not found`);
        data.createdBy = creator.id;
      }

      if(recipient){
        const receiver = await Users.findById(recipient).exec();
        if (!receiver) throw new Error(`User ${recipient} not found`);
      }

      const newRecord = new ChatMessage(data);
      const result = await newRecord.save();
      if(!result) throw new Error(`${module} record not found`);

        return result;

    }catch (err) {
        throw new Error(`Error creating ChatMessage record. ${err.message}`);
    }
}


export const createRoomService = async (data) => {
    try {
        const { error } = validateCreateRoom.validate(data);
        if(error) throw new Error(`${error.message}`);

        const { createdBy, roomImage } = data;
        data.code = await generateModelCode(ChatRoom);

        if(createdBy){
          const creator = await Users.findById(createdBy).exec();
          if (!creator) throw new Error(`User ${createdBy} not found`);
          data.createdBy = creator.id;
        }

        if (roomImage) {
          const uploadResult = await uploadImage(roomImage);
          data.roomImage = uploadResult.url;
        } else {
          console.log("no room image found");
        }

        const newRecord = new ChatRoom(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);

        return result;

    }catch (err) {
        throw new Error(`Error creating ChatMessage record. ${err.message}`);
    }
}

  export async function deleteChatService(recordId) {
    try {
        const result = await ChatMessage.findOneAndRemove({ _id: recordId });
        if (!result) {
            throw new Error(`ChatMessage record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting ChatMessage record. ${err.message}`);
    }
}