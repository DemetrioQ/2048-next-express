export default async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: '2048 App', email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to send email');
  }
}
