export const runtime = 'nodejs';
async function sendResendEmail({ apiKey, from, to, subject, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  });
  return res.ok;
}
export async function POST(req) {
  let payload;
  try { payload = await req.json(); } catch (e) { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { agencyName, contactName, email, message } = payload || {};
  if (!email) return Response.json({ error: 'Email is required.' }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'ClearSign <reports@clearsign.app>';
  const notifyTo = process.env.AGENT_LEAD_NOTIFY_EMAIL || 'clear_sign@outlook.com';
  if (!apiKey) return Response.json({ error: 'Email sending is not configured yet.' }, { status: 503 });
  const summaryText = `New letting agent trial request\n\nAgency: ${agencyName || 'Not provided'}\nContact: ${contactName || 'Not provided'}\nEmail: ${email}\nMessage: ${message || 'None'}`;
  let notified = false; let confirmed = false;
  try { notified = await sendResendEmail({ apiKey, from, to: notifyTo, subject: `New agency trial request: ${agencyName || email}`, text: summaryText }); } catch (e) {}
  try { confirmed = await sendResendEmail({ apiKey, from, to: email, subject: 'Your ClearSign for Agents trial request', text: `Thanks for your interest in ClearSign for letting agents.\n\nWe've received your request${agencyName ? ` for ${agencyName}` : ''} and will be in touch shortly to set up your free 30-day trial.\n\nIn the meantime, feel free to reply to this email with any questions.\n\nHenry\nFounder, ClearSign` }); } catch (e) {}
  return Response.json({ notified, confirmed });
}
