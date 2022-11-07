import express from 'express';
import airtimeRoute from './airtime/index';
import userRoute from './users/index.js';
import cryptocurrencyRoute from './cryptocurrency/index';

const router = express.Router();

router.use(airtimeRoute);
router.use(userRoute);
router.use(cryptocurrencyRoute);

export default router;