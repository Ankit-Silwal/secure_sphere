import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware.mjs";
import { getUserActivity } from "../controllers/useractivity/getUserActivity.mjs";
import { generateUploadUrl } from "../controllers/user/generateUploader.mjs";
const router=Router();
router.get('/activity', authMiddleware, getUserActivity)
router.get('/uploadurl',authMiddleware,generateUploadUrl)
export default router;