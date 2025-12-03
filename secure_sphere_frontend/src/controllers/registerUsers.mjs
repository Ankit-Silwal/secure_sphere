import auth from "../schemas/authschemas.mjs";
import { createAndStoreOtp } from "../utils/otpService.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

export const registerUsers = async (req, res) => {
  const { username, email, password } = req.body;
  const duplicateUser = await auth.findOne({ email });
  if (duplicateUser) {
    return res.status(400).json({
      success: false,
      message: "An existing user exists with this email",
    });
  }
  if (!(username && email && password)) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the required fields",
    });
  }
  try {
    await auth.create({
      username,
      email,
      password,
    });
    const otp = await createAndStoreOtp(newUser._id.toString());
    await sendOtpEmail({ to: newUser.email, otp });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "failed to register",
      error: err.message,
    });
  }
};