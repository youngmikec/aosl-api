import express from 'express';
import {
    fetchHandler,
    createHandler,
    updateHandler,
    fetchPublicHandler,
    deleteHandler,
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';


const router = express.Router();

router.get('/jobs-posts', fetchPublicHandler);

router.get('/jobs', [checkAuth], fetchHandler);


// create jobs
router.post('/jobs', [checkAuth, isValidAdmin], createHandler);


// update jobs
router.put('/jobs/:recordId', [checkAuth, isValidAdmin], updateHandler);


// delete jobs
router.delete('/jobs/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;