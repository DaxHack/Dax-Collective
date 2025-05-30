// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          {/* Apply white color to Dax and gradient to Collective */}
          <span className="text-black">Dax</span><span className="text-gradient">Collective</span>
        </Link>
        <div className="space-x-4">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/travels" className="nav-link">Travels</Link>
          <Link href="/creates" className="nav-link">Creates</Link>
          <Link href="/tech" className="nav-link">Tech</Link>
          <Link href="/anime" className="nav-link">Anime</Link>
          <Link href="/timezone" className="nav-link">TimeZone</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          {/* Add About and Contact later if needed */}
        </div>
      </nav>
    </header>
  );
}
