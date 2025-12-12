import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware.mjs";
import { getUserActivity } from "../controllers/useractivity/getUserActivity.mjs";
import { generateUploadUrl } from "../controllers/user/generateUploader.mjs";
import { updateProfilePicture } from "../controllers/user/updateprofilepicture.mjs";
import { getMe } from "../controllers/user/getme.mjs";
const router=Router();
router.get('/activity', authMiddleware, getUserActivity)
router.get('/uploadurl',authMiddleware,generateUploadUrl)
router.post('/profilepictures',authMiddleware,updateProfilePicture)
router.get('/getme',authMiddleware,getMe)

export default router;