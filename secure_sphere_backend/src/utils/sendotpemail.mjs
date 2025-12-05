import { transporter } from "./nodemailertransport.mjs";
export async function sendOtp({ to, otp }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "OTP conformation for secure sphere",
    text: `Your required otp is ${otp} \n It expires in 5 minutes`,
    html: `<p>Your OTP is <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
  });
}
