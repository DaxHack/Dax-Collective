import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowDownRight, ArrowRight, Camera, Clock3, Compass, Globe2, MapPin, MoveUpRight } from 'lucide-react';
import BrandGallery from '../components/BrandGallery';
import ApprovedMediaGallery from '../components/ApprovedMediaGallery';
import { countBrandPhotos } from '../data/mediaCounts';

const mediaRoot = '/assets/approved-media/time-zone-travelers';

const destinations = [
  {
    city: 'Tokyo',
    detail: 'Shibuya',
    image: `${mediaRoot}/2024-tokyo-zone-guide-shibuya.png`,
    alt: 'Shibuya crossing in Tokyo, framed by its surrounding city lights',
    index: '01',
    tone: 'tokyo',
  },
  {
    city: 'Paris',
    detail: 'Seine riverbank',
    image: `${mediaRoot}/2023-paris-seine-riverbank-dusk.png`,
    alt: 'Dusk settling over the Seine riverbank in Paris',
    index: '02',
    tone: 'paris',
  },
  {
    city: 'Atlanta',
    detail: 'Airport, morning',
    image: `${mediaRoot}/2024-atlanta-airport-gate-morning.png`,
    alt: 'Morning light at an Atlanta airport gate',
    index: '03',
    tone: 'atlanta',
  },
];

