import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

const features = [
  { n: '01', title: 'Check the paperwork', body: 'Work through tenancy documents and flag missing details or points that deserve a closer look.' },
  { n: '02', title: 'See the whole picture', body: 'Keep property records, findings and follow-up actions together instead of scattered across files.' },
  { n: '03', title: 'Keep a clear record', body: 'Record what you checked, what still needs attention and what evidence supports the decision.' },
];

export default function HomePage() {
  return (
    <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
      <Nav />
      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-redline/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
            <p className="text-xs uppercase tracking-[0.24em] text-red-400">TENANCY CLARITY · COMPLIANCE WORKSPACE</p>
            <h1 className="text-5xl md:text-7xl max-w-4xl mt-5 leading-[1.04] tracking-tight">Every tenancy.<br/><span className="text-red-400">One clear view.</span></h1>
            <p className="text-lg md:text-xl text-muted mt-7 max-w-2xl leading-relaxed">ClearSign helps letting teams review tenancy files, spot gaps that need checking and keep follow-up actions visible. Tenants get a practical place to prepare, organise and track their own paperwork.</p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link href="/agents" className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium">Open agent workspace <span aria-hidden="true">↗</span></Link>
              <Link href="/for-tenants" className="px-6 py-3 rounded-lg border border-redline text-paper hover:bg-redline/10">Use tenant checker</Link>
              <Link href="/for-agents" className="px-6 py-3 rounded-lg border border-line text-paper">How it works</Link>
            </div>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['REVIEW','Documents & details'],['FLAG','Potential gaps'],['TRACK','Next actions'],['RECORD','Evidence & notes']].map(([tag,label]) => <div key={tag} className="border-l-2 border-red-500 pl-4 py-2"><p className="font-mono text-xs text-red-400 tracking-widest">{tag}</p><p className="text-sm mt-1">{label}</p></div>)}
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8"><div><p className="text-xs uppercase tracking-[0.2em] text-red-400">A clearer process</p><h2 className="text-3xl md:text-4xl mt-3">From paperwork to next steps.</h2></div><p className="text-muted max-w-xl">ClearSign is designed to help people organise checks and follow-ups. It does not replace the full file review or qualified legal advice.</p></div>
          <div className="grid md:grid-cols-3 gap-4">{features.map(f => <article key={f.n} className="bg-panel border border-line rounded-xl p-6 md:p-7"><p className="font-mono text-sm text-red-400">{f.n} / PROCESS</p><h3 className="text-xl mt-5">{f.title}</h3><p className="text-sm text-muted mt-3 leading-relaxed">{f.body}</p></article>)}</div>
        </section>
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-redline/60 rounded-2xl p-7 md:p-9 bg-redline/5"><p className="text-xs uppercase tracking-[0.2em] text-red-400">For letting teams</p><h2 className="text-2xl mt-3">A workspace for the whole portfolio.</h2><p className="text-muted mt-3">Review properties and tenancies, use the compliance checklist, record findings and manage the actions that follow.</p><div className="flex flex-wrap gap-3 mt-6"><Link href="/agents" className="px-5 py-3 rounded-lg bg-red-600 text-white font-medium">Go to agent workspace</Link><Link href="/agents/audit" className="px-5 py-3 rounded-lg border border-redline">Open tenancy checker</Link></div></div>
            <div className="border border-line rounded-2xl p-7 md:p-9 bg-panel"><p className="text-xs uppercase tracking-[0.2em] text-red-400">For tenants</p><h2 className="text-2xl mt-3">Your own tenancy checklist.</h2><p className="text-muted mt-3">Work through your documents, note questions, track what you have and export a copy of your notes for a conversation with your agent or adviser.</p><div className="mt-6"><Link href="/for-tenants" className="inline-flex px-5 py-3 rounded-lg border border-redline text-paper hover:bg-redline/10">Start tenant checker ↗</Link></div></div>
          </div>
          <p className="text-xs text-muted mt-7">ClearSign provides organisational and first-pass screening support, not legal advice. Verify important findings against current official guidance and the full tenancy file.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
