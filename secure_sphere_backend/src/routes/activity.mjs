import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware.mjs";
import { getUserActivity } from "../controllers/useractivity/getUserActivity.mjs";
const router=Router();
router.get('/activity', authMiddleware, getUserActivity)
export default router;