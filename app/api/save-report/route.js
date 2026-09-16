export const runtime = 'nodejs';
function buildSummaryText({ reportType, summary }) { return `ClearSign report backup\n\nType: ${reportType}\n\n${summary || ''}`; }
async function sendResendEmail({ apiKey, from, to, subject, text, scheduledAt }) {
  const body = { from, to, subject, text }; if (scheduledAt) body.scheduled_at = scheduledAt;
  const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return res.ok;
}
export async function POST(req) {
  let payload; try { payload = await req.json(); } catch (e) { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { email, tenancyEndDate, reportType, summary } = payload || {}; if (!email) return Response.json({ skipped: true });
  const apiKey = process.env.RESEND_API_KEY; const from = process.env.RESEND_FROM_EMAIL || 'ClearSign <reports@clearsign.app>';
  if (!apiKey) return Response.json({ error: 'Email sending is not configured yet.' }, { status: 503 });
  const results = { backupSent: false, reminderScheduled: false };
  try { results.backupSent = await sendResendEmail({ apiKey, from, to: email, subject: 'Your ClearSign report backup', text: buildSummaryText({ reportType, summary }) }); } catch (e) { results.backupError = true; }
  if (tenancyEndDate) { const endDate = new Date(tenancyEndDate); if (!isNaN(endDate.getTime())) { const reminderDate = new Date(endDate.getTime() - 60 * 24 * 60 * 60 * 1000); const now = new Date(); if (reminderDate > now) { try { results.reminderScheduled = await sendResendEmail({ apiKey, from, to: email, subject: 'Your tenancy is renewing soon', text: "Your tenancy is renewing soon — want us to re-check your new contract?\n\nHead to https://clearsign-ten.vercel.app to run a fresh check.", scheduledAt: reminderDate.toISOString() }); } catch (e) { results.reminderError = true; } } } }
  return Response.json(results);
}
