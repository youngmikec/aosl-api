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

router.get('/product-services/public', fetchPublicHandler);

router.get('/product-services', [checkAuth], fetchHandler);


// create product-services
router.post('/product-services', [checkAuth, isValidAdmin], createHandler);


// update product-services
router.put('/product-services/:recordId', [checkAuth, isValidAdmin], updateHandler);


// delete product-services
router.delete('/product-services/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;