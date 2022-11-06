import express from 'express';
import userRoute from './users/index.js';

const router = express.Router();

router.use(userRoute);

export default router;