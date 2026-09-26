// app/for-agents/audit/page.tsx

'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Finding {
  ruleId: string;
  title: string;
  status: 'compliant' | 'non_compliant' | 'unclear' | 'not_applicable';
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  quotedText: string | null;
  legalBasis: string;
  recommendation: string;
}

interface AuditReport {
  generatedAt: string;
  jurisdiction: string;
  overallRiskLevel: 'low' | 'medium' | 'high';
  summary: string;
  findings: Finding[];
  disclaimer: string;
}

const STATUS_STYLES: Record<Finding['status'], string> = {
  compliant: 'bg-green-50 border-green-200 text-green-800',
  non_compliant: 'bg-red-50 border-red-200 text-red-800',
  unclear: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  not_applicable: 'bg-gray-50 border-gray-200 text-gray-500',
};

const STATUS_LABELS: Record<Finding['status'], string> = {
  compliant: 'Compliant',
  non_compliant: 'Non-compliant',
  unclear: 'Needs review',
  not_applicable: 'Not applicable',
};

const RISK_STYLES: Record<AuditReport['overallRiskLevel'], string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function ComplianceAuditPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId') ?? '';

  const [file, setFile] = useState<File | null>(null);
  const [jurisdiction, setJurisdiction] = useState<'england' | 'wales'>('england');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setReport(null);

    if (!file) {
      setError('Please choose a tenancy agreement file (PDF or .txt).');
      return;
    }
    if (!paymentId) {
      setError(
        'No purchase reference found. Please use the link from your purchase confirmation email.'
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('paymentId', paymentId);
      formData.append('jurisdiction', jurisdiction);

      const res = await fetch('/api/compliance-audit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Audit failed.');
      }
      setReport(data as AuditReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Compliance Audit</h1>
      <p className="text-gray-600 mb-8">
        Upload the tenancy agreement to run your paid compliance audit.
      </p>

      {!report && (
        <form onSubmit={handleSubmit} className="space-y-6 border rounded-lg p-6 bg-white">
          <div>
            <label className="block text-sm font-medium mb-1">Tenancy agreement (PDF or .txt)</label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jurisdiction</label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as 'england' | 'wales')}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="england">England</option>
              <option value="wales">Wales</option>
            </select>
          </div>

          {!paymentId && (
            <p className="text-sm text-red-600">
              No purchase reference detected in the URL. Open this page from the link in your
              purchase confirmation email rather than navigating here directly.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#e63946] text-white px-5 py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Running audit…' : 'Run compliance audit'}
          </button>
        </form>
      )}

      {report && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${RISK_STYLES[report.overallRiskLevel]}`}>
              {report.overallRiskLevel.toUpperCase()} RISK
            </span>
            <span className="text-sm text-gray-500">
              Generated {new Date(report.generatedAt).toLocaleString('en-GB')}
            </span>
          </div>

          <p className="text-gray-800">{report.summary}</p>

          <div className="space-y-3">
            {report.findings.map((f) => (
              <div key={f.ruleId} className={`border rounded-lg p-4 ${STATUS_STYLES[f.status]}`}>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold">{f.title}</h3>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {STATUS_LABELS[f.status]}
                  </span>
                </div>
                <p className="text-sm mt-1">{f.explanation}</p>
                {f.quotedText && (
                  <blockquote className="text-xs italic border-l-2 pl-2 mt-2 opacity-80">
                    "{f.quotedText}"
                  </blockquote>
                )}
                {f.recommendation && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Recommendation: </span>
                    {f.recommendation}
                  </p>
                )}
                <p className="text-xs mt-2 opacity-70">{f.legalBasis}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 border-t pt-4">{report.disclaimer}</p>

          <button
            onClick={() => window.print()}
            className="text-sm underline text-gray-600"
          >
            Print / save as PDF
          </button>
        </div>
      )}
    </main>
  );
}
