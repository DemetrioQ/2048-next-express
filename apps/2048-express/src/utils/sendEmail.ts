import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await resend.emails.send({
    from: '2048 App <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
