'use client';

import { useState } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

const tools = [
  { title: 'Compliance audit', description: 'Upload a tenancy agreement and get a structured compliance review.', action: 'Start audit', primary: true },
  { title: 'Deposit dispute pack', description: 'Organise tenancy evidence into a dispute-ready case pack.', action: 'Create pack' },
  { title: 'Tenancy checklist', description: 'Keep the key documents and checks for a tenancy in one place.', action: 'Open checklist' },
  { title: 'Repair request', description: 'Capture a repair issue and keep a clear record of what happened.', action: 'Log repair' },
  { title: 'Landlord email', description: 'Draft a clear message from the facts of your case.', action: 'Draft email' },
  { title: 'Move-in checklist', description: 'Work through the practical checks for a new tenancy.', action: 'Open checklist' },
];

const quickStats = [
  ['Open cases', '0'],
  ['Audits this month', '0'],
  ['Issues found', '0'],
  ['Time saved', '—'],
];

export default function AgentsDashboard() {
  const [showAudit, setShowAudit] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  async function runAudit(e) {
    e.preventDefault();
    if (!file) return;
    setStatus('ready');
    // The existing analyser can be connected here without changing the tenant product.
    // Keep the upload UI usable while the Agent entitlement/backend is wired up.
  }

  return (
    <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-brass">ClearSign for Agents</p>
            <h1 className="text-4xl md:text-5xl mt-2">Your compliance workspace.</h1>
            <p className="text-muted text-lg mt-4 max-w-2xl">Run the checks that take time, keep your cases organised, and get back to managing properties.</p>
          </div>
          <button onClick={() => setShowAudit(true)} className="px-5 py-3 rounded-lg bg-redline text-white font-medium">+ New audit</button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {quickStats.map(([label, value]) => (
            <div key={label} className="bg-panel border border-line rounded-xl p-5">
              <p className="text-sm text-muted">{label}</p>
              <p className="text-2xl mt-2">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between mb-5"><div><p className="text-xs uppercase tracking-widest text-brass">Tools</p><h2 className="text-2xl mt-1">Built to save agent time</h2></div></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map(tool => (
              <div key={tool.title} className="bg-panel border border-line rounded-xl p-6 flex flex-col min-h-48">
                <h3 className="text-xl">{tool.title}</h3>
                <p className="text-sm text-muted mt-2 flex-1">{tool.description}</p>
                <button onClick={() => tool.title === 'Compliance audit' && setShowAudit(true)} className={`mt-5 text-sm rounded-lg px-4 py-2 border ${tool.primary ? 'bg-redline border-redline text-white' : 'border-line text-paper'}`}>{tool.action}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-panel border border-line rounded-xl p-6 md:p-8">
          <p className="text-xs uppercase tracking-widest text-brass">Recent cases</p>
          <h2 className="text-2xl mt-1">Your work</h2>
          <div className="mt-6 border border-line rounded-lg p-8 text-center">
            <p className="text-paper">No cases yet.</p>
            <p className="text-sm text-muted mt-2">Start your first compliance audit to create a case.</p>
            <button onClick={() => setShowAudit(true)} className="mt-5 px-5 py-2 rounded-lg border border-line">Start an audit</button>
          </div>
        </section>
      </main>
      <Footer />

      {showAudit && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl bg-panel border border-line rounded-xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-brass">New audit</p><h2 className="text-2xl mt-1">Upload tenancy agreement</h2></div><button onClick={() => setShowAudit(false)} className="text-muted" aria-label="Close">×</button></div>
            <p className="text-sm text-muted mt-4">Upload the agreement you want ClearSign to review. PDF and common document formats can be supported by the backend.</p>
            <form onSubmit={runAudit} className="mt-6">
              <label className="block border border-dashed border-line rounded-xl p-8 text-center cursor-pointer hover:border-brass">
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={e => setFile(e.target.files?.[0] || null)} />
                <span className="text-paper">{file ? file.name : 'Choose a tenancy agreement'}</span>
                <span className="block text-xs text-muted mt-2">PDF, DOC, DOCX or TXT</span>
              </label>
              <button disabled={!file || status === 'ready'} className="w-full mt-5 px-5 py-3 rounded-lg bg-redline text-white font-medium disabled:opacity-40">{status === 'ready' ? 'Audit queued' : 'Run compliance audit'}</button>
            </form>
            {status === 'ready' && <div className="mt-5 border border-line rounded-lg p-4"><p className="text-paper">Upload captured successfully.</p><p className="text-sm text-muted mt-1">The next step is connecting this Agent workspace to the existing ClearSign analysis API.</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
