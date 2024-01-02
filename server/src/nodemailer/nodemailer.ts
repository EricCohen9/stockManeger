import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
dotenv.config();
export function generateUniqueCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export async function sendemail(user: string, code: string) {
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: user,
    subject: "Confirmation email",
    text: "code to reset your password",
    html: code,
  });

  console.log("Message sent: %s", info.messageId);
}
