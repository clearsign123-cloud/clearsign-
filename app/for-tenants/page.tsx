'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });
const STORE = 'clearsign_tenant_checklist_v1';
const checklist = [
  { section: 'Your agreement', items: ['I have a copy of my signed tenancy agreement', 'Names, property address, dates and rent look correct', 'I understand how the deposit and rent are described', 'I have noted any clauses I want explained'] },
  { section: 'Deposit & payments', items: ['I have a receipt or record of the deposit paid', 'I have information about the deposit protection scheme, if applicable', 'I have a record of rent payments and agreed charges'] },
  { section: 'Property & safety documents', items: ['I have received the inventory or check-in report, if provided', 'I know where to find gas safety information, if applicable', 'I have received the energy performance information, if applicable', 'I know how to access electrical safety information, if applicable'] },
  { section: 'Contacts & communication', items: ['I have the landlord or letting agent contact details', 'I have saved important messages and repair requests', 'I have recorded outstanding questions and dates'] },
];

export default function ForTenantsPage() {
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORE) || '{}'); setChecked(saved.checked || {}); setNotes(saved.notes || ''); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORE, JSON.stringify({ checked, notes })); }, [checked, notes, ready]);
  const total = checklist.reduce((n, s) => n + s.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const exportNotes = () => {
    const lines = ['CLEARSIGN — MY TENANCY CHECKLIST', '', ...checklist.map(s => s.section + '\n' + s.items.map(item => (checked[item] ? '[x] ' : '[ ] ') + item).join('\n')), '', 'QUESTIONS / NOTES', notes, '', 'This checklist is for organisation only; it is not a legal assessment.'];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'clearsign-tenant-checklist.txt'; a.click(); URL.revokeObjectURL(url);
  };
  return <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}><header className="border-b border-white/10"><nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4"><Link href="/for-tenants" className="font-semibold text-lg tracking-tight">ClearSign <span className="text-red-400">/ Tenant</span></Link><div className="flex gap-4 text-sm"><Link href="/for-tenants" className="text-red-300">My checklist</Link><Link href="/" className="text-muted hover:text-paper">Main site</Link><Link href="/for-agents" className="text-muted hover:text-paper">Agent tools</Link></div></nav></header><main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
    <Link href="/" className="text-sm text-muted hover:text-red-400">← ClearSign home</Link>
    <div className="mt-8 border-l-4 border-red-500 pl-5"><p className="text-xs uppercase tracking-[0.22em] text-red-400">CLEARSIGN · TENANT TOOL</p><h1 className="text-4xl md:text-5xl mt-3 leading-tight">Your tenancy.<br/><span className="text-red-400">Know what you have.</span></h1><p className="text-lg text-muted mt-5 max-w-2xl">A practical checklist to help you organise tenancy documents, note questions and keep track of what you still need to ask about. Your checklist is saved in this browser on this device.</p></div>
    <section className="mt-8"><div className="mb-4"><p className="text-xs uppercase tracking-widest text-red-400">Your tenant tools</p><h2 className="text-2xl mt-2">Check the important details</h2><p className="text-sm text-muted mt-2 max-w-2xl">Use these guided checkers alongside your saved checklist. They help you spot questions to follow up, not make a final legal decision.</p></div><div className="grid md:grid-cols-2 gap-4"><Link href="/for-tenants/deposit-checker" className="group bg-panel border border-line hover:border-red-500/70 rounded-xl p-6 transition-colors"><span className="text-red-400 text-xs uppercase tracking-widest">01 · Deposit</span><h3 className="text-xl mt-3">Deposit checker <span className="text-red-400 group-hover:translate-x-1 inline-block">↗</span></h3><p className="text-sm text-muted mt-2">Record your deposit amount, scheme and dates, and identify missing information to ask your landlord or agent about.</p><span className="inline-block mt-5 text-sm text-red-300">Open deposit checker →</span></Link><Link href="/for-tenants/agreement-checker" className="group bg-panel border border-line hover:border-red-500/70 rounded-xl p-6 transition-colors"><span className="text-red-400 text-xs uppercase tracking-widest">02 · Agreement</span><h3 className="text-xl mt-3">Agreement checker <span className="text-red-400 group-hover:translate-x-1 inline-block">↗</span></h3><p className="text-sm text-muted mt-2">Work through key details in your tenancy agreement and note clauses or missing information you want explained.</p><span className="inline-block mt-5 text-sm text-red-300">Open agreement checker →</span></Link></div></section>
    <div className="grid sm:grid-cols-3 gap-3 mt-8">
      <div className="bg-panel border border-line rounded-xl p-5"><p className="text-xs text-muted uppercase tracking-widest">Checklist progress</p><p className="text-3xl mt-2">{done}<span className="text-muted text-lg"> / {total}</span></p><div className="h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden"><div className="h-full bg-red-500" style={{width: (done/total*100)+'%'}}/></div></div>
      <div className="bg-panel border border-line rounded-xl p-5"><p className="text-xs text-muted uppercase tracking-widest">Your notes</p><p className="text-sm mt-3">Keep questions, dates and follow-ups together.</p></div>
      <div className="bg-panel border border-line rounded-xl p-5"><p className="text-xs text-muted uppercase tracking-widest">Take it with you</p><button onClick={exportNotes} className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium">Export checklist</button></div>
    </div>
    <div className="grid lg:grid-cols-2 gap-4 mt-6">{checklist.map((section, i) => <section key={section.section} className="bg-panel border border-line rounded-xl p-5 md:p-6"><p className="font-mono text-xs text-red-400">0{i+1} / CHECK</p><h2 className="text-xl mt-2 mb-4">{section.section}</h2><div className="space-y-3">{section.items.map(item => <label key={item} className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer"><input type="checkbox" checked={!!checked[item]} onChange={e => setChecked(old => ({...old, [item]: e.target.checked}))} className="mt-1 accent-red-500"/><span className={checked[item] ? 'text-muted line-through' : 'text-paper'}>{item}</span></label>)}</div></section>)}</div>
    <section className="bg-panel border border-line rounded-xl p-5 md:p-6 mt-4"><h2 className="text-xl">Questions, concerns or dates to remember</h2><p className="text-sm text-muted mt-2">For example: “Ask when the deposit information will arrive” or “Keep a copy of the repair request sent on 12 October.”</p><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Write your notes here…" className="mt-4 w-full rounded-lg bg-black/20 border border-line p-4 text-sm text-paper placeholder:text-muted focus:outline-none focus:border-red-500"/></section>
    <div className="border border-redline/50 bg-redline/5 rounded-xl p-5 mt-5"><p className="text-sm text-paper">Important: this tool helps you organise information. It does not determine whether your tenancy is legally compliant or replace advice. Requirements vary by location and circumstances; check official guidance or speak to a qualified adviser if something matters to your rights.</p><button onClick={() => { if(confirm('Clear all saved checklist ticks and notes on this device?')) { setChecked({}); setNotes(''); } }} className="text-sm text-red-300 underline mt-4">Clear my checklist</button></div>
  </main><Footer/></div>;
}
