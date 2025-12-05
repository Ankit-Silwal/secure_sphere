import auth from "../../schemas/authschemas.mjs";
import { createandstoreOtp } from "../../utils/otp/otpgenerator.mjs";
import { sendOtp } from "../../utils/email/sendotpemail.mjs";
import { redisClient } from "../../configs/redis.mjs";

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      success: "false",
      message: "Email is required compulsorily",
    });
  }

  const user = await auth.findOne({ email });
  if (!user) {
    res.status(400).json({
      success: false,
      message: "The user wasnt found",
    });
  }

  if (user.isVerified) {
    res.status(400).json({
      success: false,
      message: "User already verified",
    });
  }
  const rateKey = `rate:resend:${user._id}`;
  const attempts = await redisClient.incr(rateKey);

  if (attempts === 1) {
    await redisClient.expire(rateKey, 60);
  }

  if (attempts > 1) {
    return res.status(429).json({
      success: false,
      message: "Please wait before requesting another OTP",
    });
  }
  const otp = await createandstoreOtp(user._id.toString());
  await sendOtp({ to: user.email, otp });

  return res.status(200).json({
    success: true,
    message: "OTP resent sucessfully",
  });
};
