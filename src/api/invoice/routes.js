import express from 'express';
import { 
  fetchHandler,
  createHandler, 
  fetchPublicHandler,
  clientDetailsHandler,
  deleteHandler
} from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();

router.get('/invoice/publiceRoute', fetchPublicHandler);
router.get('/invoice/getInvoices', [checkAuth, isValidAdmin], fetchHandler);

router.post('/invoice/createInvoice', [checkAuth, isValidAdmin], createHandler);
router.post('/invoice/updateInvoiceClientDetails/:recordId', clientDetailsHandler);

router.delete('/invoice/:recordId', [checkAuth, isValidAdmin], deleteHandler);

export default router;