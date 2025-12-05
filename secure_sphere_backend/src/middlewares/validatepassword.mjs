import { validatePassword } from "../utils/validators/validatePassword.mjs";

export function passwordValidatorMiddleware(req, res, next) {
  const { password, email, username } = req.body;

  const result = validatePassword(password, email, username);

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      errors: result.errors,
    });
  }

  next();
}
