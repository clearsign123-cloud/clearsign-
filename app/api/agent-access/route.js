export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { code } = await req.json();
    const submitted = String(code || '').trim();
    if (!submitted) {
      return Response.json({ valid: false, error: 'Enter your ClearSign agent access code.' }, { status: 400 });
    }
    const configured = (process.env.AGENT_ACCESS_CODE || process.env.CS_AGENT_ACCESS_CODES || '')
      .split(',').map((value) => value.trim()).filter(Boolean);
    if (!configured.length) {
      return Response.json({ valid: false, error: 'Agent access is not configured. Set AGENT_ACCESS_CODE in Vercel environment variables.' }, { status: 503 });
    }
    const valid = configured.some((value) => value === submitted);
    return Response.json({ valid, error: valid ? undefined : 'That access code is not recognised.' }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ valid: false, error: 'We could not check that code. Please try again.' }, { status: 400 });
  }
}