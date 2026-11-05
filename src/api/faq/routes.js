import express from "express";
import { fetchHandler, fetchPublicHandler, createHandler, updateHandler, deleteHandler } from "./controller.js";
import { checkAuth, isValidAdmin } from "../../middleware/index.js";

const router = express.Router();

// Public: published questions for the website.
router.get("/faqs/public", fetchPublicHandler);

// Admin management.
router.get("/faqs", [checkAuth, isValidAdmin], fetchHandler);
router.post("/faqs", [checkAuth, isValidAdmin], createHandler);
router.put("/faqs/:recordId", [checkAuth, isValidAdmin], updateHandler);
router.delete("/faqs/:recordId", [checkAuth, isValidAdmin], deleteHandler);

export default router;
