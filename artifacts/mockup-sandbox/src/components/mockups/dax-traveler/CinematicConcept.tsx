import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO PLACEHOLDERS
// Each has a gradient that mirrors the mood/palette of the real photo.
// Aspect ratios match the intended crop exactly.
// ─────────────────────────────────────────────────────────────────────────────
type PlaceholderProps = {
  gradient: string;
  label: string;
  style?: React.CSSProperties;
  className?: string;
};

function Img({ gradient, label, style, className }: PlaceholderProps) {
  return (
    <div
      aria-label={label}
      style={{
        width: '100%',
        height: '100%',
        background: gradient,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        ...style,
      }}
      className={className}
    >
      <span style={{
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        padding: '6px 8px',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
        borderRadius: '0 6px 0 0',
        lineHeight: 1.4,
        maxWidth: '90%',
      }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PHOTOS = {
  // Cuba
  cubaClassicCar:  'linear-gradient(160deg, #7C3A1E 0%, #B85A2A 35%, #D4824A 60%, #8B4513 100%)',
  cubaVieja:       'linear-gradient(140deg, #4A6741 0%, #7A8B5A 30%, #C4A882 60%, #8B7355 100%)',
  cubaStreet:      'linear-gradient(155deg, #3D5A7A 0%, #6B8FAB 40%, #A89070 70%, #5C4A3A 100%)',
  // Puerto Rico
  prStreet:        'linear-gradient(150deg, #2E5BA8 0%, #4A7FC1 25%, #E8854A 55%, #C45A2A 85%, #1E3D6B 100%)',
  prBeach:         'linear-gradient(160deg, #1B4A8A 0%, #2E7ABF 30%, #5BB8D4 55%, #A8D8E8 75%, #7DBDD4 100%)',
  prElMorro:       'linear-gradient(145deg, #3A7A3A 0%, #5CAD5C 35%, #88C870 60%, #B8D890 80%, #4A8A4A 100%)',
  prZipline:       'linear-gradient(150deg, #1A4A1A 0%, #2D6B2D 30%, #4A8A3A 55%, #6AAA5A 75%, #88C878 100%)',
  // Atlanta
  atlCamera:       'linear-gradient(155deg, #1A1A2E 0%, #16213E 35%, #0F3460 60%, #533483 85%, #E94560 100%)',
  atlPacking:      'linear-gradient(145deg, #2C2C54 0%, #474787 35%, #AAABB8 65%, #8888AA 100%)',
  // Portrait/story
  storyBlackShirt: 'linear-gradient(160deg, #1A1A1A 0%, #2D2D2D 40%, #3A3A3A 70%, #1A1A1A 100%)',
  smiling:         'linear-gradient(150deg, #8B4513 0%, #D2691E 35%, #DEB887 60%, #CD853F 100%)',
};

const TRIPS = [
  {
    id: 'cuba',
    title: 'Havana, Cuba',
    year: '2024',
    coords: '23.1° N, 82.4° W',
    flag: '🇨🇺',
    accent: '#F59E0B',
    tagline: 'Classic cars, casas, and the best mojito of my life.',
    cover: PHOTOS.cubaClassicCar,
    coverLabel: 'Havana Classic Car — 2024',
    photos: [
      { g: PHOTOS.cubaClassicCar,  l: 'Havana Classic Car' },
      { g: PHOTOS.cubaVieja,       l: 'Havana Vieja Facade' },
      { g: PHOTOS.cubaStreet,      l: 'Havana Street B-Roll' },
    ],
  },
  {
    id: 'pr',
    title: 'Puerto Rico',
    year: '2024',
    coords: '18.2° N, 66.6° W',
    flag: '🇵🇷',
    accent: '#22D3EE',
    tagline: 'Old San Juan, El Morro, and a zipline I almost said no to.',
    cover: PHOTOS.prStreet,
    coverLabel: 'Old San Juan Street — 2024',
    photos: [
      { g: PHOTOS.prStreet,  l: 'Old San Juan Street' },
      { g: PHOTOS.prBeach,   l: 'Condado Beach Morning' },
      { g: PHOTOS.prElMorro, l: 'El Morro Kite' },
    ],
  },
  {
    id: 'atl',
    title: 'Atlanta, GA',
    year: '2024',
    coords: '33.7° N, 84.4° W',
    flag: '🇺🇸',
    accent: '#A78BFA',
    tagline: 'Home base. Gear packed. Always ready for the next departure.',
    cover: PHOTOS.atlCamera,
    coverLabel: 'Camera Bag & Gear — 2024',
    photos: [
      { g: PHOTOS.atlCamera,  l: 'Camera Bag & Gear' },
      { g: PHOTOS.atlPacking, l: 'Packing Flatlay' },
    ],
  },
];

const ROUTE = [
  { code: 'ATL', label: 'Atlanta',   x: 80,  y: 72 },
  { code: 'HAV', label: 'Havana',    x: 345, y: 82 },
  { code: 'SJU', label: 'San Juan',  x: 620, y: 64 },
];

const LATEST = [
  {
    title: 'Old San Juan: Color, Salt, and Silence',
    location: 'Puerto Rico',
    hook: 'A solo walk through cobblestone streets that taught me how to slow down on the road.',
    tags: ['solo trip', 'culture'],
    grad: PHOTOS.prStreet,
    imgLabel: 'Old San Juan Street',
  },
  {
    title: 'Above the Canopy: My First Zipline',
    location: 'Toro Verde',
    hook: 'I am terrified of heights. I went anyway. Here is what happened in the 90 seconds I was airborne.',
    tags: ['adventure', 'first time'],
    grad: PHOTOS.prZipline,
    imgLabel: 'Toro Verde Zipline',
  },
  {
    title: 'Cuba on a Budget: $40 a Day',
    location: 'Havana',
    hook: 'No tourist traps, no resorts. Just casas, classic cars, and the best mojito of my life.',
    tags: ['budget', 'food'],
    grad: PHOTOS.cubaClassicCar,
    imgLabel: 'Havana Classic Car',
  },
];

const ARCHIVE = [
  { year: '2024', destination: 'Puerto Rico',       count: 3, grad: PHOTOS.prBeach,   label: 'Condado Beach' },
  { year: '2024', destination: 'Cuba',              count: 2, grad: PHOTOS.cubaVieja,  label: 'Havana Vieja' },
  { year: '2024', destination: 'Atlanta Day Trips', count: 6, grad: PHOTOS.atlCamera,  label: 'Atlanta Gear' },
  { year: '2023', destination: 'East Coast',        count: 4, grad: PHOTOS.storyBlackShirt, label: 'East Coast' },
];

const TAG_COLOR: Record<string, string> = {
  'solo trip':  '#22D3EE',
  'budget':     '#34D399',
  'food':       '#F59E0B',
  'adventure':  '#FB923C',
  'first time': '#A78BFA',
  'culture':    '#F472B6',
};

// ─────────────────────────────────────────────────────────────────────────────
// TILT HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({
      y:  ((e.clientX - (r.left + r.width  / 2)) / r.width)  * strength,
      x: -((e.clientY - (r.top  + r.height / 2)) / r.height) * (strength * 0.7),
      gx: ((e.clientX - r.left) / r.width)  * 100,
      gy: ((e.clientY - r.top)  / r.height) * 100,
    });
  }, [strength]);
  const onLeave = useCallback(() => setT({ x: 0, y: 0, gx: 50, gy: 50 }), []);
  return { ref, t, onMove, onLeave };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED ROUTE
