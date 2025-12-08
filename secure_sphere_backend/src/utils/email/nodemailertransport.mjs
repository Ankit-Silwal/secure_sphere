import nodemailer from "nodemailer"
import { configDotenv } from "dotenv"

configDotenv()

export const transporter=nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("⚠️  Warning: SMTP_USER or SMTP_PASS not set in .env file");
}
