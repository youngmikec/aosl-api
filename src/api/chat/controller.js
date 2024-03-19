import { fail, response, success } from "../../util/response.js";
import {
  fetchChatsService,
  sendMessageService,
  createRoomService,
  deleteChatService,
  fetchChatRoomService
} from './services.js';


export const handleFetchChats = async (req, res) => {
  try {
    const result = await fetchChatsService(req.query);
    return response(res, 200, result);
  }catch(err) {
    console.log(err);
    return fail(res, 400, `${err.message}`);
  }
}

export const handleFetchChatRooms = async (req, res) => {
  try {
    const result = await fetchChatRoomService(req.query);
    return response(res, 200, result);
  }catch(err) {
    return fail(res, 400, `${err.message}`);
  }
}

export const handleSendMessage = async (req, res) => {
  try {
      const result = await sendMessageService(req.body);
      return success(res, 201, result);
  } catch ( err ) {
      return fail(res, 400, `${err.message}`);
  }
}

export const handleCreateRoom = async (req, res) => {
  try {
      const result = await createRoomService(req.body);
      return success(res, 201, result);
  } catch ( err ) {
      return fail(res, 400, `${err.message}`);
  }
}

export const handleDeleteChat = async (req, res) => {
  try {
      const result = await deleteChatService(req.params.recordId);
      return success(res, 200, result);
  } catch (err) {
      return fail(res, 400, `${err.message}`);
  }
}