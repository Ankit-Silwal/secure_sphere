import { transporter } from "./emailTransporter.mjs";
export async function sendResetOtpEmail({ to, otp }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Password Reset Request",
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password.</p>
      <p>Your OTP is:</p>

      <h2 style="font-size: 24px; margin: 10px 0;">${otp}</h2>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not request this, please ignore this email.</p>

      <p>Thank you,<br>Your App Security Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
