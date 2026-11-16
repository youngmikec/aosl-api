import express from 'express';
import {
  handleFetchChats,
  handleSendMessage,
  handleMarkRead,
  handleCreateRoom,
  handleUpdateRoom,
  handleDeleteChat,
  handleFetchChatRooms,
  handleMySupportRoom,
  handleDeleteChatRoom,
} from './controller.js';

import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();

// Every read below is scoped to rooms the caller may access (see access.js).
// Messages: ?room=<id>&limit=30&before=<messageId|ISO date>  (oldest-first page; metadata.total > count means more history)
router.get('/chat-messages', [checkAuth], handleFetchChats);

// Rooms the caller can see, with unread counts.
router.get('/chat-rooms', [checkAuth], handleFetchChatRooms);
// The caller's own support conversation (created on first use).
router.get('/chat-rooms/support', [checkAuth], handleMySupportRoom);

router.post('/send-message', [checkAuth], handleSendMessage);
router.post('/chat-messages/read', [checkAuth], handleMarkRead);

// Admin-only groups.
router.post('/create-room', [checkAuth, isValidAdmin], handleCreateRoom);
router.put('/chat-room/:recordId', [checkAuth, isValidAdmin], handleUpdateRoom);

router.delete('/delete-chat/:recordId', [checkAuth, isValidAdmin], handleDeleteChat);
router.delete('/chat-room/:recordId', [checkAuth, isValidAdmin], handleDeleteChatRoom);

export default router;