// ─────────────────────────────────────────────────────────────────────────────
function RouteBar() {
  const [progress, setProgress] = useState(0);
  const [dotsVis, setDotsVis] = useState([false, false, false]);
  useEffect(() => {
    const start = setTimeout(() => {
      let p = 0;
      const iv = setInterval(() => {
        p += 0.008;
        if (p >= 1) { p = 1; clearInterval(iv); }
        setProgress(p);
        // reveal dots at intervals
        setDotsVis([p > 0.05, p > 0.42, p > 0.82]);
      }, 16);
    }, 300);
    return () => clearTimeout(start);
  }, []);

  const pathLen = 620;
  const dashOffset = pathLen * (1 - progress);

  return (
    <div style={{ background: '#06091a', padding: '32px 48px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#374151', marginBottom: 18, margin: '0 0 18px' }}>
        2024 Route
      </p>
      <svg viewBox="0 0 700 110" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '0 auto' }} fill="none">
        <defs>
          <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#A78BFA"/>
            <stop offset="50%"  stopColor="#F59E0B"/>
            <stop offset="100%" stopColor="#22D3EE"/>
          </linearGradient>
        </defs>
        {/* Ghost path */}
        <path
          d="M 80 72 C 185 34, 270 108, 345 82 C 420 56, 530 44, 620 64"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="5 4"
        />
        {/* Animated fill path */}
        <path
          d="M 80 72 C 185 34, 270 108, 345 82 C 420 56, 530 44, 620 64"
          stroke="url(#rg2)" strokeWidth="1.8" strokeDasharray={`${pathLen}`}
          strokeDashoffset={dashOffset}
          style={{ transition: 'none' }}
        />
        {ROUTE.map((s, i) => {
          const colors = ['#A78BFA', '#F59E0B', '#22D3EE'];
          return (
            <g key={s.code} style={{ opacity: dotsVis[i] ? 1 : 0, transition: 'opacity 0.5s ease' }}>
              <circle cx={s.x} cy={s.y} r={14} fill={colors[i]} fillOpacity={0.1}/>
              <circle cx={s.x} cy={s.y} r={5.5} fill={colors[i]}/>
              <text x={s.x} y={s.y - 18} fill="white" fontSize={10} fontWeight="700" textAnchor="middle" fontFamily="monospace">{s.code}</text>
              <text x={s.x} y={s.y + 24} fill="#6B7280" fontSize={9} textAnchor="middle">{s.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIP CHAPTER CARD
// ─────────────────────────────────────────────────────────────────────────────
function TripCard({ trip, isActive, onClick }: { trip: typeof TRIPS[0]; isActive: boolean; onClick: () => void }) {
  const { ref, t, onMove, onLeave } = useTilt(10);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        flexShrink: 0, width: 200, height: 284, borderRadius: 16, overflow: 'hidden',
        cursor: 'pointer', position: 'relative',
        outline: isActive ? `2px solid ${trip.accent}` : '2px solid rgba(255,255,255,0.07)',
        outlineOffset: 2,
        transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg) scale(${isActive ? 1.04 : 1})`,
        transition: 'outline 0.2s, transform 0.15s ease-out',
        boxShadow: isActive ? `0 0 32px ${trip.accent}22, 0 12px 40px rgba(0,0,0,0.5)` : '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Photo placeholder */}
      <div style={{ position: 'absolute', inset: 0, background: trip.cover }} />
      {/* Glare sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.09) 0%, transparent 58%)`,
        pointerEvents: 'none',
      }} />
      {/* Active destination glow */}
      {isActive && (
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 60% 20%, ${trip.accent}20 0%, transparent 65%)`, pointerEvents: 'none' }} />
      )}
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
      {/* Label */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px 12px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: trip.accent }}>{trip.coords}</div>
        <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{trip.title}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#6B7280', marginTop: 3 }}>{trip.year}</div>
        <p style={{ marginTop: 6, fontSize: 11, color: '#9CA3AF', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {trip.tagline}
        </p>
      </div>
      {/* Photo label watermark */}
      <div style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: 4 }}>
        {trip.flag} {trip.coverLabel}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIP CHAPTER RAIL + EXPANDED VIEWER
// ─────────────────────────────────────────────────────────────────────────────
function TripChapterRail() {
  const [activeId, setActiveId] = useState('cuba');
  const [photoIdx, setPhotoIdx] = useState(0);
  const trip = TRIPS.find(t => t.id === activeId)!;

  useEffect(() => { setPhotoIdx(0); }, [activeId]);

  return (
    <section style={{ background: '#070b12', padding: '64px 0' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
        {/* Section header */}
        <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 6 }}>
          Trip Chapters
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Every destination, documented.</h2>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 32 }}>
          Select a chapter — swipe or click · photos expand below
        </p>

        {/* Horizontal card rail */}
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {TRIPS.map(t => (
            <TripCard key={t.id} trip={t} isActive={t.id === activeId} onClick={() => setActiveId(t.id)} />
          ))}
        </div>

        {/* Expanded viewer — animates in/out via opacity+translateY */}
        <div
          key={activeId}
          style={{
            marginTop: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            animation: 'fadeUp 0.32s ease-out',
          }}
        >
          {/* Main large photo */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#111', aspectRatio: '4/3' }}>
            <div
              key={`${trip.id}-${photoIdx}`}
              style={{
                position: 'absolute', inset: 0,
                background: trip.photos[photoIdx].g,
                animation: 'fadeIn 0.35s ease-out',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)' }} />
            {/* Coord badge */}
            <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
              {trip.coords}
            </div>
            {/* Photo label */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.45)', background: 'rgba(0,0,0,0.35)', padding: '3px 7px', borderRadius: 4 }}>
              {trip.photos[photoIdx].l}
            </div>
            {/* Dot navigation */}
            <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
              {trip.photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{
                  width: i === photoIdx ? 22 : 7, height: 7, borderRadius: 999,
                  background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.2s ease, background 0.2s ease',
                }} />
              ))}
            </div>
            {/* Prev/Next arrows */}
            {trip.photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(i => (i - 1 + trip.photos.length) % trip.photos.length)}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                  ‹
                </button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % trip.photos.length)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                  ›
                </button>
              </>
            )}
          </div>

          {/* Right panel — thumbnail strip + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Thumbnail strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flex: '0 0 auto' }}>
              {trip.photos.map((p, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{
                  borderRadius: 10, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0,
                  aspectRatio: '1', outline: i === photoIdx ? `2px solid ${trip.accent}` : 'none', outlineOffset: 1,
                  opacity: i === photoIdx ? 1 : 0.5, transition: 'opacity 0.2s, outline 0.2s',
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: p.g }} />
                </button>
              ))}
            </div>

            {/* Tagline card */}
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10,
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: trip.accent }}>
                {trip.flag} {trip.title} — {trip.year}
              </div>
              <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.75, margin: 0 }}>{trip.tagline}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${trip.accent}44, transparent)` }} />
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#4B5563', letterSpacing: '0.12em' }}>
                  {trip.photos.length} PHOTOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNEY CARD (tilt + glare + hover zoom)
// ─────────────────────────────────────────────────────────────────────────────
function JourneyCard({ j, idx }: { j: typeof LATEST[0]; idx: number }) {
  const { ref, t, onMove, onLeave } = useTilt(9);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{
        borderRadius: 20, overflow: 'hidden', background: 'rgba(17,24,39,0.65)',
        border: `1px solid ${hovered ? 'rgba(34,211,238,0.22)' : 'rgba(255,255,255,0.07)'}`,
        transform: `perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg)`,
        transition: 'transform 0.1s ease-out, border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? '0 8px 40px rgba(34,211,238,0.07)' : 'none',
        cursor: 'pointer',
        animation: `fadeUp 0.5s ease-out ${idx * 0.08}s both`,
      }}
    >
      {/* Photo area */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
        <div style={{
          position: 'absolute', inset: 0, background: j.grad,
          transform: `scale(${hovered ? 1.06 : 1})`,
          transition: 'transform 0.5s ease-out',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        {/* Glare */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
          pointerEvents: 'none',
        }} />
        {/* Location badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.45)', borderRadius: 999, padding: '4px 11px', backdropFilter: 'blur(4px)' }}>
          <span style={{ fontSize: 10 }}>📍</span>
          <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{j.location}</span>
        </div>
        {/* Photo label */}
        <div style={{ position: 'absolute', bottom: 10, right: 10, fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>
          {j.imgLabel}
        </div>
      </div>
      {/* Text */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 8px', lineHeight: 1.4 }}>{j.title}</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.65, margin: '0 0 14px' }}>{j.hook}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
          {j.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 500, borderRadius: 999, padding: '2px 9px',
              color: TAG_COLOR[tag] ?? '#9CA3AF',
              background: `${TAG_COLOR[tag] ?? '#6B7280'}18`,
              border: `1px solid ${TAG_COLOR[tag] ?? '#6B7280'}44`,
            }}>{tag}</span>
          ))}
        </div>
        <a href="#" style={{ fontSize: 12, fontWeight: 500, color: '#22D3EE', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          onClick={e => e.preventDefault()}>
          Read the story <span style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(3px)' : 'none' }}>→</span>
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSPORT PIECES — asymmetric portrait archive
// ─────────────────────────────────────────────────────────────────────────────
function PassportPieces() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{ background: 'rgba(17,24,39,0.4)', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '72px 0' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 6 }}>
          Passport Pieces
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Every trip, organized</h2>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 32 }}>A growing index of every destination I've documented.</p>

        {/* 4-column asymmetric portrait cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {ARCHIVE.map((a, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                transform: hovered === i ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                boxShadow: hovered === i ? '0 16px 40px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.3)',
                border: hovered === i ? '1px solid rgba(34,211,238,0.2)' : '1px solid rgba(255,255,255,0.06)',
                animation: `fadeUp 0.5s ease-out ${i * 0.07}s both`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: a.grad,
                transform: hovered === i ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.5s ease-out',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
              {/* Light sweep on hover */}
              {hovered === i && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 14px' }}>
                <div style={{ fontSize: 11, color: '#22D3EE', fontWeight: 500, marginBottom: 3 }}>{a.year}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>{a.destination}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{a.count} stories</div>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>
                {a.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <a href="#" style={{ fontSize: 13, fontWeight: 500, color: '#22D3EE', textDecoration: 'none' }}
            onClick={e => e.preventDefault()}>
            Browse the full archive →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK WITH DAX
// ─────────────────────────────────────────────────────────────────────────────
function WorkWithDax() {
  return (
    <section style={{ background: '#06091a', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '72px 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: 14 }}>
          Work With Dax
        </p>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
          You travel.<br/><span style={{ color: '#22D3EE' }}>I tell the story.</span>
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
          If your destination, brand, or experience belongs in an honest travel story —
          not a paid listicle — reach out. No guaranteed coverage. Just a real conversation.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" onClick={e => e.preventDefault()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#22D3EE', color: '#030712',
            borderRadius: 999, padding: '13px 28px', fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}>
            ✉ Get in touch
          </a>
          <a href="#" onClick={e => e.preventDefault()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)', color: '#fff',
            borderRadius: 999, padding: '13px 28px', fontWeight: 500, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.14)', textDecoration: 'none',
          }}>
            📋 What I cover
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  // Three parallax layers at different speeds
  const y0 = scrollY * 0.30;   // BG — slowest
  const y1 = scrollY * 0.16;   // Mid panel
  const y2 = scrollY * 0.08;   // FG card — fastest (nearest)
  const textY  = scrollY * 0.20;
  const textOp = Math.max(0, 1 - scrollY / 420);

  return (
    <div ref={heroRef} style={{ position: 'relative', height: '92vh', overflow: 'hidden', background: '#050810', minHeight: 480 }}>

      {/* ── BG layer: Havana Vieja facade ── */}
      <div style={{ position: 'absolute', inset: 0, willChange: 'transform', transform: `translateY(${y0}px)` }}>
        <div style={{ position: 'absolute', inset: 0, background: PHOTOS.cubaVieja, opacity: 0.48 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,8,16,0.55) 0%, rgba(5,8,16,0.15) 40%, rgba(5,8,16,0.96) 100%)' }} />
      </div>

      {/* ── Mid panel: PR Old San Juan street (right side) ── */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, height: '88%', width: '62%',
        willChange: 'transform', transform: `translateY(${y1}px)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: PHOTOS.prStreet }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent, rgba(5,8,16,0.22) 40%, rgba(5,8,16,0.88) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,8,16,0.48) 0%, transparent 38%, rgba(5,8,16,1) 100%)' }} />
      </div>

      {/* ── FG card: Cuba classic car (bottom-left portrait) ── */}
      <div style={{
        position: 'absolute', bottom: '10%', left: 36, height: '46%', width: '28%',
        overflow: 'hidden', borderRadius: 18,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(245,158,11,0.28)',
        willChange: 'transform', transform: `translateY(${y2}px)`,
        minWidth: 140, minHeight: 180,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: PHOTOS.cubaClassicCar }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)' }} />
        {/* amber edge glow */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.18)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px', fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F59E0B' }}>
          Havana, Cuba — 2024
        </div>
      </div>

      {/* ── Ambient glows ── */}
      <div style={{ position: 'absolute', top: '33%', left: '40%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(34,211,238,0.055)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(245,158,11,0.04)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* ── Hero text ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end',
        padding: '0 48px 96px',
        willChange: 'transform',
        transform: `translateY(${textY}px)`, opacity: textOp,
      }}>
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(-22px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
          maxWidth: 560,
        }}>
          {/* Eyebrow pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 999, padding: '5px 14px', fontSize: 11, fontWeight: 500, color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)', marginBottom: 20, backdropFilter: 'blur(6px)' }}>
            🌍 Real trips. Honest stories.
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(54px, 7.5vw, 96px)', fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 20px' }}>
            Dax the<br/><span style={{ color: '#22D3EE' }}>Traveler</span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.72, maxWidth: 470, marginBottom: 16 }}>
            I travel to learn how other people live — and I bring back the kind of
            honest stories I wish someone had told me before my first trip.
          </p>

          {/* Route mono tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#4B5563', marginBottom: 28 }}>
            <span>ATL → HAV → SJU</span>
            <span style={{ height: 1, width: 24, background: '#374151', display: 'inline-block' }} />
            <span>2024 Archive</span>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#trips" onClick={e => e.preventDefault()} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#22D3EE', color: '#030712',
              borderRadius: 999, padding: '13px 28px', fontWeight: 700, fontSize: 13, textDecoration: 'none',
            }}>
              See the trips →
            </a>
            <a href="#story" onClick={e => e.preventDefault()} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.07)', color: '#fff',
              borderRadius: 999, padding: '13px 28px', fontWeight: 500, fontSize: 13,
              border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', textDecoration: 'none',
            }}>
              Why I Travel
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll nudge ── */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        animation: 'nudge 2s ease-in-out infinite',
      }}>
        <div style={{ width: 1, height: 34, background: 'linear-gradient(to bottom, rgba(34,211,238,0.5), transparent)' }} />
      </div>

      <style>{`
        @keyframes nudge { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(7px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE LAYOUT WRAPPER
// Renders a narrower viewport to show the mobile layout
// ─────────────────────────────────────────────────────────────────────────────
function MobileHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: 'relative', height: 520, overflow: 'hidden', background: '#050810' }}>
      <div style={{ position: 'absolute', inset: 0, background: PHOTOS.cubaVieja, opacity: 0.5 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,8,16,0.45) 0%, rgba(5,8,16,0.15) 40%, rgba(5,8,16,0.97) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, height: '75%', width: '55%' }}>
        <div style={{ position: 'absolute', inset: 0, background: PHOTOS.prStreet, opacity: 0.85 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent, rgba(5,8,16,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,8,16,0.4), transparent 40%, rgba(5,8,16,1) 100%)' }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end',
        padding: '0 24px 52px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateX(-14px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 999, padding: '4px 12px', fontSize: 10, fontWeight: 500, color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)', marginBottom: 14 }}>
          🌍 Real trips. Honest stories.
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 14px' }}>
          Dax the<br/><span style={{ color: '#22D3EE' }}>Traveler</span>
        </h1>
        <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.7, marginBottom: 20, maxWidth: 300 }}>
          Real trips. Honest stories I wish someone had told me before my first trip.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ background: '#22D3EE', color: '#030712', borderRadius: 999, padding: '11px 22px', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
            See the trips →
          </a>
          <a href="#" onClick={e => e.preventDefault()} style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', borderRadius: 999, padding: '11px 22px', fontWeight: 500, fontSize: 12, border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none' }}>
            Why I Travel
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function CinematicConcept() {
  return (
    <div style={{ background: '#050810', color: '#fff', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", minHeight: '100vh' }}>

      {/* SECTION 1 — Cinematic layered hero */}
      <Hero />

      {/* SECTION 2 — Animated route bar */}
      <RouteBar />

      {/* SECTION 3 — Trip chapter rail + expanded viewer */}
      <TripChapterRail />

      {/* SECTION 4 — Editorial journey cards */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '72px 40px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 6 }}>
          Wanderlost with Dax
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Where I've been recently</h2>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 32 }}>
          A rolling collection of the trips I'm writing and filming about right now.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {LATEST.map((j, i) => <JourneyCard key={i} j={j} idx={i} />)}
        </div>
      </section>

      {/* SECTION 5 — Passport Pieces archive */}
      <PassportPieces />

      {/* SECTION 6 — Work with Dax */}
      <WorkWithDax />

      {/* ── MOBILE PREVIEW STRIP ─────────────────────────────────────────── */}
      <section style={{ background: '#03050D', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#374151', marginBottom: 24, textAlign: 'center' }}>
            Mobile layout preview
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Mobile hero */}
            <div style={{ width: 390, borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
              <MobileHero />
            </div>
            {/* Mobile chapter rail */}
            <div style={{ width: 390, borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)', background: '#070b12', flexShrink: 0, padding: '24px 16px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#22D3EE', marginBottom: 4 }}>Trip Chapters</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Every destination, documented.</p>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {TRIPS.map((t, i) => (
                  <div key={t.id} style={{ flexShrink: 0, width: 140, height: 196, borderRadius: 12, overflow: 'hidden', position: 'relative', border: i === 0 ? `2px solid ${t.accent}` : '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: t.cover }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 8px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 8, color: t.accent, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t.coords}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 2 }}>{t.title}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', position: 'relative', background: TRIPS[0].photos[0].g }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 999, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
