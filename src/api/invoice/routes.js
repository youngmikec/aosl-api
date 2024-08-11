import express from 'express';
import { 
  fetchHandler,
  createHandler, 
  fetchPublicHandler,
  clientDetailsHandler,
  createOrderHandler,
  deleteHandler
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';
import { AuthorizePaypal } from '../../middleware/paypal-middleware.js';

const router = express.Router();

router.get('/invoice/publiceRoute', fetchPublicHandler);
router.get('/invoice/getInvoices', [checkAuth, isValidAdmin], fetchHandler);

router.post('/invoice/createInvoice', [checkAuth, isValidAdmin], createHandler);
router.post('/invoice/updateInvoiceClientDetails/:recordId', clientDetailsHandler);

// router.post('/create-order', [AuthorizePaypal], createOrderHandler);
router.post('/invoice/create-order', [AuthorizePaypal], createOrderHandler);

router.delete('/invoice/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;