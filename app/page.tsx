import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export default function HomePage() {
  return (
    <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
      <Nav />
      <main>
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-widest text-brass">ClearSign · Tenancy compliance</p>
          <h1 className="text-4xl md:text-6xl max-w-4xl mt-4 leading-tight">Clearer tenancy checks. More confident decisions.</h1>
          <p className="text-lg md:text-xl text-muted mt-6 max-w-2xl">Review tenancy paperwork, flag potential compliance gaps and keep your next actions organised in one place.</p>
          <div className="flex flex-wrap gap-3 mt-9">
            <Link href="/for-tenants" className="px-6 py-3 rounded-lg bg-brass text-ink font-medium">ClearSign for Tenants</Link>
            <Link href="/for-agents" className="px-6 py-3 rounded-lg border border-line text-paper">ClearSign for Agents</Link>
            <Link href="/pricing" className="px-6 py-3 rounded-lg border border-line text-paper">View pricing</Link>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
          <div className="bg-panel border border-line rounded-xl p-6"><p className="text-brass text-xs uppercase tracking-widest">01 · Review</p><h2 className="text-xl mt-3">Check tenancy agreements</h2><p className="text-sm text-muted mt-2">Run a first-pass screen for wording and information that may need further review.</p></div>
          <div className="bg-panel border border-line rounded-xl p-6"><p className="text-brass text-xs uppercase tracking-widest">02 · Organise</p><h2 className="text-xl mt-3">Keep actions visible</h2><p className="text-sm text-muted mt-2">Organise property records, findings and follow-up tasks in the agent workspace.</p></div>
          <div className="bg-panel border border-line rounded-xl p-6"><p className="text-brass text-xs uppercase tracking-widest">03 · Follow up</p><h2 className="text-xl mt-3">Know what to check next</h2><p className="text-sm text-muted mt-2">Use findings as a starting point for checking the full paperwork and supporting evidence.</p></div>
        </section>
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="border border-line rounded-2xl p-8 md:p-12 bg-panel">
            <h2 className="text-2xl md:text-3xl">Separate support for tenants and letting teams</h2>
            <p className="text-muted mt-3 max-w-2xl">Tenants can organise paperwork and prepare questions. Letting agents can access the dedicated workspace and agreement review tools.</p>
            <div className="flex flex-wrap gap-3 mt-6"><Link href="/for-tenants" className="px-5 py-3 rounded-lg bg-brass text-ink font-medium">Tenant information</Link><Link href="/agents" className="px-5 py-3 rounded-lg border border-line">Agent workspace</Link><Link href="/agents/audit/review" className="px-5 py-3 rounded-lg border border-line">Review an agreement</Link></div>
            <p className="text-xs text-muted mt-5">ClearSign provides first-pass screening support, not legal advice. Always verify findings against current requirements and the complete tenancy file.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
