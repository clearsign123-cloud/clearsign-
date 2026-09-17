'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

const CHECKOUT_URL = 'https://whop.com/checkout/plan_482Kjc';
const ACCESS_KEY = 'clearsign_agent_access';

const tools = [
  { title: 'Compliance audit', description: 'Upload a tenancy agreement and get a structured compliance review.', action: 'Start audit', primary: true },
  { title: 'Case management', description: 'Keep findings, actions and supporting documents together.', action: 'Open cases' },
  { title: 'Deposit & dispute evidence', description: 'Organise evidence into a clear dispute-ready case record.', action: 'Create pack' },
  { title: 'Document & deadline tracker', description: 'Keep important tenancy paperwork and dates visible.', action: 'Open tracker' },
  { title: 'Reports', description: 'Create a clear record of what was checked and what needs attention.', action: 'Create report' },
  { title: 'Portfolio alerts', description: 'See potential compliance issues that need an agent review.', action: 'View alerts' },
];

const quickStats = [
  ['Open cases', '0'],
  ['Audits this month', '0'],
  ['Issues found', '0'],
  ['Priority alerts', '0'],
];

function hasAccess() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ACCESS_KEY) === 'true';
}

export default function AgentsDashboard() {
  const [access, setAccess] = useState(hasAccess);
  const [code, setCode] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('idle');
  const [verifyError, setVerifyError] = useState('');
  const [showAudit, setShowAudit] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  async function recoverAccess(e) {
    e.preventDefault();
    setVerifyStatus('checking');
    setVerifyError('');
    try {
      const res = await fetch('/api/agent-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!data.valid) {
        setVerifyStatus('error');
        setVerifyError(data.error || 'That subscription code is not active.');
        return;
      }
      window.localStorage.setItem(ACCESS_KEY, 'true');
      setAccess(true);
      setVerifyStatus('success');
    } catch {
      setVerifyStatus('error');
      setVerifyError('We could not verify the code. Please try again.');
    }
  }

  function runAudit(e) {
    e.preventDefault();
    if (!file) return;
    setStatus('ready');
  }

  if (!access) {
    return (
      <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
        <Nav />
        <main className="max-w-3xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brass">ClearSign for Agents</p>
          <h1 className="text-4xl md:text-5xl mt-2">Your agent workspace.</h1>
          <p className="text-lg text-muted mt-5 max-w-2xl">This is the working area for ClearSign Agents. Subscribe once, then use your subscription code to restore access on another browser or device.</p>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            <div className="bg-panel border border-line rounded-xl p-6">
              <p className="text-xs uppercase tracking-widest text-brass">New customer</p>
              <h2 className="text-2xl mt-2">Get Agent access</h2>
              <p className="text-sm text-muted mt-3">Choose your Agent subscription through checkout, then return here with your subscription code.</p>
              <a href={CHECKOUT_URL} target="_blank" rel="noreferrer" className="inline-block mt-6 px-5 py-3 rounded-lg bg-redline text-white font-medium">Subscribe to ClearSign for Agents</a>
            </div>

            <div className="bg-panel border border-line rounded-xl p-6">
              <p className="text-xs uppercase tracking-widest text-brass">Already subscribed?</p>
              <h2 className="text-2xl mt-2">Restore your access</h2>
              <p className="text-sm text-muted mt-3">Enter the Whop membership ID supplied with your subscription. We verify it securely without storing the code in your browser.</p>
              <form onSubmit={recoverAccess} className="mt-5">
                <input value={code} onChange={e => setCode(e.target.value)} placeholder="Subscription code" autoComplete="off" className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-paper" />
                <button disabled={!code || verifyStatus === 'checking'} className="w-full mt-3 px-5 py-3 rounded-lg border border-line text-paper disabled:opacity-40">{verifyStatus === 'checking' ? 'Checking…' : 'Restore access'}</button>
              </form>
              {verifyStatus === 'success' && <p className="text-sm text-paper mt-3">Access restored.</p>}
              {verifyStatus === 'error' && <p className="text-sm text-red-300 mt-3">{verifyError}</p>}
            </div>
          </div>

          <div className="mt-8 border border-line rounded-xl p-5 text-sm text-muted">
            <strong className="text-paper">Important:</strong> keep your subscription code somewhere safe. It is the recovery key for this browser-based access layer.
          </div>
        </main>
        <Footer />
      </div>
    );
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
          {quickStats.map(([label, value]) => <div key={label} className="bg-panel border border-line rounded-xl p-5"><p className="text-sm text-muted">{label}</p><p className="text-2xl mt-2">{value}</p></div>)}
        </section>

        <section className="mt-12">
          <div className="mb-5"><p className="text-xs uppercase tracking-widest text-brass">Tools</p><h2 className="text-2xl mt-1">Built to save agent time</h2></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map(tool => <div key={tool.title} className="bg-panel border border-line rounded-xl p-6 flex flex-col min-h-48"><h3 className="text-xl">{tool.title}</h3><p className="text-sm text-muted mt-2 flex-1">{tool.description}</p><button onClick={() => tool.title === 'Compliance audit' && setShowAudit(true)} className={`mt-5 text-sm rounded-lg px-4 py-2 border ${tool.primary ? 'bg-redline border-redline text-white' : 'border-line text-paper'}`}>{tool.action}</button></div>)}
          </div>
        </section>

        <section className="mt-12 bg-panel border border-line rounded-xl p-6 md:p-8">
          <p className="text-xs uppercase tracking-widest text-brass">Recent cases</p>
          <h2 className="text-2xl mt-1">Your work</h2>
          <div className="mt-6 border border-line rounded-lg p-8 text-center"><p className="text-paper">No cases yet.</p><p className="text-sm text-muted mt-2">Start your first compliance audit to create a case.</p><button onClick={() => setShowAudit(true)} className="mt-5 px-5 py-2 rounded-lg border border-line">Start an audit</button></div>
        </section>

        <div className="mt-8 text-sm"><Link href="/for-agents" className="text-muted hover:text-paper">← Back to Agent pricing</Link></div>
      </main>
      <Footer />

      {showAudit && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" role="dialog" aria-modal="true"><div className="w-full max-w-xl bg-panel border border-line rounded-xl p-6 md:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-brass">New audit</p><h2 className="text-2xl mt-1">Upload tenancy agreement</h2></div><button onClick={() => setShowAudit(false)} className="text-muted" aria-label="Close">×</button></div><p className="text-sm text-muted mt-4">Upload the agreement you want ClearSign to review.</p><form onSubmit={runAudit} className="mt-6"><label className="block border border-dashed border-line rounded-xl p-8 text-center cursor-pointer hover:border-brass"><input type="file" accept=".pdf,.doc,.docx,.txt" className="sr-only" onChange={e => setFile(e.target.files?.[0] || null)} /><span className="text-paper">{file ? file.name : 'Choose a tenancy agreement'}</span><span className="block text-xs text-muted mt-2">PDF, DOC, DOCX or TXT</span></label><button disabled={!file || status === 'ready'} className="w-full mt-5 px-5 py-3 rounded-lg bg-redline text-white font-medium disabled:opacity-40">{status === 'ready' ? 'Audit queued' : 'Run compliance audit'}</button></form>{status === 'ready' && <div className="mt-5 border border-line rounded-lg p-4"><p className="text-paper">Upload captured successfully.</p><p className="text-sm text-muted mt-1">The audit engine connection is the next backend step.</p></div>}</div></div>}
    </div>
  );
}
