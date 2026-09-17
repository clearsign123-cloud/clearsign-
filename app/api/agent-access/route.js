export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { code } = await req.json();
    const membershipId = String(code || '').trim();
    if (!membershipId) {
      return Response.json({ valid: false, error: 'Enter your subscription code.' }, { status: 400 });
    }

    const apiKey = process.env.WHOP_API_KEY;
    if (!apiKey) {
      return Response.json({ valid: false, error: 'Subscription verification is not configured yet.' }, { status: 503 });
    }

    const res = await fetch(`https://api.whop.com/v5/app/memberships/${encodeURIComponent(membershipId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return Response.json({ valid: false, error: 'That code could not be verified.' }, { status: 200 });
    }

    const data = await res.json();
    const valid = data?.valid === true;
    const status = data?.status || null;

    return Response.json({ valid, status });
  } catch {
    return Response.json({ valid: false, error: 'We could not verify that code. Please try again.' }, { status: 200 });
  }
}
