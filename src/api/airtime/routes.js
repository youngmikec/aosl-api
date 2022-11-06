import express from 'express';
import {
    fetchHandler,
} from './controller';
import { checkAuth } from '../../middleware';


const router = express.Router();

router.get('/airtime', [checkAuth], fetchHandler);





export default router;