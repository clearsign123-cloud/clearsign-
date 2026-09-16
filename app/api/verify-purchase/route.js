export const runtime = 'nodejs';
export async function GET(req) {
  const { searchParams } = new URL(req.url); const membershipId = searchParams.get('membership_id');
  if (!membershipId) return Response.json({ valid: false, error: 'No membership ID provided.' }, { status: 400 });
  const apiKey = process.env.WHOP_API_KEY); if (!apiKey) return Response.json({ valid: false, error: 'Verification not configured yet.' }, { status: 503 });
  try {
    const res = await fetch(`https://api.whop.com/v5/app/memberships/${encodeURIComponent(membershipId)}`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return Response.json({ valid: false, error: 'Could not verify this membership.' }, { status: 200 });
    const data = await res.json(); const isValid = data && data.valid === true;
    return Response.json({ valid: isValid, status: data?.status || null });
  } catch (e) { return Response.json({ valid: false, error: 'Verification request failed.' }, { status: 200 }); }
}
