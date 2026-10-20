import Link from 'next/link';

export function Nav() {
  return (
    <header className="border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight text-lg">ClearSign<span className="text-red-400">.</span></Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/for-tenants" className="text-paper hover:text-red-400">For Tenants</Link>
          <Link href="/for-agents" className="text-paper hover:text-red-400">For Agents</Link>
          <Link href="/pricing" className="text-muted hover:text-paper">Pricing</Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-5 text-sm text-white/60">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>ClearSign · Tenancy clarity</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/for-tenants" className="hover:text-white">Tenant tools</Link>
            <Link href="/for-agents" className="hover:text-white">Agent workspace</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-t border-white/10 pt-4">
          <a href="mailto:clearsign123@gmail.com" className="hover:text-white">Email: clearsign123@gmail.com</a>
          <a href="tel:+447342654703" className="hover:text-white">Phone: +44 7342 654703</a>
        </div>
      </div>
    </footer>
  );
}
