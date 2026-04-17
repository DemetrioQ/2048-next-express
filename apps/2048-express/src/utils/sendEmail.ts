export default async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[sendEmail] Sending to=${to} subject="${subject}" from=${process.env.EMAIL_FROM} hasKey=${!!process.env.RESEND_API_KEY}`);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `2048 App <${process.env.EMAIL_FROM}>`,
      to: [to],
      subject,
      html,
    }),
  });

  const body = await res.json().catch(() => ({}));
  console.log(`[sendEmail] Resend status=${res.status}`, JSON.stringify(body));

  if (!res.ok) {
    throw new Error((body as { message?: string }).message || 'Failed to send email');
  }
}
