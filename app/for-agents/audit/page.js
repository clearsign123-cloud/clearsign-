'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export default function AgentAuditPage() {
  const router = useRouter();
  const [property, setProperty] = useState('');
  const [reference, setReference] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!file) return setError('Please upload a tenancy agreement.');
    setStatus('auditing');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('property', property);
      form.append('reference', reference);
      const res = await fetch('/api/agent-audit', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed.');
      sessionStorage.setItem('clearsign_agent_audit', JSON.stringify(data));
      router.push('/for-agents/audit/results');
    } catch (err) {
      setStatus('idle');
      setError(err.message || 'Something went wrong.');
    }
  }

  return <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
    <Nav />
    <main className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-brass">ClearSign for Agents</p>
      <h1 className="text-4xl mt-2">New compliance audit</h1>
      <p className="text-muted mt-3 max-w-2xl">Upload a tenancy agreement and ClearSign will extract the text and run the first-pass compliance checks.</p>
      <form onSubmit={submit} className="mt-10 bg-panel border border-line rounded-xl p-6 md:p-8 space-y-6">
        <label className="block text-sm text-muted">Property / address<input required value={property} onChange={e => setProperty(e.target.value)} className="mt-2 w-full bg-ink border border-line rounded-lg px-4 py-3 text-paper" placeholder="12 High Street" /></label>
        <label className="block text-sm text-muted">Tenancy reference <span className="text-muted/70">(optional)</span><input value={reference} onChange={e => setReference(e.target.value)} className="mt-2 w-full bg-ink border border-line rounded-lg px-4 py-3 text-paper" placeholder="TEN-001" /></label>
        <label className="block text-sm text-muted">Tenancy agreement<input required type="file" accept="application/pdf,.txt,text/plain" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-2 block w-full bg-ink border border-line rounded-lg px-4 py-3 text-paper" /></label>
        {file && <p className="text-sm text-muted">Selected: {file.name}</p>}
        {error && <div className="border border-red-500/40 bg-red-500/10 rounded-lg p-4 text-sm">{error}</div>}
        <button disabled={status === 'auditing'} className="px-6 py-3 rounded-lg bg-brass text-ink font-medium disabled:opacity-50">{status === 'auditing' ? 'Analysing agreement…' : 'Run compliance audit'}</button>
      </form>
    </main>
    <Footer />
  </div>;
}
