import express from 'express';
import {
  handleFetchChats,
  handleSendMessage,
  handleCreateRoom,
  handleDeleteChat,
  handleFetchChatRooms,
} from './controller.js';

import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();


router.get('/chat-messages', [checkAuth], handleFetchChats);
router.get('/chat-rooms', [checkAuth], handleFetchChatRooms);

router.post('/send-message', [checkAuth], handleSendMessage);

router.post('/create-room', [checkAuth, isValidAdmin], handleCreateRoom);

router.delete('/delete-chat/:id', [checkAuth, isValidAdmin], handleDeleteChat);

export default router;