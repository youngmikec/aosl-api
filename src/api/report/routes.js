import express from 'express';
import { fetchHandler } from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();


router.get('/reports', [checkAuth, isValidAdmin], fetchHandler);

export default router;