import { transporter } from "./nodemailertransport.mjs";

export async function sendResetEmail({ to, resetLink }) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Password Reset - Secure Sphere",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p><p>This link expires in 15 minutes.</p>`,
    });
    console.log("✓ Reset email sent successfully to:", to);
    return result;
  } catch (error) {
    console.error("✗ Failed to send reset email:", error.message);
    throw error;
  }
}
