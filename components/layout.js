import Link from 'next/link';

export function Nav() {
  return (
    <header className="border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">ClearSign</Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/agents">For Agents</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-white/60">
        ClearSign
      </div>
    </footer>
  );
}
