import express from 'express';
import ordersRoute from './orders/index.js';
import airtimeRoute from './airtime/index.js';
import userRoute from './users/index.js';
import giftcardRoute from './giftcard/index.js';
import mailsRoute from './mail/index.js';
import reportsRoute from './report/index.js';
import cryptocurrencyRoute from './cryptocurrency/index.js';

const router = express.Router();

router.use(userRoute);
router.use(ordersRoute);
router.use(airtimeRoute);
router.use(mailsRoute);
router.use(reportsRoute);
router.use(giftcardRoute);
router.use(cryptocurrencyRoute);

export default router;