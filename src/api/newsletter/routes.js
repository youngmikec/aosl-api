import express from "express";
import {
  fetchHandler,
  fetchPublicHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "./controller.js";
import { checkAuth, isValidAdmin } from "../../middleware/index.js";

const router = express.Router();

router.get("/newsletters", [checkAuth, isValidAdmin], fetchHandler);
router.get("/newsletters/public", fetchPublicHandler);

router.post("/newsletter", [checkAuth, isValidAdmin], createHandler);

router.put("/newsletter/:recordId", [checkAuth, isValidAdmin], updateHandler);
router.delete(
  "/newsletter/:recordId",
  [checkAuth, isValidAdmin],
  deleteHandler
);

export default router;
