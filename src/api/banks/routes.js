import express from "express";
import { fetchHandler } from "./controller.js";

const router = express.Router();

router.get("/banks", fetchHandler);

export default router;
