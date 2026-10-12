import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import NotFoundPage from './NotFoundPage';
import { joinWaitlist, isWaitlistAvailable, WAITLIST_UNAVAILABLE_MESSAGE } from '../services/waitlistApi';

const serif = { fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' };


const PRODUCTS = {
  '001': {
    number: '001',
    name: 'Archive Hoodie',
    subtitle: 'El Shaddai — Archive No. 001',
    tag: 'Flagship',
    phase: 'Phase 1',
    descriptor: 'Heavyweight 14oz fleece. Garment-dyed. One name, worn as a study.',
    image: '/images/gods-vessel/merch/001.jpg',
    archiveName: 'El Shaddai',
    pronunciation: 'el shad-DYE',
    meaning: 'God Almighty — The All-Sufficient One',
    scripture: {
      reference: 'Genesis 17:1',
      text: 'I am El Shaddai — walk before me faithfully and be blameless.',
    },
    etymology:
      'Derived from the Hebrew root "Shaddai," most likely from "shad" (breast, nourisher) combined with the intensifying suffix, conveying both overwhelming power and tender sufficiency. God introduced Himself by this name to Abraham at 99 years old — a name of covenant, abundance, and uncontainable provision.',
    designRationale:
      'The name is typeset in our editorial serif at chest height — large enough to read, restrained enough to not perform. The pronunciation sits beneath in mono, the archive number runs along the hem. Nothing decorative. Everything earned.',
    specs: [
      { label: 'Weight', value: '14oz cotton fleece' },
      { label: 'Construction', value: 'Garment-dyed' },
      { label: 'Fit', value: 'Relaxed / oversized' },
      { label: 'Edition', value: 'Numbered — Phase 1' },
      { label: 'Colors', value: 'Stone, Charcoal, Cream' },
      { label: 'Print', value: 'Screen-printed, interior seam labeling' },
    ],
    waitlistSource: 'gods-vessel-merch-hoodie',
  },
  '002': {
    number: '002',
    name: 'Archive Tee',
    subtitle: 'Adonai — Archive No. 002',
    tag: 'Wardrobe',
    phase: 'Phase 1',
    descriptor: 'Ring-spun cotton. Sovereign typography. Built to outlast trends.',
    image: '/images/gods-vessel/merch/002.jpg',
    archiveName: 'Adonai',
    pronunciation: 'ah-doh-NYE',
    meaning: 'Lord, Master — The Sovereign One',
    scripture: {
      reference: 'Genesis 15:2',
      text: 'But Abram said, "Sovereign Lord (Adonai), what can you give me since I remain childless…"',
    },
    etymology:
      'Adonai is the plural of "Adon" (lord, master), used as a title of reverent address. In Jewish tradition, it became the spoken substitute for the unutterable name YHWH — a mark of such reverence that the name itself was protected by a proxy. To wear Adonai is to carry the weight of that reverence.',
    designRationale:
      'A wardrobe piece, not a statement piece. The name runs across the chest in a clean editorial serif — understated at a glance, legible up close. The archive number is embroidered at the cuff. Built to be worn daily, not displayed once.',
    specs: [
      { label: 'Fabric', value: '100% ring-spun cotton' },
      { label: 'Weight', value: '6.5oz' },
      { label: 'Fit', value: 'Regular / slightly relaxed' },
      { label: 'Edition', value: 'Numbered — Phase 1' },
      { label: 'Colors', value: 'Off-white, Washed Black, Stone' },
      { label: 'Print', value: 'Water-based screen print' },
    ],
    waitlistSource: 'gods-vessel-merch-tee',
  },
  '010': {
    number: '010',
    name: 'Study Card Set',
    subtitle: 'Six Names — Archival Card Collection',
    tag: 'Study',
    phase: 'Phase 1',
    descriptor: 'Six 4×6 archival cards on heavy uncoated stock. Foil-stamped numbering.',
    image: '/images/gods-vessel/merch/010.jpg',
    archiveName: 'The Dictionary Series',
    pronunciation: null,
    meaning: 'Six names. Six definitions. One archive.',
    scripture: {
      reference: 'Psalm 9:10',
      text: 'Those who know your name trust in you, for you, Lord, have never forsaken those who seek you.',
    },
    etymology:
      'Each card in the set carries a single name: its archive number, original language rendering, phonetic pronunciation, etymological root, scripture reference, and a devotional note. The set is designed as a study companion — not a collector\'s item alone, but a daily reference built to be handled, marked, and returned to.',
    designRationale:
      'Printed on 130lb uncoated archival stock — the kind that ages well and feels intentional. Foil-stamped numbers on the front. The typography system matches the garments exactly: same serif, same mono, same hierarchy. The cards are a pocket-sized mirror of the archive.',
    specs: [
      { label: 'Count', value: '6 cards (one per name)' },
      { label: 'Size', value: '4 × 6 inches' },
      { label: 'Stock', value: '130lb uncoated archival' },
      { label: 'Finish', value: 'Foil-stamped numbering' },
      { label: 'Packaging', value: 'Kraft sleeve with seal' },
      { label: 'Edition', value: 'Phase 1 — limited print run' },
    ],
    waitlistSource: 'gods-vessel-merch-study-cards',
  },
  '011': {
    number: '011',
    name: 'Archive Sticker Set',
    subtitle: 'Six Names — Peel-and-Place Marks',
    tag: 'Carry',
    phase: 'Phase 1',
    descriptor: 'Six peel-and-place marks. The names, carried anywhere.',
    image: '/images/gods-vessel/merch/011.jpg',
    archiveName: 'The Names',
    pronunciation: null,
    meaning: 'Every surface becomes a study.',
    scripture: {
      reference: 'Deuteronomy 6:9',
      text: 'Write them on the doorframes of your houses and on your gates.',
    },
    etymology:
      'The command in Deuteronomy 6 — to fix the words on doorframes, gates, and hands — gave rise to the mezuzah and the tefillin. The Archive Sticker Set carries that same impulse into modern surfaces. Each sticker is a mark: a name placed deliberately in the spaces you inhabit.',
    designRationale:
      'Die-cut to shape, matte-finish vinyl. Each sticker carries the archive number, the name in editorial serif, and the phonetic pronunciation in mono. Weather-resistant. Designed to survive a water bottle, a laptop, a journal cover. Not precious — purposeful.',
    specs: [
      { label: 'Count', value: '6 stickers (one per name)' },
      { label: 'Material', value: 'Matte-finish vinyl' },
      { label: 'Cut', value: 'Die-cut to shape' },
      { label: 'Durability', value: 'Weather-resistant, UV-stable' },
      { label: 'Adhesive', value: 'Repositionable, residue-free' },
      { label: 'Packaging', value: 'Glassine envelope, branded seal' },
    ],
    waitlistSource: 'gods-vessel-merch-sticker-set',
  },
};

const WaitlistForm = ({ source }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isWaitlistAvailable || !email || loading) return;
    setError('');
    setLoading(true);
    try {
      // Resolves only when the backend confirms the sign-up.
      await joinWaitlist(email, source);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="border-l-2 border-[#B8956A] pl-5 py-2">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6F3D]">
          You&rsquo;re in the archive.
        </p>
        <p className="mt-1 text-sm text-stone-500">
          We&rsquo;ll reach out before this piece drops.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        disabled={!isWaitlistAvailable}
        aria-label="Email address"
        className="flex-1 rounded-none border-b border-[#2C2A26] bg-transparent px-1 py-3 text-sm text-[#2C2A26] placeholder:text-stone-400 focus:border-[#8B6F3D] focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !isWaitlistAvailable}
        className="whitespace-nowrap bg-[#2C2A26] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1E8] transition hover:bg-[#8B6F3D] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {!isWaitlistAvailable ? 'Opening Soon' : loading ? 'Saving…' : 'Notify Me'}
      </button>
      {!isWaitlistAvailable && (
        <p role="status" className="w-full text-xs text-stone-500 mt-1">{WAITLIST_UNAVAILABLE_MESSAGE}</p>
      )}
      {error && (
        <p className="w-full text-xs text-red-600 mt-1">{error}</p>
      )}
    </form>
  );
};

