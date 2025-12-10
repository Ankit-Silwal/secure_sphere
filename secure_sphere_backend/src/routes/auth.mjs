import { Router } from "express";
import { passwordValidatorMiddleware } from "../middlewares/validatepassword.mjs";
import { authMiddleware } from "../middlewares/authmiddleware.mjs";
import { registerUsers } from "../controllers/auth/registerUsers.mjs";
import { resendOtp } from "../controllers/auth/resendOtp.mjs";
import { verifyEmail } from "../controllers/auth/verifyEmail.mjs";
import { loginUser } from "../controllers/session/loginUsers.mjs";
import { logoutUser } from "../controllers/session/logoutUsers.mjs";
import { getActiveSessions } from "../controllers/session/getActiveSessions.mjs"; 
import { deleteAllSessions } from "../controllers/session/deleteallsession.mjs";
import { forgotPassword } from "../controllers/password/forgotpassword.mjs";
import { verifyResetOtp } from "../controllers/password/verifyResetOtp.mjs";
import { resetPassword } from "../controllers/password/resetPassword.mjs";

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