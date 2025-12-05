import auth from "../schemas/authschemas.mjs";
import bcrypt from "bcrypt";
import { redisClient } from "../configs/redis.mjs";

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required",
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

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: "New password cannot be the same as old password",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();
  await redisClient.del(verifiedKey);

  return res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
  });
};
