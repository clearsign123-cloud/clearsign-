import { NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export const runtime = 'nodejs';

function makeFindings(text) {
  const source = text.toLowerCase();
  const findings = [];
  const checks = [];
  const add = (condition, finding, pass) => condition ? findings.push(finding) : checks.push(pass);

  add(!/deposit.{0,120}(scheme|protected|protection)|(?:dps|mydeposits|t d s|tenancy deposit scheme)/i.test(text), {
    severity: 'high', title: 'Deposit protection information may be missing',
    detail: 'The agreement text did not clearly identify a deposit protection scheme or protection wording.',
    action: 'Check the deposit protection record and prescribed information separately.'
  }, 'Deposit protection wording detected');

  add(/fee|charge|cost/i.test(text) && /(tenant|tenancy)/i.test(text) && /(administration|admin fee|check[- ]?out fee|renewal fee|inventory fee)/i.test(text), {
    severity: 'medium', title: 'Potential tenant charge clause',
    detail: 'The agreement contains wording that may create an administration, renewal, inventory or check-out charge for a tenant.',
    action: 'Review the exact charge against the permitted payments rules and the tenancy type.'
  }, 'No obvious administration/renewal/inventory/check-out charge wording detected');

  add(!/landlord.{0,80}(address|service)|address.{0,80}(landlord|notice)/i.test(text), {
    severity: 'medium', title: 'Landlord contact/address information may need review',
    detail: 'A clear landlord address/contact provision was not detected in the extracted agreement text.',
    action: 'Confirm the tenancy paperwork contains the required landlord/service information.'
  }, 'Landlord contact/address wording detected');

  add(!/notice.{0,100}(tenant|landlord)|section 21|section 8/i.test(text), {
    severity: 'low', title: 'Notice provisions need review',
    detail: 'The agreement did not contain obvious notice terminology in the extracted text.',
    action: 'Review the tenancy type, notice clauses and current legal requirements before relying on them.'
  }, 'Notice terminology detected');

  if (!findings.length) findings.push({ severity: 'low', title: 'No obvious issues found in the first-pass screen', detail: 'The initial rules did not flag the extracted agreement text.', action: 'Review the full document and supporting compliance records before closing the case.' });
  return { findings, checks };
}

async function extractPdf(buffer) {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  let text = '';
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str || '').join(' ') + '\n';
  }
  return { text, pages: pdf.numPages };
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const property = String(form.get('property') || '').trim();
    const reference = String(form.get('reference') || '').trim();
    if (!file || typeof file.arrayBuffer !== 'function') return NextResponse.json({ error: 'No agreement uploaded.' }, { status: 400 });
    if (!property) return NextResponse.json({ error: 'Property/address is required.' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';
    let pages = null;
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) ({ text, pages } = await extractPdf(buffer));
    else text = buffer.toString('utf8');
    if (!text.trim()) return NextResponse.json({ error: 'No readable text was found. Please use a text-based PDF or TXT agreement.' }, { status: 400 });
    const { findings, checks } = makeFindings(text);
    return NextResponse.json({ id: `audit_${Date.now()}`, property, reference, filename: file.name, createdAt: new Date().toISOString(), summary: { issues: findings.filter(f => f.severity !== 'low' || findings.length > 1).length, passed: checks.length, pages }, findings, extractedCharacters: text.length });
  } catch (error) {
    console.error('agent-audit error', error);
    return NextResponse.json({ error: 'The agreement could not be analysed.' }, { status: 500 });
  }
}
