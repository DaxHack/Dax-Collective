// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-soft-cream py-8 mt-16">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-4">
          {/* Add social media links here later */}
          <Link href="#" className="mx-2 hover:text-deep-teal">Instagram</Link>
          <Link href="#" className="mx-2 hover:text-deep-teal">YouTube</Link>
          <Link href="#" className="mx-2 hover:text-deep-teal">Twitter</Link>
        </div>
        <div className="mb-4">
          <Link href="/" className="mx-2 hover:text-deep-teal">Home</Link>
          <Link href="/travels" className="mx-2 hover:text-deep-teal">Travels</Link>
          <Link href="/creates" className="mx-2 hover:text-deep-teal">Creates</Link>
          <Link href="/tech" className="mx-2 hover:text-deep-teal">Tech</Link>
          <Link href="/anime" className="mx-2 hover:text-deep-teal">Anime</Link>
          <Link href="/timezone" className="mx-2 hover:text-deep-teal">TimeZone</Link>
          <Link href="/blog" className="mx-2 hover:text-deep-teal">Blog</Link>
        </div>
        <p>&copy; {currentYear} Dax Collective. All rights reserved.</p>
      </div>
    </footer>
  );
}
