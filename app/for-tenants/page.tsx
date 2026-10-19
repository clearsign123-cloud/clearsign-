import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from '../../components/layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono' });

export default function ForTenantsPage() {
  return (
    <div className={`${inter.variable} ${jbMono.variable} min-h-screen`}>
      <Nav />
      <main>
        <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-widest text-brass">ClearSign · For tenants</p>
          <h1 className="text-4xl md:text-6xl mt-4 max-w-4xl leading-tight">Understand your tenancy paperwork with more confidence.</h1>
          <p className="text-lg text-muted mt-6 max-w-2xl">A clear starting point for organising your tenancy documents, understanding what to look for, and preparing questions before you speak to your landlord, letting agent or an adviser.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/pricing" className="px-6 py-3 rounded-lg bg-brass text-ink font-medium">View ClearSign options</Link>
            <Link href="/for-agents" className="px-6 py-3 rounded-lg border border-line text-paper">I'm a letting agent</Link>
          </div>
        </section>
        <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
          <div className="bg-panel border border-line rounded-xl p-6"><p className="text-brass text-xs uppercase tracking-widest">01 · Organise</p><h2 className="text-xl mt-3">Keep documents together</h2><p className="text-sm text-muted mt-2">Gather your agreement, deposit information, inventory, certificates and important messages in one place.</p></div>
          <div className="bg-panel border border-line rounded-xl p-6"><p className="text-brass text-xs uppercase tracking-widest">02 · Understand</p><h2 className="text-xl mt-3">Know what to ask about</h2><p className="text-sm text-muted mt-2">Use plain-language guidance to identify points you may want to clarify. A flagged clause is a prompt to check, not a legal conclusion.</p></div>
          <div className="bg-panel border border-line rounded-xl p-6"><p className="text-brass text-xs uppercase tracking-widest">03 · Prepare</p><h2 className="text-xl mt-3">Keep a useful record</h2><p className="text-sm text-muted mt-2">Note questions, dates and supporting evidence so you can have a more informed conversation with the relevant person or adviser.</p></div>
        </section>
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="border border-line rounded-2xl p-8 bg-panel">
            <h2 className="text-2xl">A note on using ClearSign</h2>
            <p className="text-muted mt-3">ClearSign is an information and organisation tool, not a solicitor or substitute for legal advice. Tenancy rules vary by location and situation; verify important decisions with current official guidance or a qualified adviser.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
