import express from 'express';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';
import {
    fetchAllHandler,
    fetchByBlogIdHandler,
    postCommentHandler,
    createCommentHandler,
    likeCommentHandler,
    updateHandler,
    deleteHandler
} from './controller.js';

const router = express.Router();

router.get('/comments/all', [checkAuth, isValidAdmin], fetchAllHandler);

router.get('/comments/public/byBlogId/:recordId', fetchByBlogIdHandler);

router.post('/comments/public', postCommentHandler);

router.post('/comments/', createCommentHandler);

router.post('/comments/public/like-comment', likeCommentHandler);

router.post('/comments/like-comment', [checkAuth, isValidAdmin], likeCommentHandler);

router.put('/comments/:recordId', [checkAuth, isValidAdmin], updateHandler);

router.delete('/comments/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;