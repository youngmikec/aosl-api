import express from 'express';
import {
    fetchHandler,
    createHandler,
    updateHandler,
    deleteHandler,
    createPaymentHandler,
    updatePublicHandler,
    createInvoiceHandler
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';


const router = express.Router();


router.get('/orders', [checkAuth], fetchHandler);

router.post('/orders', [checkAuth, isValidAdmin], createHandler);
router.post('/orders/createInvoice', [checkAuth, isValidAdmin], createInvoiceHandler);
router.post('/orders/make-payment', createPaymentHandler);


// update orders
router.put('/orders/:recordId', [checkAuth, isValidAdmin], updateHandler);
router.put('/orders/public/:recordId', [checkAuth], updatePublicHandler);


// delete orders
router.delete('/orders/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;