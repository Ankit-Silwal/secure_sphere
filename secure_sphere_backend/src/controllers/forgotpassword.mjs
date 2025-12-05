export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  const user = await auth.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Email must be verified before resetting password"
    });
  }

  const rateKey = `rate:forgot:${user._id}`;
  const attempts = await redisClient.incr(rateKey);

  if (attempts === 1) {
    await redisClient.expire(rateKey, 60);
  }

  if (attempts > 1) {
    return res.status(429).json({
      success: false,
      message: "Please wait before requesting another reset OTP"
    });
  }

  const otp = await createAndStoreResetOtp(user._id.toString());
  await sendResetOtpEmail({ to: user.email, otp });

  return res.status(200).json({
    success: true,
    message: "Password reset OTP sent to your email"
  });
};