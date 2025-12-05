import { Router } from "express";
import { passwordValidatorMiddleware } from "../middlewares/validatepassword.mjs";
import { registerUsers } from "../controllers/registerUsers.mjs";
import { resendOtp } from "../controllers/resendOtp.mjs";
import { verifyEmail } from "../controllers/verifyEmail.mjs";

const router = Router()
router.post('/register', passwordValidatorMiddleware, registerUsers)
router.post('/verify-email',verifyEmail)
router.post('/resent-otp',resendOtp)
export default router