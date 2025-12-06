import auth from "../schemas/authschemas.mjs";
import bcrypt from "bcrypt";
import { redisClient } from "../configs/redis.mjs";

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await auth.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const verifiedKey = `reset:verified:${user._id}`;
  const isAllowed = await redisClient.get(verifiedKey);

  if (!isAllowed) {
    return res.status(403).json({
      success: false,
      message: "Reset OTP not verified or has expired",
    });
  }

  const isSame = await bcrypt.compare(password, user.password);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: "New password cannot be the same as old password",
    });
  }

  user.password = password;

  await user.save();
  console.log("✓ Password reset successfully for:", email);
  await redisClient.del(verifiedKey);

  return res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
  });
};
