'use client';
import Script from 'next/script';
import { Nav, Footer } from '../../components/layout';
const FREE_TOOLS = [
  { name: 'Clause Analyzer', desc: 'spot risky or unfair clauses in your tenancy agreement' },
  { name: 'Compare Contracts', desc: 'compare two agreements side by side' },
  { name: 'Deposit Protection Checker', desc: 'confirm your deposit is protected correctly' },
  { name: 'Landlord Email Drafter', desc: 'generate clear, professional emails to your landlord' },
  { name: 'Guarantor Clause Analyzer', desc: 'for parents/guardians — check what liability you\'re actually taking on' },
];
const PRO_TOOLS = [
  { name: 'Save & Export Reports', desc: 'keep every analysis, ready to reference anytime' },
  { name: 'Move-in Checklist', desc: 'make sure meter readings, keys, deposit protection, and legal requirements are all covered on day one' },
  { name: 'Condition/Inventory Report Builder', desc: "a room-by-room photo record of your property's condition when you move in, timestamped and ready to use as evidence if there's ever a deposit dispute" },
  { name: 'Repair Request Drafter', desc: 'generate a clear, professional repair request to your landlord, backed by UK housing law' },
  { name: 'Deposit Dispute Pack', desc: 'auto-compile your move-in inventory and end-of-tenancy evidence into one ready-to-submit pack' },
  { name: 'Priority Support', desc: 'your emails to clear_sign@outlook.com jump the queue' },
  { name: 'Early Access', desc: 'new tools land in your account before public release' },
];
const COMING_SOON = [
  { name: 'Rent Increase Checker', desc: 'check whether a rent increase notice is valid and correctly served' },
  { name: 'Renewal Contract Re-check', desc: 're-run the analyzer automatically when your tenancy renews' },
];
export default function Pricing() {
  return <div className="min-h-screen flex flex-col">
    <Script src="https://js.whop.com/static/checkout/loader.js" strategy="afterInteractive" />
    <Nav />
    <main className="flex-1 max-w-4xl mx-auto px-6 py-20 space-y-16">
      <div><p className="text-xs uppercase tracking-widest text-brass">Pricing</p><h1 className="text-4xl mt-2">ClearSign Pricing</h1></div>
      <div className="bg-panel border border-line rounded-xl p-6 md:p-8 space-y-3">
        <p className="text-xs uppercase tracking-widest text-brass">Why I built ClearSign</p>
        <p className="text-paper/90 leading-relaxed">Most people sign their tenancy agreement without reading it properly. Not because they don't care — because it's long, dense, and written to be skimmed past, not understood. By the time something goes wrong, it's too late to ask what you actually agreed to.</p>
        <p className="text-paper/90 leading-relaxed">ClearSign exists so you can check before you sign, not after. I built it to catch the clauses most people miss, in plain English, in a few minutes.</p>
        <p className="text-sm text-muted">— Henry, founder of ClearSign</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-panel border border-line rounded-xl p-8 space-y-5"><div><h3 className="text-2xl">Free</h3><p className="text-muted mt-1">Try every tool, no card required.</p></div><ul className="text-sm space-y-3">{FREE_TOOLS.map((t)=><li key={t.name}><span className="text-paper font-medium">{t.name} </span><span className="text-muted"> — {t.desc}</span></li>)}</ul><p className="text-xs text-brass pt-2 border-t border-line">2 free uses per tool, per month. No sign-up required.</p></div>
        <div className="bg-redline rounded-xl p-8 space-y-5"><div><h3 className="text-2xl">ClearSign Pro</h3><p className="text-paper/80 mt-2 text-sm">Unlimited use of every tool above, plus tools that support you through your whole tenancy. Same access either way — pick how you'd rather pay.</p></div><ul className="text-sm space-y-3">{PRO_TOOLS.map((t)=><li key={t.name}><span className="font-medium">{t.name}</span><span className="text-paper/80"> — {t.desc}</span></li>)}</ul><div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-paper/20">
          <div className="bg-ink/40 rounded-lg p-4 space-y-3"><div><p className="text-xs uppercase tracking-widest text-paper/70">Subscribe</p><p className="text-3xl mt-1">£3.99<span className="text-base">/month</span></p><p className="text-xs text-paper/70 mt-1">Cancel anytime.</p></div><div data-whop-checkout-plan-id="plan_JwVD2VX0kHS0r" data-whop-checkout-theme="dark" data-whop-checkout-theme-accent-color="tomato" /></div>
          <div className="bg-ink/40 rounded-lg p-4 space-y-3"><div><p className="text-xs uppercase tracking-widest text-paper/70">One-time</p><p className="text-3xl mt-1">£5.99</p><p className="text-xs text-paper/70 mt-1">No subscription. Pay once, keep access.</p></div><div data-whop-checkout-plan-id="plan_KLZjQmDEaHjqI" data-whop-checkout-theme="dark" data-whop-checkout-theme-accent-color="tomato" /></div>
        </div></div>
      </div>
      <div className="space-y-6"><h2 className="text-2xl">Coming soon to Pro</h2><div className="grid md:grid-cols-2 gap-4">{COMING_SOON.map((t)=><div key={t.name} className="border border-line rounded-lg p-4"><p className="text-paper font-medium">{t.name}</p><p className="text-sm text-muted mt-1">{t.desc}</p></div>)}</div></div>
    </main><Footer /></div>;
}
