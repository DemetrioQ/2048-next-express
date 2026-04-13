import * as Brevo from '@getbrevo/brevo';

const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

export default async function sendEmail(to: string, subject: string, html: string) {
  await client.sendTransacEmail({
    sender: { name: '2048 App', email: process.env.EMAIL_FROM! },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
}
