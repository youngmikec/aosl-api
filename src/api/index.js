import express from 'express';
import ordersRoute from './orders';
import airtimeRoute from './airtime/index';
import userRoute from './users/index.js';
import giftcardRoute from './giftcard/index';
import mailsRoute from './mail/index';
import reportsRoute from './report/index.js';
import cryptocurrencyRoute from './cryptocurrency/index';

const router = express.Router();

router.use(userRoute);
router.use(ordersRoute);
router.use(airtimeRoute);
router.use(mailsRoute);
router.use(reportsRoute);
router.use(giftcardRoute);
router.use(cryptocurrencyRoute);

export default router;