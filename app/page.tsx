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

function ClearSignMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" role="img" aria-label="ClearSign gold mark" fill="none">
      <g stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 8H18C12.5 8 8 12.5 8 18V27" />
        <path d="M73 8H82C87.5 8 92 12.5 92 18V27" />
        <path d="M8 73V82C8 87.5 12.5 92 18 92H27" />
        <path d="M92 73V82C92 87.5 87.5 92 82 92H73" />
        <path d="M30 50H70" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
      <Nav />
      <main>
        <section className="relative overflow-hidden border-b border-line">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[#cba64f]/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-[#cba64f]"><ClearSignMark className="h-12 w-12 md:h-14 md:w-14" /></div>
              <div><p className="text-lg font-semibold tracking-tight">ClearSign<span className="text-[#cba64f]">.</span></p><p className="text-xs uppercase tracking-[0.2em] text-muted">Tenancy clarity</p></div>
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#d6b45e]">TENANCY CLARITY · COMPLIANCE WORKSPACE</p>
            <h1 className="text-5xl md:text-7xl max-w-4xl mt-5 leading-[1.04] tracking-tight">Every tenancy.<br/><span className="text-[#d6b45e]">One clear view.</span></h1>
            <p className="text-lg md:text-xl text-muted mt-7 max-w-2xl leading-relaxed">ClearSign helps letting teams review tenancy files, spot gaps that need checking and keep follow-up actions visible. Tenants get a practical place to prepare, organise and track their own paperwork.</p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link href="/agents" className="px-6 py-3 rounded-lg bg-[#cba64f] hover:bg-[#d9b963] text-[#201e1a] font-semibold">Open agent workspace <span aria-hidden="true">↗</span></Link>
              <Link href="/for-tenants" className="px-6 py-3 rounded-lg border border-[#cba64f]/70 text-paper hover:bg-[#cba64f]/10">Use tenant checker</Link>
              <Link href="/for-agents" className="px-6 py-3 rounded-lg border border-line text-paper hover:border-[#cba64f]/60">How it works</Link>
            </div>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['REVIEW','Documents & details'],['FLAG','Potential gaps'],['TRACK','Next actions'],['RECORD','Evidence & notes']].map(([tag,label]) => <div key={tag} className="border-l-2 border-[#cba64f] pl-4 py-2"><p className="font-mono text-xs text-[#d6b45e] tracking-widest">{tag}</p><p className="text-sm mt-1">{label}</p></div>)}
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8"><div><p className="text-xs uppercase tracking-[0.2em] text-[#d6b45e]">A clearer process</p><h2 className="text-3xl md:text-4xl mt-3">From paperwork to next steps.</h2></div><p className="text-muted max-w-xl">ClearSign is designed to help people organise checks and follow-ups. It does not replace a full file review or qualified legal advice.</p></div>
          <div className="grid md:grid-cols-3 gap-4">{features.map(f => <article key={f.n} className="bg-panel border border-line rounded-xl p-6 md:p-7 hover:border-[#cba64f]/50 transition-colors"><p className="font-mono text-sm text-[#d6b45e]">{f.n} / PROCESS</p><h3 className="text-xl mt-5">{f.title}</h3><p className="text-sm text-muted mt-3 leading-relaxed">{f.body}</p></article>)}</div>
        </section>
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="rounded-2xl border border-[#cba64f]/40 bg-[#cba64f]/[0.06] p-7 md:p-10 grid md:grid-cols-[auto,1fr] gap-6 md:gap-9 items-start">
            <div className="rounded-xl bg-[#cba64f]/10 p-4 text-[#d6b45e]"><ClearSignMark className="h-14 w-14 md:h-16 md:w-16" /></div>
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#d6b45e]">A note from our founder</p>
              <h2 className="text-3xl md:text-4xl mt-3">Why I’m building ClearSign.</h2>
              <p className="text-muted mt-5 leading-relaxed">I’m Henry, the founder of ClearSign. I’m building ClearSign around a simple belief: renting should be easier to understand, with important documents, outstanding questions and next steps easier to keep track of.</p>
              <p className="text-muted mt-4 leading-relaxed">Tenancy paperwork can feel fragmented and difficult to navigate. ClearSign aims to bring more structure and visibility to that process for both tenants and letting teams—so it’s easier to see what has been checked, what still needs attention and what to do next.</p>
              <p className="mt-5 font-medium">Henry <span className="text-[#d6b45e]">·</span> Founder, ClearSign</p>
              <p className="text-xs text-muted mt-2">This is an introduction to the mission; it can be made more personal with Henry’s own story and experience.</p>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-[#cba64f]/50 rounded-2xl p-7 md:p-9 bg-[#cba64f]/[0.05]"><p className="text-xs uppercase tracking-[0.2em] text-[#d6b45e]">For letting teams</p><h2 className="text-2xl mt-3">A workspace for the whole portfolio.</h2><p className="text-muted mt-3">Review properties and tenancies, use the compliance checklist, record findings and manage the actions that follow.</p><div className="flex flex-wrap gap-3 mt-6"><Link href="/agents" className="px-5 py-3 rounded-lg bg-[#cba64f] text-[#201e1a] font-semibold">Go to agent workspace</Link><Link href="/agents/audit" className="px-5 py-3 rounded-lg border border-[#cba64f]/60 hover:bg-[#cba64f]/10">Open tenancy checker</Link></div></div>
            <div className="border border-line rounded-2xl p-7 md:p-9 bg-panel"><p className="text-xs uppercase tracking-[0.2em] text-[#d6b45e]">For tenants</p><h2 className="text-2xl mt-3">Your own tenancy checklist.</h2><p className="text-muted mt-3">Work through your documents, note questions, track what you have and export a copy of your notes for a conversation with your agent or adviser.</p><div className="mt-6"><Link href="/for-tenants" className="inline-flex px-5 py-3 rounded-lg border border-[#cba64f]/60 text-paper hover:bg-[#cba64f]/10">Start tenant checker ↗</Link></div></div>
          </div>
          <p className="text-xs text-muted mt-7">ClearSign provides organisational and first-pass screening support, not legal advice. Verify important findings against current official guidance and the full tenancy file.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
