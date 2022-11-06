import express from 'express';
import {
    fetchHandler,
    createHandler,
} from './controller';
import { checkAuth, isValidAdmin } from '../../middleware';


const router = express.Router();

router.get('/airtime', [checkAuth], fetchHandler);


// create airtime
router.post('/airtime', [checkAuth, isValidAdmin], createHandler);


export default router;