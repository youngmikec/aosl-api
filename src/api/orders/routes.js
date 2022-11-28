import express from 'express';
import {
    fetchHandler,
    createHandler,
    updateHandler,
    deleteHandler,
    updatePublicHandler,
} from './controller';
import { checkAuth, isValidAdmin } from '../../middleware';


const router = express.Router();


router.get('/orders', [checkAuth], fetchHandler);

router.post('/orders', [checkAuth], createHandler);


// update orders
router.put('/orders/:recordId', [checkAuth, isValidAdmin], updateHandler);
router.put('/orders/public/:recordId', [checkAuth], updatePublicHandler);


// delete orders
router.delete('/orders/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;