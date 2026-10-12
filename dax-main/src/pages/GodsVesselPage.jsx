import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ApprovedMediaGallery from '../components/ApprovedMediaGallery';
import GodsVesselQuotesSection from '../components/GodsVesselQuotes';
import { countSectionPhotos } from '../data/mediaCounts';

const HERO_MOCKUP = '/images/gods-vessel-hero-gen.png';

const serif = { fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' };

const ARCHIVE_ENTRIES = [
  {
    number: '001',
    name: 'Adonai',
    pronunciation: 'ah-doh-NYE',
    meaning: 'Lord, Master',
    scripture: 'Genesis 15:2',
    definition:
      'The sovereign Lord and rightful owner of all. A name of relational reverence and surrender.',
    status: 'Phase 1',
  },
  {
    number: '002',
    name: 'El Shaddai',
    pronunciation: 'el shad-DYE',
    meaning: 'God Almighty',
    scripture: 'Genesis 17:1',
    definition:
      'The all-sufficient, all-powerful God who nourishes and supplies. The covenant name revealed to Abraham.',
    status: 'Phase 1',
  },
  {
    number: '003',
    name: 'Grace',
    pronunciation: 'grays',
    meaning: 'Unmerited Favor',
    scripture: 'Ephesians 2:8',
    definition:
      'The unearned, undeserved love and mercy extended freely. The foundation of the archive — everything begins here.',
    status: 'Coming Soon',
  },
  {
    number: '004',
    name: 'Hope',
    pronunciation: 'hohp',
    meaning: 'Confident Expectation',
    scripture: 'Romans 15:13',
    definition:
      'Not wishful thinking but a sure and certain anchor. The posture of one who knows the end of the story.',
    status: 'Coming Soon',
  },
  {
    number: '005',
    name: 'Faith',
    pronunciation: 'fayth',
    meaning: 'Substance of Things Unseen',
    scripture: 'Hebrews 11:1',
    definition:
      'The evidence of what cannot yet be seen. Faith is the posture, the archive is the reminder.',
    status: 'Coming Soon',
  },
  {
    number: '006',
    name: 'Peace',
    pronunciation: 'pees',
    meaning: 'Shalom — Complete Wholeness',
    scripture: 'Philippians 4:7',
    definition:
      'A peace that transcends understanding. The final entry — rest after the journey.',
    status: 'Coming Soon',
  },
];

const STATUS_STYLES = {
  'Phase 1': 'bg-[#B8956A]/15 text-[#8B6F3D] ring-[#B8956A]/30',
  'Phase 2': 'bg-[#2C2A26]/10 text-[#2C2A26] ring-[#2C2A26]/20',
  'Coming Soon': 'bg-stone-200 text-stone-600 ring-stone-300',
};

const DESIGN_VALUES = [
  {
    title: 'Premium typography',
    body: 'Editorial serifs paired with restrained sans. Built to be read, displayed, and kept.',
  },
  {
    title: 'No cheesy slogans',
    body: 'No clipart, no glitter, no neon crosses. Reverence is in the restraint.',
  },
  {
    title: 'Study to streetwear',
    body: 'Every piece carries scripture, etymology, and meaning — designed to be worn and learned.',
  },
  {
    title: 'Reverent minimalism',
    body: 'Cream, charcoal, muted gold. Strong spacing. Built to last beyond a single drop.',
  },
];

const FEATURED_MERCH = [
  {
    number: '001',
    name: 'Archive Hoodie',
    descriptor: 'Heavyweight 14oz fleece. Garment-dyed. One name, worn as a study.',
    tag: 'Flagship',
    phase: 'Phase 1',
  },
  {
    number: '002',
    name: 'Archive Tee',
    descriptor: 'Ring-spun cotton. Sovereign typography. Built to outlast trends.',
    tag: 'Wardrobe',
    phase: 'Phase 1',
  },
  {
    number: '010',
    name: 'Study Card Set',
    descriptor: 'Six 4×6 archival cards on heavy uncoated stock. Foil-stamped numbering.',
    tag: 'Study',
    phase: 'Phase 1',
  },
  {
    number: '011',
    name: 'Archive Sticker Set',
    descriptor: 'Six peel-and-place marks. The names, carried anywhere.',
    tag: 'Carry',
    phase: 'Phase 1',
  },
];

const SCRIPTURE_POSTS = [
  {
    id: 'sp-001',
    quote: 'Before I formed you in the womb I knew you.',
    reference: 'Jeremiah 1:5',
    devotional:
      'Before the world placed a label on you, the Author already had a name for you. Identity is not discovered — it is recovered.',
    category: 'Identity',
  },
  {
    id: 'sp-002',
    quote: 'The Lord is my shepherd; I shall not want.',
    reference: 'Psalm 23:1',
    devotional:
      'Provision is not a transaction. It is the nature of the shepherd. Want is not a budget problem — it is a proximity problem.',
    category: 'Provision',
  },
  {
    id: 'sp-003',
    quote: 'Fear not, for I am with you; be not dismayed, for I am your God.',
    reference: 'Isaiah 41:10',
    devotional:
      'The command to not fear is always paired with a reason. He does not ask you to be brave alone — He tells you why you can be.',
    category: 'Covenant',
  },
  {
    id: 'sp-004',
    quote: 'He who began a good work in you will carry it to completion.',
    reference: 'Philippians 1:6',
    devotional:
      'An unfinished thing is not an abandoned thing. He does not start and leave. The incompleteness you feel is not the final word.',
    category: 'Promise',
  },
  {
    id: 'sp-005',
    quote: 'If God is for us, who can be against us?',
    reference: 'Romans 8:31',
    devotional:
      'Not rhetorical. An actual question demanding an actual answer. The answer is: no one whose opposition can hold.',
    category: 'Identity',
  },
  {
    id: 'sp-006',
    quote: 'I am the Lord who heals you.',
    reference: 'Exodus 15:26',
    devotional:
      'Healing is not what He does as a favor — it is a name. El Rapha is not His policy. It is who He is.',
    category: 'Healing',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const SectionDivider = () => (
  <div className="mx-auto h-px w-16 bg-[#B8956A]" />
);

const ArchiveCard = ({ entry }) => (
  <motion.article
    variants={fadeUp}
    className="group flex flex-col rounded-none border border-stone-200 bg-[#EDE8DA] p-7 transition hover:border-[#B8956A]/50 hover:shadow-[0_8px_30px_rgba(184,149,106,0.1)]"
  >
    <div className="flex items-start justify-between border-b border-[#D6CEBF] pb-4">
      <div>
        <div className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#B8956A]">
          NO. {entry.number}
        </div>
        <h3
          className="mt-2 text-3xl font-semibold text-[#2C2A26]"
          style={serif}
        >
          {entry.name}
        </h3>
        <p className="mt-1 font-mono text-xs italic text-stone-500">
          /{entry.pronunciation}/
        </p>
      </div>
      <span
        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ${STATUS_STYLES[entry.status]}`}
      >
        {entry.status}
      </span>
    </div>

    <div className="mt-5 space-y-4">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8956A]">
          Meaning
        </div>
        <div className="mt-1 text-sm font-semibold text-[#2C2A26]">{entry.meaning}</div>
      </div>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8956A]">
          Scripture
        </div>
        <div className="mt-1 text-sm font-semibold text-[#2C2A26]">{entry.scripture}</div>
      </div>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8956A]">
          Definition
        </div>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">{entry.definition}</p>
      </div>
    </div>

    <button className="mt-6 inline-flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2A26] transition group-hover:text-[#8B6F3D]">
      Notify me
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </button>
  </motion.article>
);

const MerchCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay: index * 0.07 }}
    whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(184,149,106,0.14)' }}
    className="group flex flex-col border border-stone-200 bg-[#F5F1E8] transition-all duration-300 hover:border-[#B8956A]/50"
  >
    <Link to={`/gods-vessel/merch/${item.number}`} className="relative aspect-[4/3] overflow-hidden bg-[#EDE8DA] flex items-center justify-center">
      <img
        src={`/images/gods-vessel/merch/${item.number}.jpg`}
        alt={item.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-[#2C2A26] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#F5F1E8]">
          {item.tag}
        </span>
      </div>
    </Link>

    <div className="flex flex-1 flex-col p-5">
      <div className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B6F3D]">
        {item.phase}
      </div>
      <h3 className="mt-2 text-xl text-[#2C2A26]" style={serif}>
        {item.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">{item.descriptor}</p>
      <Link
        to={`/gods-vessel/merch/${item.number}`}
        className="mt-5 inline-flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2A26] transition group-hover:text-[#8B6F3D]"
      >
        View &amp; Notify me <ArrowRightIcon className="h-3 w-3" />
      </Link>
    </div>
  </motion.div>
);

const ScriptureCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay: index * 0.06 }}
    className="flex flex-col border border-[#5A5A46] bg-[#3E3E2E] p-7"
  >
    <div className="mb-5 h-px w-8 bg-[#B8956A]" />
    <blockquote
      className="flex-1 text-xl leading-relaxed text-[#E8E2D5] md:text-2xl"
      style={serif}
    >
      &ldquo;{post.quote}&rdquo;
    </blockquote>
    <div className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
      {post.reference}
    </div>
    <p className="mt-3 text-sm leading-relaxed text-[#9A9482]">{post.devotional}</p>
    <div className="mt-5 self-start border border-[#B8956A]/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#B8956A]">
      {post.category}
    </div>
  </motion.div>
);

const GodsVesselPage = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  // Hero form — independent state from the CTA form below
  const [heroEmail, setHeroEmail] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroError, setHeroError] = useState('');
  const [heroLoading, setHeroLoading] = useState(false);

  // Join the Archive CTA form
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ctaError, setCtaError] = useState('');
  const [ctaLoading, setCtaLoading] = useState(false);

  const submitWaitlist = async (emailValue, source) => {
    const res = await fetch(`${API_BASE}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue, source }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    return data;
  };

  const handleHeroWaitlist = async (e) => {
    e.preventDefault();
    if (!heroEmail || heroLoading) return;
    setHeroError('');
    setHeroLoading(true);
    try {
      await submitWaitlist(heroEmail, 'gods-vessel-hero');
      setHeroSubmitted(true);
      setHeroEmail('');
    } catch (err) {
      setHeroError(err.message);
    } finally {
      setHeroLoading(false);
    }
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!email || ctaLoading) return;
    setCtaError('');
    setCtaLoading(true);
    try {
      await submitWaitlist(email, 'gods-vessel-cta');
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setCtaError(err.message);
    } finally {
      setCtaLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>God&rsquo;s Vessel &mdash; Faith. Identity. The Archive.</title>
        <meta
          name="description"
          content="A premium faithwear archive rooted in scripture. The Names of God: Dictionary Series — reverent, educational, collectible. Faith. Identity. The Archive."
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap"
        />
      </Helmet>

      <main
        className="min-h-screen bg-[#F5F1E8] text-[#2C2A26]"
        style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E")`,
        }}
      >

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-stone-200">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7"
            >
              <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                God&rsquo;s Vessel &bull; Archive Collection
              </div>
              <h1
                className="text-5xl leading-[1.05] tracking-tight text-[#2C2A26] md:text-7xl lg:text-8xl"
                style={serif}
              >
                Faith.
                <br />
                <em className="font-medium italic text-[#8B6F3D]">Identity.</em>
                <br />
                The Archive.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
                A premium faithwear archive built around the names of God —
                each piece an act of study. Reverent typography. Scripture-rooted.
                Designed to be worn, read, and kept.
              </p>
              <div className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#8B6F3D]">
                Names of God: The Dictionary Series &mdash; Phase One
              </div>
              <form
                onSubmit={handleHeroWaitlist}
                className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-none border-b border-[#2C2A26] bg-transparent px-1 py-3 text-sm text-[#2C2A26] placeholder:text-stone-400 focus:border-[#8B6F3D] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={heroLoading}
                  className="whitespace-nowrap bg-[#2C2A26] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1E8] transition hover:bg-[#8B6F3D] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {heroLoading ? 'Saving…' : 'Join the Waitlist'}
                </button>
              </form>
              {heroSubmitted && (
                <p className="mt-3 text-xs text-[#8B6F3D]">
                  You&rsquo;re in the archive. We&rsquo;ll be in touch before Phase One drops.
                </p>
              )}
              {heroError && (
                <p className="mt-3 text-xs text-red-600">{heroError}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src={HERO_MOCKUP}
                  onError={(e) => (e.target.style.opacity = 0)}
                  alt="God's Vessel archive mockup"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2C2A26]/10 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 border-l-2 border-[#B8956A] pl-4">
                  <div className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#F5F1E8]">
                    The Dictionary Series
                  </div>
                  <div className="mt-1 text-lg text-[#F5F1E8]" style={serif}>
                    Phase One &bull; Six Names
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. COLLECTION INTRO ─────────────────────────────────────────── */}
        <section className="border-b border-stone-200 bg-[#EFEAD9]">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-12">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
              The Collection
            </div>
            <h2 className="mt-6 text-4xl leading-tight text-[#2C2A26] md:text-5xl" style={serif}>
              An archive of names.
              <br />
              A study of the Divine.
            </h2>
            <div className="mt-8 flex justify-center">
              <SectionDivider />
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
              The Names of God: Dictionary Series treats every name as an entry in a
              living archive. Each piece carries its number, its pronunciation, its
              meaning, and the scripture it lives in. This is not merch &mdash; it is
              wearable study.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 text-left md:grid-cols-4">
              {['Reverent', 'Educational', 'Premium', 'Collectible'].map((label, i) => (
                <div key={label} className="border-l-2 border-[#B8956A] pl-4">
                  <div className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#8B6F3D]">
                    Principle 0{i + 1}
                  </div>
                  <div className="mt-2 text-lg text-[#2C2A26]" style={serif}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. FEATURED MERCH COLLECTION ────────────────────────────────── */}
        <section className="border-b border-stone-200 bg-[#F5F1E8]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                  The Collection
                </div>
                <h2 className="mt-4 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                  Featured Merch.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-stone-500">
                Each piece in Phase One is numbered, scripture-referenced, and built to be kept. Notify me links activate when a drop is confirmed.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_MERCH.map((item, i) => (
                <MerchCard key={item.number} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. ARCHIVE PRODUCT CARDS (Dictionary Series) ─────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                The Archive
              </div>
              <div className="mt-4 flex items-center gap-3">
                <h2 className="text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                  Phase One &bull; Six Entries
                </h2>
                <span className="text-xs font-medium text-[#8B6F3D] bg-[#F5F1E8] px-2.5 py-1 rounded-full border border-[#E5E0D4]">
                  {(() => {
                    const c = countSectionPhotos("God's Vessel", 'Names of God: The Dictionary Series');
                    return `${c} ${c === 1 ? 'photo' : 'photos'}`;
                  })()}
                </span>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-stone-600">
              The first six names form the foundation of the series. Each entry is a
              limited release &mdash; numbered, scripture-referenced, and built to be kept.
            </p>
          </div>

          <ApprovedMediaGallery brand="God's Vessel" section="Names of God: The Dictionary Series" />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.07 }}
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {ARCHIVE_ENTRIES.map((e) => (
              <ArchiveCard key={e.number} entry={e} />
            ))}
          </motion.div>
        </section>

        {/* ── 5. PRODUCT DROP PREVIEW ──────────────────────────────────────── */}
        <section className="bg-[#1A1917]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-12"
          >
            {/* Large typographic archive number — high visual weight */}
            <div
              className="select-none font-mono text-[8rem] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[11rem] md:text-[14rem]"
              aria-hidden="true"
            >
              001
            </div>
            <div className="-mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8956A]">
              Upcoming Drop
            </div>
            <div className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#6B6860]">
              Archive NO. 001
            </div>
            <h2
              className="mt-3 text-5xl font-medium leading-tight text-[#E8E2D5] md:text-6xl lg:text-7xl"
              style={serif}
            >
              El Shaddai
              <br />
              <em className="text-[#B8956A]">Archive Hoodie</em>
            </h2>
            <div className="mx-auto mt-8 h-px w-20 bg-[#B8956A]" />
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-[#9A9482]">
              The first name in the archive. The first garment in the collection.
              Heavyweight fleece. Garment-dyed. The name God chose when He spoke to Abraham
              at 99 years old &mdash; carried in full, on your back.
            </p>
            <div className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B6860]">
              Phase One &bull; Dropping Soon
            </div>
            {/* TODO: add drop date or countdown when confirmed */}
            <div className="mt-10">
              <button
                onClick={() => {
                  const form = document.getElementById('gv-waitlist-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-[#B8956A]/60 px-8 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#B8956A] transition hover:bg-[#B8956A]/10"
              >
                Notify Me
              </button>
            </div>
          </motion.div>
        </section>

        {/* ── 6. STUDY CARD / STICKER SET TEASER ──────────────────────────── */}
        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-12">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                Companion Set
              </div>
              <h2 className="mt-4 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                The Study Cards.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-stone-600 md:text-lg">
                A six-card archival set &mdash; one card per name &mdash; printed on heavy
                uncoated stock with foil-stamped numbering. A pocket-sized study
                companion to the wearable archive.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-stone-600">
                {[
                  'Six 4x6 cards, archival paper',
                  'Foil-stamped numbering and name',
                  'Companion sticker set included',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-l-2 border-[#B8956A] pl-4">
                    <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-[#8B6F3D]">
                      0{i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/5] overflow-hidden ring-1 ring-stone-200">
              <img
                src="/images/gods-vessel/study-cards.jpg"
                alt="God's Vessel Study Card Set"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── 7. HOODIE TEASER ──────────────────────────────────────────────── */}
        <section className="bg-[#2C2A26] text-[#F5F1E8]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-12">
            <div className="aspect-square overflow-hidden ring-1 ring-white/10 lg:order-2">
              <img
                src="/images/gods-vessel/hoodie-archive-001.jpg"
                alt="El Shaddai Archive Hoodie No. 001"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="lg:order-1">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8956A]">
                Flagship Piece
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl" style={serif}>
                The Archive Hoodie.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-stone-300 md:text-lg">
                Heavyweight 14oz cotton fleece. Garment-dyed in stone, charcoal, and
                cream. Each hoodie carries a single name, its pronunciation, scripture
                reference, and archive number &mdash; quietly placed, made to be studied.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 text-sm">
                {[
                  { label: 'Weight', value: '14oz fleece' },
                  { label: 'Construction', value: 'Garment-dyed' },
                  { label: 'Edition', value: 'Numbered' },
                ].map((spec) => (
                  <div key={spec.label}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#B8956A]">
                      {spec.label}
                    </div>
                    <div className="mt-1 text-[#F5F1E8]">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. EMAIL / COMMUNITY CTA ──────────────────────────────────────── */}
        <section id="gv-waitlist-form" className="bg-[#F5F1E8]">
          <div className="mx-auto max-w-4xl px-6 py-24 lg:px-12">
            <div className="text-center">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                Join the Archive
              </div>
              <h2 className="mt-6 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                Membership is free.
                <br />
                <em className="text-[#8B6F3D]">Access is earned.</em>
              </h2>
              <div className="mt-8 flex justify-center">
                <SectionDivider />
              </div>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
                Archive members receive first access to every drop, the digital study guide
                for each name, and behind-the-design notes before each release.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: 'Early Access', body: 'First in line for every Phase One drop — before public release.' },
                { label: 'Study Guides', body: 'A digital study guide for each name: etymology, scripture thread, and usage notes.' },
                { label: 'Design Notes', body: 'Behind-the-design entries on typography, material choices, and print decisions.' },
              ].map((benefit) => (
                <div key={benefit.label} className="border-l-2 border-[#B8956A] pl-5">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B6F3D]">
                    {benefit.label}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{benefit.body}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleWaitlist}
              className="mx-auto mt-12 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-none border-b border-[#2C2A26] bg-transparent px-1 py-3 text-sm text-[#2C2A26] placeholder:text-stone-400 focus:border-[#8B6F3D] focus:outline-none"
              />
              <button
                type="submit"
                disabled={ctaLoading}
                className="whitespace-nowrap bg-[#2C2A26] px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1E8] transition hover:bg-[#8B6F3D] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {ctaLoading ? 'Saving…' : 'Join the Archive'}
              </button>
            </form>
            {submitted && (
              <p className="mt-4 text-center text-xs text-[#8B6F3D]">
                You&rsquo;re in the archive. We&rsquo;ll be in touch before Phase One drops.
              </p>
            )}
            {ctaError && (
              <p className="mt-4 text-center text-xs text-red-600">{ctaError}</p>
            )}
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </section>

        {/* ── 9. DESIGN VALUES ──────────────────────────────────────────────── */}
        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                Design Values
              </div>
              <h2 className="mt-6 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                What this brand is, and isn&rsquo;t.
              </h2>
              <div className="mt-8 flex justify-center">
                <SectionDivider />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {DESIGN_VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-t border-stone-200 pt-8"
                >
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B6F3D]">
                    Value 0{i + 1}
                  </div>
                  <h3 className="mt-3 text-2xl text-[#2C2A26]" style={serif}>
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{v.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. SCRIPTURE POST PREVIEW ────────────────────────────────────── */}
        <section className="border-t border-stone-200 bg-[#4A4A38]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
            <div className="mb-14 text-center">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8956A]">
                From the Archive
              </div>
              <h2 className="mt-6 text-4xl text-[#E8E2D5] md:text-5xl" style={serif}>
                Words that hold.
              </h2>
              <div className="mx-auto mt-8 h-px w-16 bg-[#B8956A]" />
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#9A9482]">
                Six passages. Six categories. Each one a thread the archive is built around.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SCRIPTURE_POSTS.map((post, i) => (
                <ScriptureCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. DAILY DEVOTIONAL ──────────────────────────────────────────── */}
        <section className="border-t border-stone-200 bg-[#EFEAD9]">
          <div className="mx-auto max-w-3xl px-6 py-24 lg:px-12">
            <div className="text-center">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                The Word
              </div>
              <h2 className="mt-4 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                Today&rsquo;s Word.
              </h2>
              <div className="mx-auto mt-6 h-px w-16 bg-[#B8956A]" />
            </div>
            <div className="mt-10">
              {/* showTitle={true}: "Scripture • Daily" editorial label appears above the rotating quote card,
                creating a two-level hierarchy beneath "Today's Word." — intentional editorial layering */}
            <GodsVesselQuotesSection showTitle={true} maxQuotes={3} />
            </div>
          </div>
        </section>

        {/* ── 12. SCRIPTURE THREADS ─────────────────────────────────────────── */}
        <section className="border-t border-stone-200 bg-[#EFEAD9]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                Scripture Threads
              </div>
              <h2 className="mt-6 text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                One name. Every reference.
              </h2>
              <div className="mt-8 flex justify-center">
                <SectionDivider />
              </div>
              <p className="mt-8 text-base leading-relaxed text-stone-600 md:text-lg">
                Each name of God is a thread woven through the full canon of scripture.
                These are not isolated verses &mdash; they are recurring covenants, each one
                deepening as the story progresses.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'El Shaddai',
                  thread: 'Genesis 17:1 \u2192 Ruth 1:20 \u2192 Job 5:17 \u2192 Psalm 91:1',
                  note: 'From covenant to lament to refuge. The same name, a different weight each time.',
                },
                {
                  name: 'Adonai',
                  thread: 'Genesis 15:2 \u2192 Isaiah 6:1 \u2192 Psalm 110:1 \u2192 Revelation 19:16',
                  note: "Sovereignty that spans from Abraham's prayer to John's vision.",
                },
                {
                  name: 'Elohim',
                  thread: 'Genesis 1:1 \u2192 John 1:1 \u2192 Colossians 1:16',
                  note: 'The Creator present at the beginning \u2014 and identified again in the New Testament.',
                },
                {
                  name: 'Yahweh',
                  thread: 'Exodus 3:14 \u2192 Isaiah 42:8 \u2192 John 8:58',
                  note: '"I AM" \u2014 the same name Moses heard, the same one Jesus used in the temple courts.',
                },
                {
                  name: 'Jehovah Jireh',
                  thread: 'Genesis 22:14 \u2192 Philippians 4:19',
                  note: 'Named on Moriah. Echoed by Paul centuries later from a prison cell.',
                },
                {
                  name: 'El Roi',
                  thread: 'Genesis 16:13 \u2192 Psalm 139:1\u20133 \u2192 Luke 15:20',
                  note: 'Hagar saw it in the wilderness. The Psalmist knew it from birth. The father ran toward it.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-none border border-stone-200 bg-white p-6"
                >
                  <div className="text-2xl font-semibold text-[#2C2A26]" style={serif}>
                    {item.name}
                  </div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#B8956A]">
                    Thread
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">{item.thread}</p>
                  <div className="mt-4 border-t border-stone-100 pt-4">
                    <p className="text-sm leading-relaxed italic text-stone-500">{item.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 13. ARCHIVE NOTES ─────────────────────────────────────────────── */}
        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B6F3D]">
                Archive Notes
              </div>
              <div className="flex items-center justify-center gap-3 mt-4">
                <h2 className="text-4xl text-[#2C2A26] md:text-5xl" style={serif}>
                  Behind the design decisions.
                </h2>
                <span className="text-xs font-medium text-[#8B6F3D] bg-[#F5F1E8] px-2.5 py-1 rounded-full border border-[#E5E0D4]">
                  {(() => {
                    const c = countSectionPhotos("God's Vessel", 'Archive Notes');
                    return `${c} ${c === 1 ? 'photo' : 'photos'}`;
                  })()}
                </span>
              </div>
              <ApprovedMediaGallery brand="God's Vessel" section="Archive Notes" />
              <div className="mt-8 flex justify-center">
                <SectionDivider />
              </div>
            </div>
            <div className="mx-auto max-w-4xl space-y-10">
              {[
                {
                  number: '01',
                  title: 'Why we use the original Hebrew names',
                  body: "The English translation of God's names \u2014 \"God Almighty,\" \"The Lord\" \u2014 are accurate but carry no etymological weight on their own. The Hebrew names are not replacements; they are the roots. When you wear El Shaddai, you are wearing the name God chose when he spoke to Abraham at 99 years old. That is specific. That is what the archive is built on.",
                },
                {
                  number: '02',
                  title: 'Why each piece carries the pronunciation',
                  body: 'We want the wearer to know how to say it. There is something important about a name you can say aloud \u2014 it becomes a prayer, a recitation, a study prompt. The pronunciation is not decorative. It is functional.',
                },
                {
                  number: '03',
                  title: 'Why we are starting with six names and not twenty',
                  body: 'The archive is built to be owned \u2014 not consumed. Six entries per phase means each name gets proper space: its own design, its own drop, its own study guide. Releasing 30 names at once would treat the archive like a catalog. We are building it like a library.',
                },
              ].map((note) => (
                <div key={note.number} className="flex gap-8 border-t border-stone-100 pt-8">
                  <div className="shrink-0 pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B6F3D]">
                    {note.number}
                  </div>
                  <div>
                    <h3 className="text-xl text-[#2C2A26]" style={serif}>
                      {note.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-stone-600">{note.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer accent ─────────────────────────────────────────────────── */}
        <div className="border-t border-stone-200 bg-[#F5F1E8] py-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400">
            God&rsquo;s Vessel &bull; The Dictionary Series &bull; Archive Collection
          </p>
        </div>

      </main>
    </>
  );
};

export default GodsVesselPage;
