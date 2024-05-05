import express from 'express';
import {
    fetchHandler,
    createHandler,
    updateHandler,
    updateUserHandler,
    fetchPublicHandler,
    deleteHandler,
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';


const router = express.Router();

router.get('/application-status', fetchPublicHandler);

router.get('/applications', [checkAuth], fetchHandler);


// create applications
router.post('/applications-register', createHandler);


// update applications
router.put('/applications/:recordId', [checkAuth, isValidAdmin], updateHandler);
router.put('/applications-user/:recordId', [checkAuth], updateUserHandler);


// delete applications
router.delete('/applications/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;