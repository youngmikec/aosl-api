import express from 'express';
import {
  handleFetchChats,
  handleSendMessage,
  handleCreateRoom,
  handleDeleteChat,
  handleFetchChatRooms,
  handleDeleteChatRoom,
} from './controller.js';

import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();


router.get('/chat-messages', [checkAuth], handleFetchChats);

router.get('/chat-rooms', [checkAuth], handleFetchChatRooms);

router.post('/send-message', [checkAuth], handleSendMessage);

router.post('/create-room', [checkAuth, isValidAdmin], handleCreateRoom);

router.delete('/delete-chat/:recordId', [checkAuth, isValidAdmin], handleDeleteChat);
router.delete('/chat-room/:recordId', [checkAuth, isValidAdmin], handleDeleteChatRoom);

export default router;