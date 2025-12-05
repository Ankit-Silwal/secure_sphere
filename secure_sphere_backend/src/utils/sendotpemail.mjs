import { transporter } from "./nodemailertransport.mjs";
export async function sendOtp({ to, otp }) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "OTP conformation for secure sphere",
      text: `Your required otp is ${otp} \n It expires in 5 minutes`,
      html: `<p>Your OTP is <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
    });
    console.log("✓ Email sent successfully to:", to);
    return result;
  } catch (error) {
    console.error("✗ Failed to send email:", error.message);
    throw error;
  }
}
