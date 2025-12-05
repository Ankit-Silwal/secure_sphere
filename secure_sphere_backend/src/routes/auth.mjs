import { Router } from "express";
import { passwordValidatorMiddleware } from "../middlewares/validatepassword.mjs";
import { registerUsers } from "../controllers/registerUsers.mjs";
import { resendOtp } from "../controllers/resendOtp.mjs";

const router = Router()
router.post('/register', passwordValidatorMiddleware, registerUsers)
router.post('/resent-otp',resendOtp)
export default router