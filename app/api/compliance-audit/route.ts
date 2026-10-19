import { NextRequest, NextResponse } from 'next/server';


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
    const findings = [];
    const checks = [];
    const flag = (condition: boolean, title: string, detail: string, action: string, severity: string, pass: string) => {
      if (condition) findings.push({ severity, title, detail, action });
      else checks.push(pass);
    };
    flag(!/deposit.{0,120}(scheme|protected|protection)|(?:dps|mydeposits|t d s|tenancy deposit scheme)/i.test(text), 'Deposit protection information may be missing', 'The agreement text did not clearly identify deposit protection wording.', 'Check the deposit protection record and prescribed information separately.', 'high', 'Deposit protection wording detected');
    flag(/fee|charge|cost/i.test(text) && /(tenant|tenancy)/i.test(text) && /(administration|admin fee|check[- ]?out fee|renewal fee|inventory fee)/i.test(text), 'Potential tenant charge clause', 'The agreement may mention an administration, renewal, inventory or check-out charge.', 'Review the exact charge against current permitted payment rules.', 'medium', 'No obvious additional tenant charge wording detected');
    flag(!/landlord.{0,80}(address|service)|address.{0,80}(landlord|notice)/i.test(text), 'Landlord contact/address information may need review', 'A clear landlord service address was not detected in the extracted text.', 'Confirm the paperwork contains the required landlord/service information.', 'medium', 'Landlord contact/address wording detected');
    flag(!/notice.{0,100}(tenant|landlord)|section 21|section 8/i.test(text), 'Notice provisions need review', 'Obvious notice terminology was not detected.', 'Review notice clauses against the tenancy type and current rules.', 'low', 'Notice terminology detected');
    if (!findings.length) findings.push({ severity: 'low', title: 'No obvious issues found in the first-pass screen', detail: 'The initial rules did not flag the extracted agreement text.', action: 'Review the full document and supporting compliance records before closing the case.' });
    return NextResponse.json({ jurisdiction, findings, checks, summary: { issues: findings.length, passed: checks.length, characters: text.length } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[compliance-audit] failed:', message);
    return NextResponse.json({ error: message || 'Audit failed. Please try again.' }, { status: 500 });
  }
}