const TimeZoneTravelersPage = () => (
  <>
    <Helmet>
      <title>Time-Zone Travelers — A world in many hours</title>
      <meta
        name="description"
        content="A visual starting point for curious travelers: destination concepts, the in-between, and a growing travel image archive."
      />
    </Helmet>

    <main className="tz-page" id="top">
      <style>{`
        .tz-page {
          --tz-ink: #102c2c;
          --tz-ink-soft: #385251;
          --tz-paper: #f3f0e6;
          --tz-paper-deep: #e8e5d9;
          --tz-acid: #d5ed67;
          --tz-coral: #dc7357;
          --tz-line: rgba(16, 44, 44, .17);
          min-height: 100dvh;
          overflow: hidden;
          background: var(--tz-paper);
          color: var(--tz-ink);
          font-family: "DM Sans", "Avenir Next", sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .tz-page *, .tz-page *::before, .tz-page *::after { box-sizing: border-box; }
        .tz-page a { color: inherit; }
        .tz-serif { font-family: "Instrument Serif", Georgia, serif; }
        .tz-mono { font-family: "Space Mono", "Courier New", monospace; }
        .tz-shell { width: min(1380px, calc(100% - 64px)); margin-inline: auto; }
        .tz-topbar {
          position: relative; z-index: 5; display: flex; align-items: center;
          justify-content: space-between; min-height: 82px; border-bottom: 1px solid var(--tz-line);
        }
        .tz-brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
        .tz-mark {
          display: grid; width: 37px; height: 37px; place-items: center; border-radius: 50%;
          background: var(--tz-acid); color: var(--tz-ink);
        }
        .tz-brand-name { font-size: 12px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
        .tz-nav { display: flex; align-items: center; gap: clamp(20px, 4vw, 54px); }
        .tz-nav a {
          position: relative; padding-block: 10px; color: var(--tz-ink-soft); font-size: 12px;
          font-weight: 650; letter-spacing: .02em; text-decoration: none; transition: color .2s ease;
        }
        .tz-nav a::after {
          position: absolute; right: 0; bottom: 3px; left: 0; height: 1px;
          background: var(--tz-coral); content: ""; transform: scaleX(0); transform-origin: left;
          transition: transform .22s ease;
        }
        .tz-nav a:hover { color: var(--tz-ink); }
        .tz-nav a:hover::after { transform: scaleX(1); }
        .tz-nav .tz-nav-archive { display: inline-flex; align-items: center; gap: 8px; }

        .tz-hero {
          position: relative; display: grid; min-height: min(760px, calc(100svh - 82px));
          grid-template-columns: minmax(0, .91fr) minmax(0, 1.09fr); align-items: center;
          gap: clamp(28px, 5vw, 76px); padding-block: 52px 72px;
        }
        .tz-hero-copy { position: relative; z-index: 2; padding-block: 18px; }
        .tz-eyebrow {
          display: flex; align-items: center; gap: 11px; margin-bottom: 25px;
          color: var(--tz-ink-soft); font-size: 10px; font-weight: 700; letter-spacing: .19em;
          line-height: 1.5; text-transform: uppercase;
        }
        .tz-eyebrow::before { width: 27px; height: 1px; background: var(--tz-coral); content: ""; }
        .tz-hero h1 {
          max-width: 660px; margin: 0; font-size: clamp(64px, 8.1vw, 120px);
          font-weight: 650; letter-spacing: -.09em; line-height: .84;
        }
        .tz-hero h1 em {
          display: block; margin-left: .36em; color: var(--tz-coral);
          font-size: 1.12em; font-weight: 400; letter-spacing: -.065em; line-height: .98;
        }
        .tz-hero-intro {
          max-width: 400px; margin: 31px 0 0; color: var(--tz-ink-soft);
          font-size: clamp(15px, 1.45vw, 18px); line-height: 1.7;
        }
        .tz-hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 23px; margin-top: 31px; }
        .tz-primary-link {
          display: inline-flex; min-height: 51px; align-items: center; justify-content: center; gap: 14px;
          padding: 0 21px; background: var(--tz-ink); color: var(--tz-paper) !important;
          font-size: 12px; font-weight: 700; text-decoration: none; transition: background .2s ease, color .2s ease;
        }
        .tz-primary-link:hover { background: var(--tz-coral); color: #fff !important; }
        .tz-text-link {
          display: inline-flex; align-items: center; gap: 8px; color: var(--tz-ink);
          font-size: 12px; font-weight: 700; text-decoration: none;
        }
        .tz-text-link svg, .tz-primary-link svg { transition: transform .2s ease; }
        .tz-text-link:hover svg, .tz-primary-link:hover svg { transform: translate(3px, -2px); }
        .tz-hero-count {
          position: absolute; bottom: 0; left: 0; display: flex; align-items: baseline; gap: 10px;
          color: var(--tz-ink-soft); font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
        }
        .tz-hero-count strong { color: var(--tz-ink); font-size: 18px; font-weight: 600; letter-spacing: -.04em; }
        .tz-hero-visual { position: relative; min-width: 0; height: min(620px, 67vw); min-height: 410px; }
        .tz-hero-image {
          position: absolute; top: 0; right: 5%; width: 77%; height: 83%;
          object-fit: cover; object-position: center; background: var(--tz-paper-deep);
        }
        .tz-hero-image::after { content: ""; }
        .tz-photo-label {
          position: absolute; top: 19px; left: 19px; display: inline-flex; align-items: center;
          gap: 8px; padding: 8px 10px; background: var(--tz-paper); color: var(--tz-ink);
          font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
        }
        .tz-hero-inset {
          position: absolute; right: 0; bottom: 0; width: 44%; height: 39%;
          border: 9px solid var(--tz-paper); object-fit: cover; object-position: center;
          background: var(--tz-paper-deep);
        }
        .tz-hero-index {
          position: absolute; top: 48%; left: -17px; color: var(--tz-ink-soft);
          font-size: 9px; letter-spacing: .17em; text-transform: uppercase; writing-mode: vertical-rl;
        }
        .tz-visual-caption {
          position: absolute; right: 48%; bottom: 5%; display: flex; flex-direction: column; gap: 4px;
          color: var(--tz-ink-soft); font-size: 10px; line-height: 1.4;
        }
        .tz-visual-caption strong { color: var(--tz-ink); font-size: 12px; }
        .tz-orbit {
          position: absolute; top: 12%; right: -4%; display: grid; width: 82px; height: 82px;
          place-items: center; border: 1px solid var(--tz-ink); border-radius: 50%;
          background: var(--tz-acid); transform: rotate(9deg);
        }
        .tz-orbit span { max-width: 48px; font-size: 8px; font-weight: 800; letter-spacing: .11em; line-height: 1.45; text-align: center; text-transform: uppercase; }

        .tz-band {
          background: var(--tz-ink); color: var(--tz-paper); border-block: 1px solid rgba(255,255,255,.13);
        }
        .tz-band-inner {
          display: flex; min-height: 70px; align-items: center; justify-content: space-between;
          gap: 20px; padding-block: 14px;
        }
        .tz-band-note { color: #b5c6b7; font-size: 11px; line-height: 1.5; }
        .tz-band-note b { margin-right: 12px; color: var(--tz-acid); font-size: 9px; letter-spacing: .16em; text-transform: uppercase; }
        .tz-band-right { display: flex; align-items: center; gap: 10px; color: var(--tz-acid); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }

        .tz-discovery { padding-block: 112px 122px; }
        .tz-section-head {
          display: grid; grid-template-columns: 1fr minmax(220px, 370px); align-items: end;
          gap: 24px; margin-bottom: 40px;
        }
        .tz-kicker { margin-bottom: 15px; color: var(--tz-coral); font-size: 9px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
        .tz-section-head h2 {
          margin: 0; font-size: clamp(42px, 6vw, 76px); font-weight: 600;
          letter-spacing: -.075em; line-height: .92;
        }
        .tz-section-head h2 em { color: var(--tz-coral); font-weight: 400; }
        .tz-section-head p { max-width: 350px; margin: 0 0 4px; color: var(--tz-ink-soft); font-size: 13px; line-height: 1.7; }
        .tz-destination-grid { display: grid; grid-template-columns: 1.08fr .88fr .88fr; align-items: start; gap: 17px; }
        .tz-destination:nth-child(2) { margin-top: 54px; }
        .tz-destination:nth-child(3) { margin-top: 108px; }
        .tz-destination-image-wrap { position: relative; overflow: hidden; background: var(--tz-paper-deep); }
        .tz-destination:first-child .tz-destination-image-wrap { aspect-ratio: 1.03 / 1; }
        .tz-destination:not(:first-child) .tz-destination-image-wrap { aspect-ratio: .87 / 1; }
        .tz-destination-image {
          display: block; width: 100%; height: 100%; min-height: 235px; object-fit: cover;
          transition: transform .65s cubic-bezier(.2,.75,.2,1);
        }
        .tz-destination:hover .tz-destination-image { transform: scale(1.035); }
        .tz-image-number {
          position: absolute; top: 13px; left: 13px; padding: 7px 9px;
          background: var(--tz-paper); color: var(--tz-ink); font-size: 9px; letter-spacing: .1em;
        }
        .tz-destination-meta { display: flex; justify-content: space-between; gap: 10px; padding: 15px 2px 0; }
        .tz-destination h3 { margin: 0; font-size: 27px; font-weight: 650; letter-spacing: -.06em; }
        .tz-destination-detail { display: block; margin-top: 4px; color: var(--tz-ink-soft); font-size: 11px; }
        .tz-concept-label {
          align-self: flex-start; padding: 6px 8px; border: 1px solid var(--tz-line);
          color: var(--tz-ink-soft); font-size: 8px; font-weight: 700; letter-spacing: .1em;
          line-height: 1.4; text-align: center; text-transform: uppercase;
        }
        .tz-disclaimer {
          display: flex; align-items: center; gap: 9px; margin-top: 29px;
          color: var(--tz-ink-soft); font-size: 10px; line-height: 1.5;
        }
        .tz-disclaimer svg { color: var(--tz-coral); flex: none; }

        .tz-interlude { position: relative; overflow: hidden; background: var(--tz-acid); }
        .tz-interlude::after {
          position: absolute; top: -105px; right: 7%; width: 310px; height: 310px;
          border: 1px solid rgba(16,44,44,.16); border-radius: 50%; content: "";
          box-shadow: 0 0 0 36px rgba(16,44,44,.035), 0 0 0 72px rgba(16,44,44,.025);
          pointer-events: none;
        }
        .tz-interlude-inner {
          position: relative; z-index: 1; display: grid; grid-template-columns: .85fr 1.15fr;
          align-items: center; gap: 48px; padding-block: 74px;
        }
        .tz-interlude-tag { display: flex; align-items: center; gap: 10px; font-size: 9px; font-weight: 800; letter-spacing: .19em; text-transform: uppercase; }
        .tz-interlude h2 { max-width: 410px; margin: 17px 0 0; font-size: clamp(39px, 5vw, 64px); letter-spacing: -.075em; line-height: .94; }
        .tz-interlude h2 em { font-weight: 400; }
        .tz-interlude-copy { max-width: 490px; color: rgba(16,44,44,.78); font-size: 14px; line-height: 1.75; }
        .tz-interlude-copy p { margin: 0 0 23px; }
        .tz-interlude .tz-text-link { border-bottom: 1px solid rgba(16,44,44,.45); padding-bottom: 7px; }

        .tz-archive { padding-block: 103px 112px; }
        .tz-archive-heading { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin-bottom: 36px; }
        .tz-archive-heading h2 { margin: 0; font-size: clamp(37px, 5.3vw, 68px); font-weight: 600; letter-spacing: -.075em; line-height: .95; }
        .tz-archive-heading p { max-width: 310px; margin: 0 0 3px; color: var(--tz-ink-soft); font-size: 12px; line-height: 1.65; }
        .tz-gallery-shell { padding: clamp(15px, 3vw, 31px); border: 1px solid var(--tz-line); background: rgba(255,255,255,.23); }
        .tz-gallery-title {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          margin-bottom: 19px; padding-bottom: 14px; border-bottom: 1px solid var(--tz-line);
          color: var(--tz-ink-soft); font-size: 9px; letter-spacing: .13em; text-transform: uppercase;
        }
        .tz-gallery-title span { display: flex; align-items: center; gap: 8px; }
        .tz-gallery-title strong { color: var(--tz-ink); font-weight: 700; }
        .tz-brand-gallery { min-height: 180px; }
        .tz-approved { padding-block: 82px 94px; background: #e7e4d8; }
        .tz-approved-head { display: grid; grid-template-columns: 1fr minmax(220px, 370px); gap: 25px; align-items: end; margin-bottom: 31px; }
        .tz-approved-head h2 { margin: 0; font-size: clamp(35px, 4.5vw, 57px); font-weight: 600; letter-spacing: -.07em; }
        .tz-approved-head p { margin: 0; color: var(--tz-ink-soft); font-size: 12px; line-height: 1.7; }
        .tz-approved-count { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 11px; color: var(--tz-coral); font-size: 9px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        .tz-approved-count b { color: var(--tz-ink); font-family: "Space Mono", monospace; font-size: 11px; font-weight: 400; letter-spacing: 0; }
        .tz-approved-gallery { padding: clamp(14px, 2.7vw, 30px); border: 1px solid var(--tz-line); background: var(--tz-paper); }

        .tz-footer { background: var(--tz-ink); color: var(--tz-paper); }
        .tz-footer-main { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-block: 29px; }
        .tz-footer-brand { display: flex; align-items: center; gap: 12px; font-size: 10px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
        .tz-footer-brand .tz-mark { width: 30px; height: 30px; }
        .tz-footer-note { color: #b5c6b7; font-size: 10px; line-height: 1.6; text-align: right; }
        .tz-footer-note a { color: var(--tz-acid); text-decoration: none; }
        .tz-footer-note a:hover { text-decoration: underline; text-underline-offset: 4px; }

        @keyframes tz-enter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .tz-hero-copy > * { animation: tz-enter .65s both; }
        .tz-hero-copy > :nth-child(2) { animation-delay: .06s; }
        .tz-hero-copy > :nth-child(3) { animation-delay: .13s; }
        .tz-hero-copy > :nth-child(4) { animation-delay: .2s; }
        .tz-hero-visual { animation: tz-enter .85s .12s both; }
        @media (min-width: 1500px) { .tz-hero { min-height: 750px; } }
        @media (max-width: 900px) {
          .tz-shell { width: min(100% - 42px, 760px); }
          .tz-topbar { min-height: 72px; }
          .tz-nav { gap: 19px; }
          .tz-hero { min-height: unset; grid-template-columns: 1fr .9fr; gap: 24px; padding-block: 55px 71px; }
          .tz-hero h1 { font-size: clamp(62px, 9vw, 89px); }
          .tz-hero-visual { height: 500px; min-height: 380px; }
          .tz-destination-grid { grid-template-columns: 1fr 1fr; gap: 25px 17px; }
          .tz-destination:first-child { grid-row: span 2; }
          .tz-destination:first-child .tz-destination-image-wrap { aspect-ratio: .77 / 1; }
          .tz-destination:not(:first-child) .tz-destination-image-wrap { aspect-ratio: 1.45 / 1; }
          .tz-destination:nth-child(2), .tz-destination:nth-child(3) { margin-top: 0; }
        }
        @media (max-width: 620px) {
          .tz-shell { width: calc(100% - 36px); }
          .tz-topbar { min-height: 68px; }
          .tz-mark { width: 33px; height: 33px; }
          .tz-brand-name { font-size: 10px; letter-spacing: .1em; }
          .tz-nav { gap: 14px; }
          .tz-nav a { font-size: 10px; }
          .tz-nav a:first-child { display: none; }
          .tz-nav .tz-nav-archive { gap: 4px; }
          .tz-nav .tz-nav-archive svg { width: 13px; }
          .tz-hero { display: flex; flex-direction: column; align-items: stretch; gap: 29px; padding-block: 48px 57px; }
          .tz-hero-copy { padding: 0; }
          .tz-eyebrow { margin-bottom: 22px; font-size: 9px; }
          .tz-hero h1 { font-size: clamp(62px, 17vw, 92px); }
          .tz-hero h1 em { margin-left: .25em; }
          .tz-hero-intro { max-width: 360px; margin-top: 21px; font-size: 14px; }
          .tz-hero-actions { margin-top: 22px; }
          .tz-primary-link { min-height: 47px; }
          .tz-hero-visual { width: 100%; height: 95vw; min-height: 320px; max-height: 470px; }
          .tz-hero-image { right: 8%; width: 82%; height: 82%; }
          .tz-hero-index { left: 0; font-size: 8px; }
          .tz-hero-inset { width: 43%; height: 39%; border-width: 7px; }
          .tz-orbit { top: 7%; right: 0; width: 67px; height: 67px; }
          .tz-orbit span { font-size: 7px; }
          .tz-visual-caption { right: 48%; bottom: 3%; font-size: 9px; }
          .tz-hero-count { position: static; margin-top: 22px; font-size: 9px; }
          .tz-band-inner { align-items: flex-start; flex-direction: column; gap: 9px; padding-block: 15px; }
          .tz-band-note { font-size: 10px; }
          .tz-discovery { padding-block: 76px 78px; }
          .tz-section-head { grid-template-columns: 1fr; gap: 14px; margin-bottom: 26px; }
          .tz-section-head h2 { font-size: clamp(44px, 13vw, 66px); }
          .tz-section-head p { max-width: 370px; font-size: 12px; }
          .tz-destination-grid { grid-template-columns: 1fr 1fr; gap: 25px 12px; }
          .tz-destination:first-child { grid-column: 1 / -1; grid-row: auto; }
          .tz-destination:first-child .tz-destination-image-wrap { aspect-ratio: 1.15 / 1; }
          .tz-destination:not(:first-child) .tz-destination-image-wrap { aspect-ratio: .78 / 1; }
          .tz-destination-image { min-height: 170px; }
          .tz-destination h3 { font-size: 23px; }
          .tz-destination-meta { display: block; padding-top: 11px; }
          .tz-concept-label { display: inline-block; margin-top: 9px; padding: 5px 6px; font-size: 7px; }
          .tz-disclaimer { align-items: flex-start; margin-top: 20px; font-size: 9px; }
          .tz-interlude-inner { grid-template-columns: 1fr; gap: 21px; padding-block: 48px; }
          .tz-interlude h2 { font-size: clamp(43px, 13vw, 62px); }
          .tz-interlude-copy { max-width: 420px; font-size: 12px; }
          .tz-interlude::after { top: -120px; right: -130px; }
          .tz-archive { padding-block: 72px 76px; }
          .tz-archive-heading { align-items: flex-start; flex-direction: column; gap: 13px; margin-bottom: 24px; }
          .tz-archive-heading h2 { font-size: clamp(41px, 12vw, 59px); }
          .tz-archive-heading p { max-width: 360px; font-size: 11px; }
          .tz-gallery-title { font-size: 8px; }
          .tz-approved { padding-block: 61px 67px; }
          .tz-approved-head { grid-template-columns: 1fr; gap: 12px; }
          .tz-approved-head h2 { font-size: 42px; }
          .tz-approved-head p { max-width: 400px; font-size: 11px; }
          .tz-footer-main { align-items: flex-start; flex-direction: column; gap: 16px; }
          .tz-footer-note { text-align: left; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tz-page *, .tz-page *::before, .tz-page *::after {
            scroll-behavior: auto !important; animation-duration: .01ms !important;
            animation-iteration-count: 1 !important; transition-duration: .01ms !important;
          }
        }
      `}</style>

      <header className="tz-shell tz-topbar">
        <a className="tz-brand" href="#top" aria-label="Time-Zone Travelers home" data-testid="link-timezone-home">
          <span className="tz-mark"><Globe2 size={18} strokeWidth={1.8} /></span>
          <span className="tz-brand-name">Time-Zone Travelers</span>
        </a>
        <nav className="tz-nav" aria-label="Page navigation">
          <a href="#destinations" data-testid="link-destinations">Destinations</a>
          <a href="#journey" data-testid="link-journey">The in-between</a>
          <a className="tz-nav-archive" href="#archive" data-testid="link-visual-archive">Visual archive <ArrowRight size={14} /></a>
        </nav>
      </header>

      <section className="tz-shell tz-hero" aria-labelledby="tz-title">
        <div className="tz-hero-copy">
          <div className="tz-eyebrow">A field guide to elsewhere</div>
          <h1 id="tz-title">A world<br />in many <em>hours.</em></h1>
          <p className="tz-hero-intro">
            The world doesn’t keep one schedule. Start with a place, a passing moment, or the space between arrivals.
          </p>
          <div className="tz-hero-actions">
            <a className="tz-primary-link" href="#destinations" data-testid="link-browse-destinations">
              Browse destination concepts <ArrowRight size={16} />
            </a>
            <a className="tz-text-link" href="#archive" data-testid="link-open-archive">
              Open the visual archive <ArrowDownRight size={15} />
            </a>
          </div>
          <div className="tz-hero-count"><strong>01—03</strong> Visual starting points</div>
        </div>

        <div className="tz-hero-visual" aria-label="A glimpse of Tokyo and Paris">
          <span className="tz-hero-index tz-mono">Local time, another point of view</span>
          <img
            className="tz-hero-image"
            src={destinations[0].image}
            alt={destinations[0].alt}
            data-testid="img-hero-tokyo"
          />
          <span className="tz-photo-label tz-mono"><MapPin size={12} /> Tokyo · Shibuya</span>
          <img
            className="tz-hero-inset"
            src={destinations[1].image}
            alt={destinations[1].alt}
            loading="lazy"
            data-testid="img-hero-paris"
          />
          <div className="tz-visual-caption"><strong>Somewhere, it’s dusk.</strong><span>Somewhere else, the day begins.</span></div>
          <div className="tz-orbit" aria-hidden="true"><span>Across<br />the hours</span></div>
        </div>
      </section>

      <div className="tz-band" aria-label="About this discovery page">
        <div className="tz-shell tz-band-inner">
          <div className="tz-band-note"><b className="tz-mono">Open atlas</b> A discovery page in progress — made to wander, not to prescribe.</div>
          <div className="tz-band-right tz-mono"><Clock3 size={14} />Everywhere has its own hour</div>
        </div>
      </div>

      <section className="tz-shell tz-discovery" id="destinations" aria-labelledby="tz-destinations-heading">
        <div className="tz-section-head">
          <div>
            <div className="tz-kicker tz-mono">A first look · 01—03</div>
            <h2 id="tz-destinations-heading">Places to<br /><em>begin with.</em></h2>
          </div>
          <p>Three destination concepts, opened through available photography. A visual point of departure—not a set of published city guides.</p>
        </div>

        <div className="tz-destination-grid">
          {destinations.map((destination) => (
            <article className={`tz-destination tz-destination-${destination.tone}`} key={destination.city} data-testid={`card-destination-${destination.city.toLowerCase()}`}>
              <div className="tz-destination-image-wrap">
                <img
                  className="tz-destination-image"
                  src={destination.image}
                  alt={destination.alt}
                  loading="lazy"
                  data-testid={`img-destination-${destination.city.toLowerCase()}`}
                />
                <span className="tz-image-number tz-mono">{destination.index} / 03</span>
              </div>
              <div className="tz-destination-meta">
                <div>
                  <h3>{destination.city}</h3>
                  <span className="tz-destination-detail">{destination.detail}</span>
                </div>
                <span className="tz-concept-label">Destination<br />concept</span>
              </div>
            </article>
          ))}
        </div>
        <div className="tz-disclaimer"><Compass size={15} />These are visual concepts only. No destination guide or itinerary is being presented.</div>
      </section>

      <section className="tz-interlude" id="journey" aria-labelledby="tz-journey-heading">
        <div className="tz-shell tz-interlude-inner">
          <div>
            <div className="tz-interlude-tag tz-mono"><MoveUpRight size={14} /> The passage is part of it</div>
            <h2 className="tz-serif" id="tz-journey-heading">Not just where.<br /><em>What happens between.</em></h2>
          </div>
          <div className="tz-interlude-copy">
            <p>Gates, windows, layovers, first light through an unfamiliar terminal. Travel discovery can start long before arrival—and keep going after the map is folded away.</p>
            <a className="tz-text-link" href="#approved-media" data-testid="link-transit-photography">
              See the travel image collection <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="tz-shell tz-archive" id="archive" aria-labelledby="tz-archive-heading">
        <div className="tz-archive-heading">
          <div>
            <div className="tz-kicker tz-mono">Collected, not concluded</div>
            <h2 id="tz-archive-heading">The visual archive.</h2>
          </div>
          <p>A growing collection of travel imagery. Browse the gallery for the moments that catch your eye.</p>
        </div>
        <div className="tz-gallery-shell tz-brand-gallery">
          <div className="tz-gallery-title tz-mono">
            <span><Camera size={14} /> Brand gallery</span>
            <strong>Time-Zone Travelers</strong>
          </div>
          <BrandGallery
            brand="timezone-travelers"
            category="gallery"
            maxImages={12}
            layout="grid"
            showControls={true}
            enableUpload={false}
          />
        </div>
      </section>

      <section className="tz-approved" id="approved-media" aria-labelledby="tz-approved-heading">
        <div className="tz-shell">
          <div className="tz-approved-head">
            <div>
              <div className="tz-approved-count tz-mono"><Camera size={14} /> Approved collection <b>{countBrandPhotos('Time-Zone Travelers')} items</b></div>
              <h2 id="tz-approved-heading">Images with a passport.</h2>
            </div>
            <p>Reviewed visual assets selected for this brand. The collection stays focused on travel and the feeling of moving through place.</p>
          </div>
          <div className="tz-approved-gallery">
            <ApprovedMediaGallery brand="Time-Zone Travelers" />
          </div>
        </div>
      </section>

      <footer className="tz-footer">
        <div className="tz-shell tz-footer-main">
          <div className="tz-footer-brand"><span className="tz-mark"><Globe2 size={15} /></span>Time-Zone Travelers</div>
          <div className="tz-footer-note">
            A visual discovery project, still unfolding.<br />
            <a href="#top" data-testid="link-back-to-top">Back to the beginning ↑</a>
          </div>
        </div>
      </footer>
    </main>
  </>
);

export default TimeZoneTravelersPage;