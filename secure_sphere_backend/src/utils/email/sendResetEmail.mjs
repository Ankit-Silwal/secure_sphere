import { transporter } from "./nodemailertransport.mjs";

export async function sendResetEmail({ to, otp }) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Password Reset OTP - Secure Sphere",
      text: `Your password reset OTP is ${otp} \n It expires in 5 minutes`,
      html: `<p>Your password reset OTP is <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
    });
    console.log("✓ Reset OTP email sent successfully to:", to);
    return result;
  } catch (error) {
    console.error("✗ Failed to send reset OTP email:", error.message);
    throw error;
  }
}
