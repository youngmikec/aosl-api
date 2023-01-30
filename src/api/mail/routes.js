import express from 'express';
import { 
    fetchHandler,
    createHandler,
    updateHandler,
    deleteHandler,
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();

router.get('/mails', fetchHandler);

router.post('/mails', createHandler);

router.put('/mails/:recordId', [checkAuth, isValidAdmin], updateHandler);

router.delete('/mails/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;