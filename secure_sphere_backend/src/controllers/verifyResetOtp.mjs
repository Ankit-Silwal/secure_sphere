import auth from "../schemas/authschemas.mjs";
import { redisClient } from "../configs/redis.mjs";
import { verifyAndConsumeResetOtp } from "../utils/otp/resetotpservice.mjs";

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide the email and the otp",
    });
  }

  const user = await auth.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "The user wasnt found",
    });
  }

  const result = await verifyAndConsumeResetOtp(user._id.toString(), otp);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  const verifiedKey = `reset:verified:${user._id}`;
  await redisClient.set(verifiedKey, "true", { EX: 300 });

  return res.status(200).json({
    success: true,
    message: "OTP verified. You may now reset your password.",
  });
};

