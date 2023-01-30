import express from 'express';
import { 
    fetchHandler,
    createHandler,
    updateHandler,
    deleteHandler
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();


router.get('/giftcards', [checkAuth], fetchHandler);

// create giftcards
router.post('/giftcards', [checkAuth, isValidAdmin], createHandler);


// update giftcards
router.put('/giftcards/:recordId', [checkAuth, isValidAdmin], updateHandler);


// delete giftcards
router.delete('/giftcards/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;