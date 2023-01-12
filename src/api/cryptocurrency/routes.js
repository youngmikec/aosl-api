import express from 'express';

import { 
    fetchHandler,
    fetchPublicHandler,
    createHandler,
    updateHandler,
    deleteHandler,
} from './controller';

import { checkAuth, isValidAdmin } from '../../middleware';


const router = express.Router();


router.get('/cryptos/public', fetchHandler);
router.get('/cryptos', [checkAuth, isValidAdmin], fetchHandler);
// router.get('/cryptos/public', fetchPublicHandler);

// create cryptos
router.post('/cryptos', [checkAuth, isValidAdmin], createHandler);


// update cryptos
router.put('/cryptos/:recordId', [checkAuth, isValidAdmin], updateHandler);


// delete cryptos
router.delete('/cryptos/:recordId', [checkAuth, isValidAdmin], deleteHandler);


export default router;