import React, { useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Layers3 } from 'lucide-react';
import GodsVesselQuotesSection from '../../../components/GodsVesselQuotes';
import './VesselWorldPage.css';

const products = [
  {
    id: '001',
    name: 'Archive Hoodie',
    title: 'El Shaddai',
    kind: 'THE FLAGSHIP GARMENT',
    image: '/images/gods-vessel/merch/001.jpg',
    note: 'Heavyweight fleece. One name, carried as a study.',
    link: '/gods-vessel/merch/001',
  },
  {
    id: '002',
    name: 'Archive Tee',
    title: 'Adonai',
    kind: 'THE EVERYDAY STUDY',
    image: '/images/gods-vessel/merch/002.jpg',
    note: 'Sovereign typography, placed with restraint.',
    link: '/gods-vessel/merch/002',
  },
  {
    id: '010',
    name: 'Study Card Set',
    title: 'Six names. One archive.',
    kind: 'THE COMPANION SET',
    image: '/images/gods-vessel/merch/010.jpg',
    note: 'A pocket-sized invitation to return to the text.',
    link: '/gods-vessel/merch/010',
  },
  {
    id: '011',
    name: 'Archive Sticker Set',
    title: 'Names, carried.',
    kind: 'THE CARRY SET',
    image: '/images/gods-vessel/merch/011.jpg',
    note: 'Six marks from the Names of God collection.',
    link: '/gods-vessel/merch/011',
  },
];

const names = [
  { no: '01', name: 'Adonai', sound: 'ah-doh-NYE', meaning: 'Lord, Master', text: 'A name of relational reverence and surrender.', verse: 'Genesis 15:2', phase: 'PHASE ONE' },
  { no: '02', name: 'El Shaddai', sound: 'el shad-DYE', meaning: 'God Almighty', text: 'The all-sufficient, all-powerful God who nourishes and supplies.', verse: 'Genesis 17:1', phase: 'PHASE ONE' },
  { no: '03', name: 'Grace', sound: 'grays', meaning: 'Unmerited Favor', text: 'The foundation of the archive — everything begins here.', verse: 'Ephesians 2:8', phase: 'ARCHIVE ENTRY' },
  { no: '04', name: 'Hope', sound: 'hohp', meaning: 'Confident Expectation', text: 'A sure and certain anchor; the posture of one who knows the end.', verse: 'Romans 15:13', phase: 'ARCHIVE ENTRY' },
  { no: '05', name: 'Faith', sound: 'fayth', meaning: 'Substance of Things Unseen', text: 'The evidence of what cannot yet be seen.', verse: 'Hebrews 11:1', phase: 'ARCHIVE ENTRY' },
  { no: '06', name: 'Peace', sound: 'pees', meaning: 'Shalom — Complete Wholeness', text: 'A peace that transcends understanding.', verse: 'Philippians 4:7', phase: 'ARCHIVE ENTRY' },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
};