const GodsVesselMerchPage = () => {
  const { id } = useParams();
  const product = PRODUCTS[id];

  if (!product) return <NotFoundPage />;

  const otherProducts = Object.values(PRODUCTS).filter((p) => p.number !== id);

  return (
    <>
      <Helmet>
        <title>{product.name} — God&rsquo;s Vessel Archive</title>
        <meta
          name="description"
          content={`${product.name}: ${product.descriptor} — God's Vessel Archive Collection, Phase 1.`}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap"
        />
      </Helmet>

      <div
        className="min-h-screen bg-[#F5F1E8] text-[#2C2A26]"
        style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E")`,
        }}
      >

        {/* ── BREADCRUMB ─────────────────────────────────────────────────── */}
        <div className="border-b border-stone-200 bg-[#EFEAD9]">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-12">
            <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
              <Link
                to="/gods-vessel"
                className="flex items-center gap-1.5 text-[#8B6F3D] transition hover:text-[#2C2A26]"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                God&rsquo;s Vessel
              </Link>
              <span>/</span>
              <span>Merch</span>
              <span>/</span>
              <span className="text-[#2C2A26]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── HERO — PRODUCT IMAGE + CORE INFO ──────────────────────────── */}
        <section className="border-b border-stone-200">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-2">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative aspect-square overflow-hidden bg-[#EDE8DA] lg:aspect-auto lg:min-h-[600px]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-5 left-5">
                <span className="bg-[#2C2A26] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#F5F1E8]">
                  {product.tag}
                </span>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col justify-center px-8 py-16 lg:px-16"
            >
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B6F3D]">
                Archive No. {product.number} &bull; {product.phase}
              </div>
              <h1
                className="mt-4 text-4xl leading-tight text-[#2C2A26] md:text-5xl lg:text-6xl"
                style={serif}
              >
                {product.name}
              </h1>
              {product.archiveName && (
                <div className="mt-2 text-lg text-[#8B6F3D]" style={serif}>
                  {product.archiveName}
                  {product.pronunciation && (
                    <span className="ml-2 font-mono text-sm font-normal italic text-stone-400">
                      /{product.pronunciation}/
                    </span>
                  )}
                </div>
              )}
              <p className="mt-6 text-base leading-relaxed text-stone-600">
                {product.descriptor}
              </p>

              <div className="mt-8 h-px w-12 bg-[#B8956A]" />

              {/* Scripture */}
              <div className="mt-8 border-l-2 border-[#B8956A] pl-5">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B6F3D]">
                  Scripture
                </div>
                <blockquote className="mt-2 text-sm leading-relaxed text-stone-600 italic" style={serif}>
                  &ldquo;{product.scripture.text}&rdquo;
                </blockquote>
                <div className="mt-1 font-mono text-[10px] text-stone-400">
                  {product.scripture.reference}
                </div>
              </div>

              {/* Waitlist CTA */}
              <div className="mt-10">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B6F3D] mb-4">
                  Notify Me When This Drops
                </div>
                <WaitlistForm source={product.waitlistSource} />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
                  No spam. First access before public release.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PRODUCT SPECS ──────────────────────────────────────────────── */}
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
            <div className="mb-12">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                Specifications
              </div>
              <h2 className="mt-4 text-3xl text-[#2C2A26] md:text-4xl" style={serif}>
                What it is made of.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {product.specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-t-2 border-[#B8956A] pt-4"
                >
                  <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8B6F3D]">
                    {spec.label}
                  </div>
                  <div className="mt-2 text-sm text-[#2C2A26]">{spec.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ETYMOLOGY + DESIGN RATIONALE ──────────────────────────────── */}
        <section className="border-b border-stone-200 bg-[#F5F1E8]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

              {/* Etymology */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                  Etymology
                </div>
                <h2 className="mt-4 text-3xl text-[#2C2A26] md:text-4xl" style={serif}>
                  The name behind the piece.
                </h2>
                <div className="mt-8 h-px w-12 bg-[#B8956A]" />
                <p className="mt-8 text-base leading-relaxed text-stone-600">
                  {product.etymology}
                </p>
                {product.pronunciation && (
                  <div className="mt-8 inline-block border border-[#D6CEBF] bg-[#EDE8DA] px-5 py-4">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B6F3D]">
                      Pronunciation
                    </div>
                    <div className="mt-2 font-mono text-lg text-[#2C2A26]">
                      /{product.pronunciation}/
                    </div>
                    <div className="mt-1 text-sm text-stone-500" style={serif}>
                      {product.meaning}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Design Rationale */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                  Design Rationale
                </div>
                <h2 className="mt-4 text-3xl text-[#2C2A26] md:text-4xl" style={serif}>
                  Why it looks the way it does.
                </h2>
                <div className="mt-8 h-px w-12 bg-[#B8956A]" />
                <p className="mt-8 text-base leading-relaxed text-stone-600">
                  {product.designRationale}
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    'No clipart. No cheesy slogans.',
                    'Typography that earns its placement.',
                    'Built to be worn and re-worn.',
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8956A]" />
                      <span className="text-sm text-stone-600">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FULL SCRIPTURE CONTEXT ─────────────────────────────────────── */}
        <section className="bg-[#2C2A26] text-[#F5F1E8]">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-12">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8956A]">
              Scripture Context
            </div>
            <div className="mx-auto mt-10 h-px w-12 bg-[#B8956A]" />
            <blockquote
              className="mt-10 text-3xl leading-relaxed text-[#E8E2D5] md:text-4xl lg:text-5xl"
              style={serif}
            >
              &ldquo;{product.scripture.text}&rdquo;
            </blockquote>
            <div className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#B8956A]">
              {product.scripture.reference}
            </div>
          </div>
        </section>

        {/* ── WAITLIST CTA ───────────────────────────────────────────────── */}
        <section className="border-b border-stone-200 bg-[#EFEAD9]">
          <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-12">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
              First Access
            </div>
            <h2 className="mt-6 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
              Notify me when
              <br />
              <em className="text-[#8B6F3D]">{product.name} drops.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-stone-600">
              Archive members receive first access before public release, plus the digital study
              guide for the name this piece carries.
            </p>
            <div className="mx-auto mt-10 max-w-md">
              <WaitlistForm source={`${product.waitlistSource}-cta`} />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </section>

        {/* ── OTHER PIECES ───────────────────────────────────────────────── */}
        <section className="bg-[#F5F1E8]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                  The Collection
                </div>
                <h2 className="mt-4 text-3xl text-[#2C2A26] md:text-4xl" style={serif}>
                  More from Phase One.
                </h2>
              </div>
              <Link
                to="/gods-vessel"
                className="hidden items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2C2A26] transition hover:text-[#8B6F3D] sm:flex"
              >
                View all <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProducts.map((p, i) => (
                <motion.div
                  key={p.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                >
                  <Link
                    to={`/gods-vessel/merch/${p.number}`}
                    className="group flex flex-col border border-stone-200 bg-[#F5F1E8] transition-all duration-300 hover:border-[#B8956A]/50 hover:shadow-[0_12px_36px_rgba(184,149,106,0.14)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8DA]">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#2C2A26] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F1E8]">
                          {p.tag}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B6F3D]">
                        {p.phase}
                      </div>
                      <h3 className="mt-2 text-xl text-[#2C2A26]" style={serif}>
                        {p.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                        {p.descriptor}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2A26] transition group-hover:text-[#8B6F3D]">
                        View product <ArrowRightIcon className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link
                to="/gods-vessel"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2C2A26] transition hover:text-[#8B6F3D]"
              >
                View all pieces <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer accent ──────────────────────────────────────────────── */}
        <div className="border-t border-stone-200 bg-[#F5F1E8] py-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400">
            God&rsquo;s Vessel &bull; The Dictionary Series &bull; Archive No. {product.number}
          </p>
        </div>

      </div>
    </>
  );
};

export default GodsVesselMerchPage;
