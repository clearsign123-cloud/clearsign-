// app/api/compliance-audit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runComplianceAudit } from '@/lib/compliance/audit';
import { verifyComplianceAuditPayment } from '@/lib/whop/verifyPayment';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer);
    return result.text;
  }

  return buffer.toString('utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const paymentId = formData.get('paymentId') as string | null;
    const jurisdiction =
      (formData.get('jurisdiction') as 'england' | 'wales' | null) ?? 'england';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing paymentId. This audit can only be run against a verified purchase.' },
        { status: 400 }
      );
    }

    await verifyComplianceAuditPayment(paymentId);

    const text = await extractTextFromFile(file);
    const report = await runComplianceAudit(text, jurisdiction);

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[compliance-audit] failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
