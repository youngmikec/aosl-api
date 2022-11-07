import express from 'express';

import { 
    fetchHandler,
    fetchPublicHandler,
} from './controller';

import { checkAuth } from '../../middleware';


const router = express.Router();


router.get('/cryptos', [checkAuth], fetchHandler);
// router.get('/cryptos/public', fetchPublicHandler);


export default router;