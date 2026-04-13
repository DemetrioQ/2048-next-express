export default async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[sendEmail] Sending to=${to} subject="${subject}" from=${process.env.EMAIL_FROM} hasKey=${!!process.env.BREVO_API_KEY}`);

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

  const body = await res.json().catch(() => ({}));
  console.log(`[sendEmail] Brevo status=${res.status}`, JSON.stringify(body));

  if (!res.ok) {
    throw new Error((body as { message?: string }).message || 'Failed to send email');
  }
}
