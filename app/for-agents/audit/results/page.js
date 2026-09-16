'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export default function AgentAuditResults() {
  const [audit, setAudit] = useState(null);
  useEffect(() => { try { setAudit(JSON.parse(sessionStorage.getItem('clearsign_agent_audit') || 'null')); } catch {} }, []);

  if (!audit) return <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}><Nav/><main className="max-w-4xl mx-auto px-6 py-20"><h1 className="text-3xl">No audit found</h1><p className="text-muted mt-3">Start a new audit first.</p><Link href="/for-agents/audit" className="inline-block mt-6 px-5 py-3 rounded-lg bg-brass text-ink">New audit</Link></main><Footer/></div>;

  return <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}><Nav/><main className="max-w-5xl mx-auto px-6 py-16">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-brass">Audit result</p><h1 className="text-4xl mt-2">{audit.property}</h1><p className="text-muted mt-2">{audit.reference || 'No tenancy reference'} · {audit.filename}</p></div><Link href="/for-agents/audit" className="px-5 py-3 rounded-lg border border-line">New audit</Link></div>
    <div className="grid md:grid-cols-3 gap-4 mt-10"><div className="bg-panel border border-line rounded-xl p-6"><p className="text-sm text-muted">Potential issues</p><p className="text-4xl mt-2">{audit.summary.issues}</p></div><div className="bg-panel border border-line rounded-xl p-6"><p className="text-sm text-muted">Checks passed</p><p className="text-4xl mt-2">{audit.summary.passed}</p></div><div className="bg-panel border border-line rounded-xl p-6"><p className="text-sm text-muted">Document</p><p className="text-lg mt-2">{audit.summary.pages ? `${audit.summary.pages} page${audit.summary.pages === 1 ? '' : 's'}` : 'Text extracted'}</p></div></div>
    <section className="mt-10"><h2 className="text-2xl">Findings</h2><div className="mt-4 space-y-4">{audit.findings.map((finding, i) => <div key={i} className="bg-panel border border-line rounded-xl p-6"><div className="flex gap-3 items-start"><span className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${finding.severity === 'high' ? 'bg-red-500/15 text-red-300' : finding.severity === 'medium' ? 'bg-yellow-500/15 text-yellow-200' : 'bg-white/10 text-muted'}`}>{finding.severity}</span><div><h3 className="font-medium">{finding.title}</h3><p className="text-muted mt-2">{finding.detail}</p><p className="text-sm mt-3"><span className="text-brass">Recommended action:</span> {finding.action}</p></div></div></div>)}</div></section>
    <section className="mt-10 bg-panel border border-line rounded-xl p-6"><h2 className="text-xl">Audit note</h2><p className="text-muted mt-2">This is a first-pass document screening. Findings are potential compliance issues for an agent to review, not legal advice or a final determination.</p></section>
  </main><Footer/></div>;
}
