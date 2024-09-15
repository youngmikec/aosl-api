import express from 'express';
import {
    publicFetchHandler,
    adminFetchHandler,
    likeBlogPostHandler,
    createHandler,
    updateHandler,
    publishHandler,
    deleteHandler
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();

//endpoint to retrieve all blog posts [Non protected];

router.get('/blog-posts/public', [], publicFetchHandler);

// //endpoint to retrieve all blog posts by staff or admin [protected]
router.get('/blog-posts', [checkAuth, isValidAdmin], adminFetchHandler);

//endpoint to create blog post [protected]
router.post('/blog-posts', [checkAuth, isValidAdmin], createHandler);

// like blog post
router.post('/blog-posts/public/like-blog', likeBlogPostHandler);

router.post('/blog-posts/like-blog', [checkAuth, isValidAdmin], likeBlogPostHandler);


// endpoint to udpate a blog post [protected].
router.put('/blog-posts/:recordId', [checkAuth, isValidAdmin], updateHandler);


// endpoint to publish and unpublish blog post.
router.put('/blog-posts/:recordId', [checkAuth, isValidAdmin], publishHandler);


// endpoint to delete a blog post [protected]
router.delete('/blog-posts/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;