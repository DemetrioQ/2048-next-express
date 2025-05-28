import nodemailer from "nodemailer";


export default async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
 service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN
  },
  });

  await transporter.sendMail({
    from: `"2048 App by Demetrio Quinones" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
