import { Router } from "express";
import { passwordValidatorMiddleware } from "../middlewares/validatepassword.mjs";
import { authMiddleware } from "../middlewares/authmiddleware.mjs";  // ← ADD THIS
import { registerUsers } from "../controllers/auth/registerUsers.mjs";
import { loginUser } from "../controllers/loginUsers.mjs";
import { resendOtp } from "../controllers/auth/resendOtp.mjs";
import { verifyEmail } from "../controllers/auth/verifyEmail.mjs";
import { forgotPassword } from "../controllers/forgotpassword.mjs";
import { verifyResetOtp } from "../controllers/verifyResetOtp.mjs";
import { resetPassword } from "../controllers/resetPassword.mjs"
import { logoutUser } from "../controllers/logoutUsers.mjs";
import { getActiveSessions } from "../controllers/getActiveSessions.mjs"; 
import { deleteAllSessions } from "../controllers/deleteallsession.mjs";

const router = Router();

router.post('/register', passwordValidatorMiddleware, registerUsers);
router.post('/login', loginUser);
router.post('/verifyotp', verifyEmail);
router.post('/resendotp', resendOtp);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyresetotp', verifyResetOtp);
router.put('/resetpassword', passwordValidatorMiddleware, resetPassword);


router.get('/sessions', authMiddleware, getActiveSessions);
router.post('/logout', authMiddleware, logoutUser);
router.delete('/logoutall', authMiddleware, deleteAllSessions);

export default router;