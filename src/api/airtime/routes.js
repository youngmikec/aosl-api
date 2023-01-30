import express from 'express';
import {
    fetchHandler,
    createHandler,
    updateHandler,
    deleteHandler,
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';


const router = express.Router();

router.get('/airtime', [checkAuth], fetchHandler);


// create airtime
router.post('/airtime', [checkAuth, isValidAdmin], createHandler);


// update airtime
router.put('/airtime/:recordId', [checkAuth, isValidAdmin], updateHandler);


// delete airtime
router.delete('/airtime/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;