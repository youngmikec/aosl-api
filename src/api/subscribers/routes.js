import express from "express";
import { checkAuth, isValidAdmin } from "../../middleware/index.js";
import {
  fetchHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "./controller.js";

const router = express.Router();

router.get("/subscribers", [checkAuth, isValidAdmin], fetchHandler);

router.post("/subscribers", createHandler);

router.put("/subscribers/:recordId", [checkAuth, isValidAdmin], updateHandler);

router.delete(
  "/subscribers/:recordId",
  [checkAuth, isValidAdmin],
  deleteHandler
);

export default router;
