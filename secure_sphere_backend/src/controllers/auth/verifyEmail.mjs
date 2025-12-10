import auth from "../../schemas/authschemas.mjs";
import { verifyandconsumeOtp } from "../../utils/otp/otpgenerator.mjs";
import { logActivity } from "../../logs/logActivity.mjs";

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

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  user.isVerified = true;
  await user.save();
  await logActivity(user._id, "EMAIL_VERIFIED", req);

  return res.status(200).json({
    success: true,
    message: "Email verified successfully"
  });
};
