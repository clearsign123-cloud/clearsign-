export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { code } = await req.json();
    const submitted = String(code || '').trim();
    if (!submitted) {
      return Response.json({ valid: false, error: 'Enter your ClearSign agent access code.' }, { status: 400 });
    }

    // Prefer the configured list so an older single-code variable cannot
    // shadow the current access-code list in Vercel.
    const configured = (process.env.CS_AGENT_ACCESS_CODES || process.env.AGENT_ACCESS_CODE || '')
      .split(',').map((value) => value.trim()).filter(Boolean);

    if (!configured.length) {
      return Response.json({ valid: false, error: 'Agent access is not configured. Set CS_AGENT_ACCESS_CODES in Vercel environment variables.' }, { status: 503 });
    }

    const normalized = submitted.toUpperCase();
    const valid = configured.some((value) => value.toUpperCase() === normalized);
    return Response.json(
      { valid, error: valid ? undefined : 'That access code is not recognised.' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return Response.json({ valid: false, error: 'We could not check that code. Please try again.' }, { status: 400 });
  }
}