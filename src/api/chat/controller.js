import {
  fetchRoomsService,
  mySupportRoomService,
  fetchMessagesService,
  sendMessageService,
  markRoomRead,
  createGroupService,
  updateGroupService,
  deleteRoomService,
  deleteChatService,
} from "./services.js";
import { fail, response, success } from "../../util/response.js";

export const handleFetchChats = async (req, res) => {
  try {
    return response(res, 200, await fetchMessagesService(req.user, req.query));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleFetchChatRooms = async (req, res) => {
  try {
    return response(res, 200, await fetchRoomsService(req.user, req.query));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleMySupportRoom = async (req, res) => {
  try {
    return success(res, 200, await mySupportRoomService(req.user));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleSendMessage = async (req, res) => {
  try {
    return success(res, 201, await sendMessageService(req.user, req.body));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleMarkRead = async (req, res) => {
  try {
    return success(res, 200, await markRoomRead(req.user, req.body.room));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleCreateRoom = async (req, res) => {
  try {
    return success(res, 201, await createGroupService(req.user, req.body));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleUpdateRoom = async (req, res) => {
  try {
    return success(res, 200, await updateGroupService(req.user, req.params.recordId, req.body));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleDeleteChat = async (req, res) => {
  try {
    return success(res, 200, await deleteChatService(req.params.recordId));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const handleDeleteChatRoom = async (req, res) => {
  try {
    return success(res, 200, await deleteRoomService(req.user, req.params.recordId));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};