function VesselWorldPage() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeName, setActiveName] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroParallax = useTransform(heroProgress, [0, 1], [0, 54]);
  const product = products[activeProduct];
  const motionProps = useMemo(() => reduceMotion
    ? { initial: false, whileInView: undefined, animate: undefined }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' }, variants: reveal }, [reduceMotion]);

  const selectProduct = (index) => {
    setImageFailed(false);
    setActiveProduct((index + products.length) % products.length);
  };

  return (
    <>
      <Helmet>
        <title>God’s Vessel — Faith. Identity. The Archive.</title>
        <meta name="description" content="A scripture-rooted faithwear archive. Names of God, designed to be worn, read, and kept." />
      </Helmet>
      <main className="gv2-world">
        <section className="gv2-hero" aria-labelledby="gv2-title" ref={heroRef}>
          <div className="gv2-hero-grain" aria-hidden="true" />
          <div className="gv2-hero-meta"><span>DAx COLLECTIVE / WORLD 02</span><span>FAITHWEAR · ARCHIVE</span></div>
          <div className="gv2-hero-copy">
            <motion.div {...(reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } })}>
              <p className="gv2-kicker"><i /> A study in what we carry</p>
              <h1 id="gv2-title">Faith.<br /><em>Identity.</em><br /><span>The Archive.</span></h1>
              <p className="gv2-hero-deck">Names of God: The Dictionary Series.<br />Scripture-rooted pieces, made to be worn, read, and kept.</p>
              <a className="gv2-text-link" href="#gv2-collection">Enter the archive <ArrowDown size={15} strokeWidth={1.5} /></a>
            </motion.div>
            <motion.div className="gv2-hero-art" style={{ y: reduceMotion ? 0 : heroParallax }} aria-label="Concept presentation of Archive Hoodie, not a 3D product preview">
              <div className="gv2-hero-index">COLLECTION / 001—006</div>
              <div className="gv2-hero-image-wrap">
                <img src="/assets/approved-media/gods-vessel/hoodie-el-shaddai-front.png" alt="God’s Vessel El Shaddai hoodie concept artwork" />
                <div className="gv2-image-label">CONCEPT ARTWORK <span>·</span> PHASE ONE</div>
              </div>
              <div className="gv2-hero-caption"><span>EL SHADDAI</span><span>THE ALL-SUFFICIENT ONE</span></div>
              <div className="gv2-orbit gv2-orbit-a" /><div className="gv2-orbit gv2-orbit-b" />
            </motion.div>
          </div>
          <div className="gv2-hero-foot"><span>01 — 04</span><span>SCROLL TO EXPLORE</span><span>EST. IN REVERENCE</span></div>
        </section>

        <section className="gv2-thesis" id="gv2-collection">
          <div className="gv2-thesis-side"><span>THE IDEA</span><span>01 / 04</span></div>
          <motion.div className="gv2-thesis-main" {...motionProps}>
            <p className="gv2-kicker gv2-kicker-dark"><i /> Not just something to wear</p>
            <h2>A name can be<br />a <em>place to return.</em></h2>
            <div className="gv2-thesis-bottom">
              <p>The Dictionary Series treats each name as an entry in a living archive. Its meaning, pronunciation, and scripture belong together — brought into everyday life without spectacle.</p>
              <div className="gv2-thesis-stamp"><BookOpen size={21} strokeWidth={1.2} /><span>STUDY<br />TO STREET</span></div>
            </div>
          </motion.div>
          <div className="gv2-thesis-number" aria-hidden="true">GV</div>
        </section>

        <section className="gv2-object-section" aria-label="Explore the collection">
          <div className="gv2-object-heading">
            <div><p className="gv2-kicker gv2-kicker-dark"><i /> The collection / phase one</p><h2>Objects of <em>meaning.</em></h2></div>
            <p>Four pieces from the archive.<br />Select an object to examine its concept artwork.</p>
          </div>
          <div className="gv2-object-layout">
            <div className="gv2-object-index">
              <span className="gv2-mono-label">SELECT AN ENTRY</span>
              <div className="gv2-product-list" role="tablist" aria-label="Collection objects">
                {products.map((item, index) => (
                  <button type="button" role="tab" aria-selected={activeProduct === index} className={`gv2-product-choice ${activeProduct === index ? 'is-active' : ''}`} key={item.id} onClick={() => selectProduct(index)}>
                    <span className="gv2-choice-no">{item.id}</span><span className="gv2-choice-copy"><strong>{item.name}</strong><small>{item.kind}</small></span><ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
              <div className="gv2-object-note"><Layers3 size={18} strokeWidth={1.4} /><p>Each piece begins with the text — never the trend.</p></div>
            </div>
            <div className="gv2-object-stage" role="tabpanel" aria-live="polite">
              <div className="gv2-stage-top"><span>ARCHIVE NO. {product.id}</span><span>CONCEPT ARTWORK</span></div>
              <div className="gv2-stage-mat">
                <div className="gv2-stage-backdrop" />
                {!imageFailed ? (
                  <motion.img key={product.id} className="gv2-stage-image" src={product.image} alt={`${product.name} concept mockup`} onError={() => setImageFailed(true)} initial={reduceMotion ? false : { opacity: 0, y: 14, rotate: -1.2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }} />
                ) : (
                  <div className="gv2-stage-missing"><span>IMAGE UNAVAILABLE</span><strong>{product.name}</strong></div>
                )}
                <div className="gv2-stage-annotation"><span>01 / {product.kind}</span><span>Concept mockup · not a purchase listing</span></div>
              </div>
              <div className="gv2-stage-caption"><div><p>{product.kind}</p><h3>{product.title}</h3><span>{product.note}</span></div><Link to={product.link} className="gv2-circle-link" aria-label={`View canonical product detail for ${product.name}`}><ArrowUpRight size={20} /></Link></div>
              <div className="gv2-stage-controls"><span>{String(activeProduct + 1).padStart(2, '0')} <i>/ 04</i></span><div><button type="button" onClick={() => selectProduct(activeProduct - 1)} aria-label="Previous collection object"><ChevronLeft size={18} /></button><button type="button" onClick={() => selectProduct(activeProduct + 1)} aria-label="Next collection object"><ChevronRight size={18} /></button></div></div>
            </div>
          </div>
        </section>

        <section className="gv2-name-archive">
          <div className="gv2-name-intro">
            <div className="gv2-name-stamp">NAMES<br />OF GOD<br /><span>DICTIONARY SERIES</span></div>
            <div><p className="gv2-kicker"><i /> The dictionary series</p><h2>Six names.<br /><em>A living study.</em></h2><p className="gv2-name-deck">Each entry begins in scripture. The garment is only one way to remember.</p></div>
            <div className="gv2-name-arrows"><button type="button" onClick={() => setActiveName((activeName + names.length - 1) % names.length)} aria-label="Previous name"><ChevronLeft size={18} /></button><button type="button" onClick={() => setActiveName((activeName + 1) % names.length)} aria-label="Next name"><ChevronRight size={18} /></button></div>
          </div>
          <div className="gv2-name-display" aria-live="polite">
            <div className="gv2-name-counter"><span>ENTRY {names[activeName].no}</span><span>{names[activeName].phase}</span></div>
            <motion.div key={names[activeName].no} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
              <p className="gv2-pronunciation">/{names[activeName].sound}/</p>
              <h3>{names[activeName].name}</h3>
              <p className="gv2-name-meaning">{names[activeName].meaning}</p>
              <div className="gv2-name-rule" />
              <p className="gv2-name-text">{names[activeName].text}</p>
              <p className="gv2-name-scripture">SCRIPTURE REFERENCE <span>{names[activeName].verse}</span></p>
            </motion.div>
            <div className="gv2-name-dots" aria-label="Choose a name">
              {names.map((entry, index) => <button key={entry.no} type="button" aria-label={`Show ${entry.name}`} aria-current={activeName === index ? 'step' : undefined} onClick={() => setActiveName(index)}>{entry.no}</button>)}
            </div>
          </div>
          <div className="gv2-name-image"><img src="/assets/approved-media/gods-vessel/study-cards-phase-one-layout.png" alt="God’s Vessel study card layout concept artwork" /><span>CONCEPT ARTWORK · STUDY CARD LAYOUT</span></div>
        </section>

        <section className="gv2-process">
          <div className="gv2-process-image"><img src="/assets/approved-media/gods-vessel/archive-process-design-sketches.png" alt="God’s Vessel archive design process sketches" /><span>DESIGN PROCESS / CONCEPT ARTWORK</span></div>
          <div className="gv2-process-copy"><p className="gv2-kicker gv2-kicker-dark"><i /> The design language</p><h2>Reverence is<br />in the <em>restraint.</em></h2><p>Editorial type. Quiet numbering. A palette pulled from paper, ink, and time. Every mark has a reason to be there.</p><div className="gv2-values"><div><span>01</span><strong>Read</strong><small>Meaning before motif.</small></div><div><span>02</span><strong>Wear</strong><small>Study, brought close.</small></div><div><span>03</span><strong>Keep</strong><small>Made to return to.</small></div></div></div>
        </section>

        <section className="gv2-scripture">
          <div className="gv2-scripture-rail"><span>THE WORD, AT THE CENTER</span><span>ARCHIVE NOTES / LIVE CONTENT</span></div>
          <div className="gv2-scripture-content"><div className="gv2-scripture-intro"><p className="gv2-kicker"><i /> A reading space</p><h2>Return to<br /><em>the source.</em></h2><p>Scripture shared from the existing archive feed. This section reflects live content when available.</p></div><div className="gv2-quotes"><GodsVesselQuotesSection maxQuotes={3} showTitle={false} /></div></div>
        </section>

        <section className="gv2-closing">
          <div className="gv2-closing-rule" />
          <p className="gv2-kicker"><i /> God’s Vessel · Dictionary Series</p>
          <h2>Faith. Identity.<br /><em>The Archive.</em></h2>
          <p>A considered archive of names — designed to be worn, read, and kept.</p>
          <div className="gv2-closing-actions"><a href="/gods-vessel#gv-waitlist-form" className="gv2-cta">Visit the existing V1 signup <ArrowRight size={16} /></a><Link to="/experiments/dax-universe" className="gv2-back-link">Return to the Collective <ArrowUpRight size={15} /></Link></div>
          <div className="gv2-boundary">CANONICAL PRODUCT DETAILS REMAIN IN THE ORIGINAL GOD’S VESSEL EXPERIENCE.</div>
        </section>
        <footer className="gv2-footer"><span>DAX COLLECTIVE / GOD’S VESSEL</span><span>FAITH · IDENTITY · THE ARCHIVE</span><Link to="/experiments/dax-universe/traveler">EXPLORE ANOTHER WORLD <ArrowUpRight size={13} /></Link></footer>
      </main>
    </>
  );
}

export default VesselWorldPage;