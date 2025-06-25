import { Router } from "express";
import {
  createOrUpdateCheckInController,
  getCheckInTodayController,
  listCheckInsByDateRangeController,
} from "../controllers";

const router = Router();

router.post("/check-in", createOrUpdateCheckInController);
router.get("/check-in/today", getCheckInTodayController);
router.get("/check-in", listCheckInsByDateRangeController);

export default router;
