import express from 'express';
import airtimeRoute from './airtime/index';
import userRoute from './users/index.js';

const router = express.Router();

router.use(airtimeRoute);
router.use(userRoute);

export default router;