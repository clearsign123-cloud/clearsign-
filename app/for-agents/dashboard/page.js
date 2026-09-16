'use client';

import { useMemo, useState } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

const initialCases = [
  { id: 'CS-1042', property: '12 High Street', tenant: 'Smith', status: 'Needs attention', issues: 3, priority: 'High', updated: 'Today' },
  { id: 'CS-1041', property: '8 King Road', tenant: 'Jones', status: 'Clear', issues: 0, priority: 'Low', updated: 'Yesterday' },
  { id: 'CS-1039', property: '41 Park Avenue', tenant: 'Brown', status: 'Needs attention', issues: 2, priority: 'Medium', updated: '2 days ago' },
];

const tools = [
  { title: 'Compliance audit', text: 'Upload a tenancy agreement and identify potential compliance issues.', action: 'New audit' },
  { title: 'Case management', text: 'Keep agreements, findings, notes and actions together for each tenancy.', action: 'View cases' },
  { title: 'Deposit dispute evidence', text: 'Organise evidence and identify gaps before responding to a dispute.', action: 'New dispute' },
  { title: 'Compliance tracker', text: 'See which tenancies are clear, need attention or need action.', action: 'Open tracker' },
  { title: 'Reports', text: 'Turn completed audits into clear records for your agency files.', action: 'View reports' },
];

export default function AgentDashboard() {
  const [cases, setCases] = useState(initialCases);
  const [showAudit, setShowAudit] = useState(false);
  const [fileName, setFileName] = useState('');

  const stats = useMemo(() => ({
    active: cases.length,
    attention: cases.filter(c => c.status === 'Needs attention').length,
    issues: cases.reduce((sum, c) => sum + c.issues, 0),
    clear: cases.filter(c => c.status === 'Clear').length,
  }), [cases]);

  function startAudit(e) {
    e.preventDefault();
    if (!fileName) return;
    setCases(prev => [{ id: `CS-${1043 + prev.length}`, property: 'New tenancy', tenant: 'New case', status: 'Processing', issues: 0, priority: 'Pending', updated: 'Just now' }, ...prev]);
    setShowAudit(false);
    setFileName('');
  }

  return (
    <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-brass">ClearSign for Agents</p>
            <h1 className="text-4xl md:text-5xl mt-2">Good morning</h1>
            <p className="text-muted mt-3 max-w-2xl">Your compliance workspace. See what needs attention and deal with it before it becomes a bigger problem.</p>
          </div>
          <button onClick={() => setShowAudit(true)} className="px-5 py-3 rounded-lg bg-brass text-ink font-medium">+ New audit</button>
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {[
            ['Active cases', stats.active],
            ['Need attention', stats.attention],
            ['Potential issues', stats.issues],
            ['Clear', stats.clear],
          ].map(([label, value]) => (
            <div key={label} className="bg-panel border border-line rounded-xl p-5">
              <p className="text-sm text-muted">{label}</p>
              <p className="text-3xl mt-2">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-brass">Priority cases</p>
              <h2 className="text-2xl mt-1">Needs your attention</h2>
            </div>
            <button className="text-sm text-muted hover:text-paper">View all</button>
          </div>
          <div className="space-y-3">
            {cases.map(c => (
              <div key={c.id} className="bg-panel border border-line rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{c.property}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${c.status === 'Clear' ? 'border-line text-muted' : 'border-redline text-paper'}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-muted mt-1">{c.tenant} · {c.id} · Updated {c.updated}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted">{c.issues ? `${c.issues} potential issue${c.issues === 1 ? '' : 's'}` : 'No issues flagged'}</p>
                  <button className="px-4 py-2 rounded-lg border border-line text-sm">Open case</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="text-xs uppercase tracking-widest text-brass">Agent tools</p>
          <h2 className="text-2xl mt-1 mb-5">Save time across every tenancy</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map(tool => (
              <div key={tool.title} className="bg-panel border border-line rounded-xl p-6">
                <h3 className="text-lg">{tool.title}</h3>
                <p className="text-sm text-muted mt-2 min-h-12">{tool.text}</p>
                <button onClick={() => tool.title === 'Compliance audit' && setShowAudit(true)} className="mt-5 text-sm text-brass">{tool.action} →</button>
              </div>
            ))}
          </div>
        </section>

        {showAudit && (
          <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-panel border border-line rounded-xl p-7">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs uppercase tracking-widest text-brass">New audit</p><h2 className="text-2xl mt-1">Check a tenancy agreement</h2></div>
                <button onClick={() => setShowAudit(false)} className="text-muted">Close</button>
              </div>
              <p className="text-sm text-muted mt-4">Upload the agreement to create a new case. The audit results will appear in the case once processing is complete.</p>
              <form onSubmit={startAudit} className="mt-6 space-y-4">
                <label className="block border border-dashed border-line rounded-xl p-6 text-center cursor-pointer">
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
                  <span className="text-sm">{fileName || 'Choose a tenancy agreement'}</span>
                  <span className="block text-xs text-muted mt-2">PDF, DOC, DOCX or TXT</span>
                </label>
                <button disabled={!fileName} className="w-full px-5 py-3 rounded-lg bg-brass text-ink font-medium disabled:opacity-40">Start audit</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
