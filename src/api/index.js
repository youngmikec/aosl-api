import express from "express";
import applicationRoute from './applications/index.js';
import jobRoute from './job/index.js';
import chatRoute from './chat/index.js';
import productServiceRoute from './product-services/index.js';
import bankRoute from "./banks/index.js";
import ordersRoute from "./orders/index.js";
import invoiceRoute from './invoice/index.js';
import userRoute from "./users/index.js";
import giftcardRoute from "./giftcard/index.js";
import mailsRoute from "./mail/index.js";
import reportsRoute from "./report/index.js";
import subscribersRoute from "./subscribers/index.js";
import newsletterRoute from "./newsletter/index.js";
import cryptocurrencyRoute from "./cryptocurrency/index.js";

const router = express.Router();

router.use(jobRoute);
router.use(applicationRoute);
router.use(chatRoute);
router.use(productServiceRoute);


router.use(userRoute);
router.use(bankRoute);
router.use(ordersRoute);
router.use(invoiceRoute);
router.use(mailsRoute);
router.use(reportsRoute);
router.use(giftcardRoute);
router.use(newsletterRoute);
router.use(subscribersRoute);
router.use(cryptocurrencyRoute);

export default router;
