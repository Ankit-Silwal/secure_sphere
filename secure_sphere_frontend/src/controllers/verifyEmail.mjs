import auth from "../schemas/authschemas.mjs";
import { verifyandconsumeOtp } from "../utils/otpgenerator.mjs";

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Both the email and otp are required"
    });
  }

  const user = await auth.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "That user doesn't exist"
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User is already verified"
    });
  }

  const result = await verifyandconsumeOtp(user._id.toString(), otp);

  if (!result.ok) {
    return res.status(400).json({
      success: false,
      message:
        result.reason === "expired_or_missing"
          ? "OTP has expired or doesn't exist"
          : "Invalid OTP"
    });
  }

  user.isVerified = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully"
  });
};
