import express from 'express';
import { fetchHandler, fethUserReportHandler } from './controller.js';
import { checkAuth, isValidAdmin } from '../../middleware/index.js';

const router = express.Router();


router.get('/reports', [checkAuth, isValidAdmin], fetchHandler);
router.get('/reports/:userId', [checkAuth], fethUserReportHandler);

export default router;