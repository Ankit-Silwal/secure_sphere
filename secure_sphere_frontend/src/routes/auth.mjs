import { Router } from "express";
import { passwordValidatorMiddleware } from "../middlewares/validatepassword.mjs";

import { registerUsers } from "../controllers/registerUsers.mjs";

const router = Router()
router.post('/register', passwordValidatorMiddleware, registerUsers)

export default router