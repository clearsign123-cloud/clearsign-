export const runtime = 'nodejs';

const launchCodes = [
  'CSAG-7KPX-9WMR-4DQT',
  'CSAG-3VNF-8JRH-6YTZ',
  'CSAG-5QDW-2LKC-9XPM',
  'CSAG-8TRJ-4ZHN-7WFK',
  'CSAG-2MYP-6VQS-3KRD',
  'CSAG-9HXL-5PWT-2NJV',
  'CSAG-4DKR-7QMF-8ZYC',
  'CSAG-6WTP-3XJN-5RKH',
  'CSAG-2ZQV-9MFD-4YKS',
  'CSAG-8NRC-5THW-7PXL',
];

export async function POST(req) {
  try {
    const { code } = await req.json();
    const submitted = String(code || '').trim().toUpperCase();
    if (!submitted) {
      return Response.json({ valid: false, error: 'Enter your ClearSign agent access code.' }, { status: 400 });
    }

    // Vercel configuration can add/revoke customer codes without a code change.
    // The launch codes below keep the preview usable before that configuration is added.
    const configured = (process.env.CS_AGENT_ACCESS_CODES || process.env.AGENT_ACCESS_CODE || '')
      .split(',').map((value) => value.trim().toUpperCase()).filter(Boolean);
    const acceptedCodes = new Set([...launchCodes, ...configured]);
    const valid = acceptedCodes.has(submitted);

    return Response.json(
      { valid, error: valid ? undefined : 'That access code is not recognised.' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return Response.json({ valid: false, error: 'We could not check that code. Please try again.' }, { status: 400 });
  }
}
