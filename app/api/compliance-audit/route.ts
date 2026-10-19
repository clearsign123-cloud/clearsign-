import { NextRequest, NextResponse } from 'next/server';
import { runComplianceAudit } from '@/lib/compliance/audit';

export const runtime = 'nodejs';
export const maxDuration = 60;

function validAgentCode(input: string) {
  const configured = (process.env.AGENT_ACCESS_CODE || process.env.CS_AGENT_ACCESS_CODES || '')
    .split(',').map((v) => v.trim()).filter(Boolean);
  return configured.length > 0 && configured.some((code) => code === input.trim());
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse')).default;
    return (await pdfParse(buffer)).text;
  }
  return buffer.toString('utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const code = String(formData.get('accessCode') || '');
    const jurisdiction = formData.get('jurisdiction') === 'wales' ? 'wales' : 'england';

    if (!validAgentCode(code)) {
      return NextResponse.json({ error: 'Invalid access code. Check the code and try again.' }, { status: 401 });
    }
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Please upload a tenancy agreement.' }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'The file must be 15 MB or smaller.' }, { status: 413 });
    }
    const text = await extractTextFromFile(file);
    if (text.trim().length < 200) {
      return NextResponse.json({ error: 'Not enough readable text was extracted. Please use a text-based PDF or TXT file.' }, { status: 400 });
    }
    const report = await runComplianceAudit(text, jurisdiction);
    return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[compliance-audit] failed:', message);
    return NextResponse.json({ error: message || 'Audit failed. Please try again.' }, { status: 500 });
  }
}
