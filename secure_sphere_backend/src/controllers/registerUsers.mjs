import auth from "../schemas/authschemas.mjs";
import { createandstoreOtp } from "../utils/otpgenerator.mjs";
import { sendOtp } from "../utils/sendotpemail.mjs";

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
    const newUser = await auth.create({
      username,
      email,
      password,
    });
    const otp = await createandstoreOtp(newUser._id.toString());
    await sendOtp({ to: newUser.email, otp });
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