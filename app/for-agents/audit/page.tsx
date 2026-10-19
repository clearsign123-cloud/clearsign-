'use client';

import { useState } from 'react';

interface Finding {
  ruleId: string; title: string;
  status: 'compliant' | 'non_compliant' | 'unclear' | 'not_applicable';
  severity: 'high' | 'medium' | 'low'; explanation: string;
  quotedText: string | null; legalBasis: string; recommendation: string;
}
interface AuditReport {
  generatedAt: string; jurisdiction: string; overallRiskLevel: 'low' | 'medium' | 'high';
  summary: string; findings: Finding[]; disclaimer: string;
}
const STATUS_STYLES: Record<Finding['status'], string> = {
  compliant: 'bg-green-50 border-green-200 text-green-800',
  non_compliant: 'bg-red-50 border-red-200 text-red-800',
  unclear: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  not_applicable: 'bg-gray-50 border-gray-200 text-gray-500',
};
const STATUS_LABELS: Record<Finding['status'], string> = {
  compliant: 'Compliant', non_compliant: 'Non-compliant', unclear: 'Needs review', not_applicable: 'Not applicable',
};
const RISK_STYLES: Record<AuditReport['overallRiskLevel'], string> = {
  low: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-red-100 text-red-800',
};

export default function ComplianceAuditPage() {
  const [accessCode, setAccessCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [jurisdiction, setJurisdiction] = useState<'england' | 'wales'>('england');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setReport(null);
    if (!accessCode.trim()) return setError('Enter your ClearSign agent access code.');
    if (!file) return setError('Please choose a tenancy agreement file (PDF or .txt).');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('accessCode', accessCode.trim());
      formData.append('jurisdiction', jurisdiction);
      const res = await fetch('/api/compliance-audit', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed.');
      setReport(data as AuditReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally { setLoading(false); }
  }

  return <main className="max-w-3xl mx-auto px-4 py-12">
    <a href="/for-agents" className="text-sm text-gray-500 hover:underline">← For Agents</a>
    <h1 className="text-3xl font-bold mt-4 mb-2">Tenancy compliance audit</h1>
    <p className="text-gray-600 mb-8">Upload a tenancy agreement for a first-pass review against the England and Wales checklist. The document is analysed on the server and is not saved by this page.</p>
    {!report && <form onSubmit={handleSubmit} className="space-y-6 border rounded-xl p-6 bg-white">
      <div><label className="block text-sm font-medium mb-1" htmlFor="accessCode">ClearSign agent access code</label><input id="accessCode" type="password" autoComplete="current-password" required value={accessCode} onChange={e => setAccessCode(e.target.value)} className="border rounded px-3 py-2 w-full" placeholder="Enter access code" /></div>
      <div><label className="block text-sm font-medium mb-1" htmlFor="agreement">Tenancy agreement (PDF or .txt)</label><input id="agreement" type="file" accept=".pdf,.txt,application/pdf,text/plain" required onChange={e => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" /></div>
      <div><label className="block text-sm font-medium mb-1" htmlFor="jurisdiction">Jurisdiction</label><select id="jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value as 'england' | 'wales')} className="border rounded px-3 py-2 text-sm"><option value="england">England</option><option value="wales">Wales</option></select></div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="bg-[#e63946] text-white px-5 py-3 rounded font-medium disabled:opacity-50">{loading ? 'Analysing agreement…' : 'Run compliance audit'}</button>
    </form>}
    {report && <div className="space-y-6 mt-6">
      <div className="flex flex-wrap items-center gap-3"><span className={`px-3 py-1 rounded-full text-sm font-medium ${RISK_STYLES[report.overallRiskLevel]}`}>{report.overallRiskLevel.toUpperCase()} RISK</span><span className="text-sm text-gray-500">Generated {new Date(report.generatedAt).toLocaleString('en-GB')}</span></div>
      <p className="text-gray-800">{report.summary}</p>
      <div className="space-y-3">{report.findings.map(f => <article key={f.ruleId} className={`border rounded-lg p-4 ${STATUS_STYLES[f.status]}`}><div className="flex justify-between items-start gap-2"><h2 className="font-semibold">{f.title}</h2><span className="text-xs font-medium whitespace-nowrap">{STATUS_LABELS[f.status]}</span></div><p className="text-xs mt-1 uppercase tracking-wide">Severity: {f.severity}</p><p className="text-sm mt-2">{f.explanation}</p>{f.quotedText && <blockquote className="text-xs italic border-l-2 pl-2 mt-2 opacity-80">“{f.quotedText}”</blockquote>}{f.recommendation && <p className="text-sm mt-2"><strong>Recommended next step: </strong>{f.recommendation}</p>}<p className="text-xs mt-2 opacity-70">{f.legalBasis}</p></article>)}</div>
      <p className="text-xs text-gray-500 border-t pt-4">{report.disclaimer}</p>
      <div className="flex gap-4"><button onClick={() => window.print()} className="text-sm underline text-gray-600">Print / save as PDF</button><button onClick={() => { setReport(null); setFile(null); setError(null); }} className="text-sm underline text-gray-600">Run another audit</button></div>
    </div>}
  </main>;
}
