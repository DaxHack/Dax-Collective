/**
 * ConceptSections — review-mode render of all non-hero sections.
 * Used for screenshot capture only. No 92vh constraints; everything visible.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';

const PHOTOS = {
  cubaClassicCar:  'linear-gradient(160deg, #7C3A1E 0%, #B85A2A 35%, #D4824A 60%, #8B4513 100%)',
  cubaVieja:       'linear-gradient(140deg, #4A6741 0%, #7A8B5A 30%, #C4A882 60%, #8B7355 100%)',
  cubaStreet:      'linear-gradient(155deg, #3D5A7A 0%, #6B8FAB 40%, #A89070 70%, #5C4A3A 100%)',
  prStreet:        'linear-gradient(150deg, #2E5BA8 0%, #4A7FC1 25%, #E8854A 55%, #C45A2A 85%, #1E3D6B 100%)',
  prBeach:         'linear-gradient(160deg, #1B4A8A 0%, #2E7ABF 30%, #5BB8D4 55%, #A8D8E8 75%, #7DBDD4 100%)',
  prElMorro:       'linear-gradient(145deg, #3A7A3A 0%, #5CAD5C 35%, #88C870 60%, #B8D890 80%, #4A8A4A 100%)',
  prZipline:       'linear-gradient(150deg, #1A4A1A 0%, #2D6B2D 30%, #4A8A3A 55%, #6AAA5A 75%, #88C878 100%)',
  atlCamera:       'linear-gradient(155deg, #1A1A2E 0%, #16213E 35%, #0F3460 60%, #533483 85%, #E94560 100%)',
  atlPacking:      'linear-gradient(145deg, #2C2C54 0%, #474787 35%, #AAABB8 65%, #8888AA 100%)',
  storyBlackShirt: 'linear-gradient(160deg, #1A1A1A 0%, #2D2D2D 40%, #3A3A3A 70%, #1A1A1A 100%)',
};

const TRIPS = [
  { id: 'cuba', title: 'Havana, Cuba',   year: '2024', coords: '23.1° N, 82.4° W', flag: '🇨🇺', accent: '#F59E0B',
    tagline: 'Classic cars, casas, and the best mojito of my life.',
    cover: PHOTOS.cubaClassicCar, coverLabel: 'Havana Classic Car',
    photos: [
      { g: PHOTOS.cubaClassicCar, l: 'Havana Classic Car' },
      { g: PHOTOS.cubaVieja,      l: 'Havana Vieja Facade' },
      { g: PHOTOS.cubaStreet,     l: 'Havana Street B-Roll' },
    ],
  },
  { id: 'pr', title: 'Puerto Rico',      year: '2024', coords: '18.2° N, 66.6° W', flag: '🇵🇷', accent: '#22D3EE',
    tagline: 'Old San Juan, El Morro, and a zipline I almost said no to.',
    cover: PHOTOS.prStreet, coverLabel: 'Old San Juan Street',
    photos: [
      { g: PHOTOS.prStreet,  l: 'Old San Juan Street' },
      { g: PHOTOS.prBeach,   l: 'Condado Beach Morning' },
      { g: PHOTOS.prElMorro, l: 'El Morro Kite' },
    ],
  },
  { id: 'atl', title: 'Atlanta, GA',     year: '2024', coords: '33.7° N, 84.4° W', flag: '🇺🇸', accent: '#A78BFA',
    tagline: 'Home base. Gear packed. Always ready for the next departure.',
    cover: PHOTOS.atlCamera, coverLabel: 'Camera Bag & Gear',
    photos: [
      { g: PHOTOS.atlCamera,  l: 'Camera Bag & Gear' },
      { g: PHOTOS.atlPacking, l: 'Packing Flatlay' },
    ],
  },
];

const LATEST = [
  { title: 'Old San Juan: Color, Salt, and Silence', location: 'Puerto Rico',
    hook: 'A solo walk through cobblestone streets that taught me how to slow down on the road.',
    tags: ['solo trip', 'culture'], grad: PHOTOS.prStreet, imgLabel: 'Old San Juan Street' },
  { title: 'Above the Canopy: My First Zipline', location: 'Toro Verde',
    hook: 'I am terrified of heights. I went anyway. 90 seconds airborne.',
    tags: ['adventure', 'first time'], grad: PHOTOS.prZipline, imgLabel: 'Toro Verde Zipline' },
  { title: 'Cuba on a Budget: $40 a Day', location: 'Havana',
    hook: 'No tourist traps, no resorts. Classic cars, casas, and the best mojito of my life.',
    tags: ['budget', 'food'], grad: PHOTOS.cubaClassicCar, imgLabel: 'Havana Classic Car' },
];

const ARCHIVE = [
  { year: '2024', destination: 'Puerto Rico',       count: 3, grad: PHOTOS.prBeach,         label: 'Condado Beach' },
  { year: '2024', destination: 'Cuba',              count: 2, grad: PHOTOS.cubaVieja,        label: 'Havana Vieja' },
  { year: '2024', destination: 'Atlanta Day Trips', count: 6, grad: PHOTOS.atlCamera,        label: 'Atlanta Gear' },
  { year: '2023', destination: 'East Coast',        count: 4, grad: PHOTOS.storyBlackShirt,  label: 'East Coast' },
];

const TAG_COLOR: Record<string, string> = {
  'solo trip': '#22D3EE', 'budget': '#34D399', 'food': '#F59E0B',
  'adventure': '#FB923C', 'first time': '#A78BFA', 'culture': '#F472B6',
};

const ROUTE = [
  { code: 'ATL', label: 'Atlanta',  x: 80,  y: 72 },
  { code: 'HAV', label: 'Havana',   x: 345, y: 82 },
  { code: 'SJU', label: 'San Juan', x: 620, y: 64 },
];

function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({ y: ((e.clientX-(r.left+r.width/2))/r.width)*strength, x: -((e.clientY-(r.top+r.height/2))/r.height)*(strength*.7), gx: ((e.clientX-r.left)/r.width)*100, gy: ((e.clientY-r.top)/r.height)*100 });
  }, [strength]);
  const onLeave = useCallback(() => setT({ x:0, y:0, gx:50, gy:50 }), []);
  return { ref, t, onMove, onLeave };
}

// ── SECTION LABEL ─────────────────────────────────────────────────────────────
function SectionLabel({ n, name }: { n: string; name: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, paddingTop:4 }}>
      <div style={{ width:22, height:22, borderRadius:6, background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontFamily:'monospace', color:'#22D3EE', fontWeight:700 }}>{n}</div>
      <span style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151' }}>{name}</span>
    </div>
  );
}

// ── ROUTE SVG ─────────────────────────────────────────────────────────────────
function RouteSection() {
  const [progress, setProgress] = useState(0);
  const [vis, setVis] = useState([false,false,false]);
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + 0.015, 1);
      setProgress(p);
      setVis([p > 0.05, p > 0.42, p > 0.82]);
      if (p >= 1) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, []);
  const pathLen = 620;
  return (
    <div style={{ background:'#06091a', padding:'36px 48px 28px', borderRadius:20, border:'1px solid rgba(255,255,255,0.05)' }}>
      <p style={{ textAlign:'center', fontFamily:'monospace', fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:'#374151', marginBottom:18 }}>
        Animated route — draws on load
      </p>
      <svg viewBox="0 0 700 110" style={{ width:'100%', maxWidth:700, display:'block', margin:'0 auto' }} fill="none">
        <defs>
          <linearGradient id="rg3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA"/>
            <stop offset="50%" stopColor="#F59E0B"/>
            <stop offset="100%" stopColor="#22D3EE"/>
          </linearGradient>
        </defs>
        <path d="M 80 72 C 185 34, 270 108, 345 82 C 420 56, 530 44, 620 64" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="5 4"/>
        <path d="M 80 72 C 185 34, 270 108, 345 82 C 420 56, 530 44, 620 64"
          stroke="url(#rg3)" strokeWidth="1.8"
          strokeDasharray={String(pathLen)} strokeDashoffset={pathLen*(1-progress)}
          style={{ transition:'none' }}
        />
        {ROUTE.map((s,i) => {
          const colors=['#A78BFA','#F59E0B','#22D3EE'];
          return (
            <g key={s.code} style={{ opacity:vis[i]?1:0, transition:'opacity 0.5s ease' }}>
              <circle cx={s.x} cy={s.y} r={14} fill={colors[i]} fillOpacity={0.12}/>
              <circle cx={s.x} cy={s.y} r={5.5} fill={colors[i]}/>
              <text x={s.x} y={s.y-18} fill="white" fontSize={10} fontWeight="700" textAnchor="middle" fontFamily="monospace">{s.code}</text>
              <text x={s.x} y={s.y+24} fill="#6B7280" fontSize={9} textAnchor="middle">{s.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── TRIP CHAPTER RAIL ─────────────────────────────────────────────────────────
function ChapterRail() {
  const [activeId, setActiveId] = useState('cuba');
  const [photoIdx, setPhotoIdx] = useState(0);
  const trip = TRIPS.find(t => t.id === activeId)!;
  useEffect(() => { setPhotoIdx(0); }, [activeId]);

  return (
    <div style={{ background:'rgba(7,11,18,1)', borderRadius:20, border:'1px solid rgba(255,255,255,0.05)', overflow:'hidden' }}>
      <div style={{ padding:'28px 28px 20px' }}>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#22D3EE', marginBottom:4 }}>Trip Chapters</p>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>Every destination, documented.</h2>
        <p style={{ fontSize:12, color:'#6B7280', marginBottom:20 }}>Select a chapter — photos expand below</p>

        {/* Card rail */}
        <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:8, scrollbarWidth:'none' }}>
          {TRIPS.map(t => {
            const isActive = t.id === activeId;
            return (
              <button key={t.id} onClick={() => setActiveId(t.id)} style={{
                flexShrink:0, width:180, height:256, borderRadius:14, overflow:'hidden', border:'none',
                cursor:'pointer', position:'relative',
                outline: isActive ? `2px solid ${t.accent}` : '2px solid rgba(255,255,255,0.07)',
                outlineOffset:2,
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                transition:'outline 0.2s, transform 0.2s, box-shadow 0.2s',
                boxShadow: isActive ? `0 0 28px ${t.accent}28, 0 8px 32px rgba(0,0,0,0.5)` : '0 4px 16px rgba(0,0,0,0.4)',
              }}>
                <div style={{ position:'absolute', inset:0, background:t.cover }}/>
                {isActive && <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 55% 20%, ${t.accent}22 0%, transparent 65%)` }}/>}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 50%)' }}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 12px 10px' }}>
                  <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:t.accent }}>{t.coords}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginTop:3, lineHeight:1.3 }}>{t.title}</div>
                  <div style={{ fontFamily:'monospace', fontSize:8, color:'#6B7280', marginTop:2 }}>{t.year}</div>
                </div>
                <div style={{ position:'absolute', top:8, right:8, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:4 }}>
                  {t.flag} {t.coverLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded viewer */}
      <div key={activeId} style={{ padding:'0 28px 28px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, animation:'fadeUp 0.3s ease-out' }}>
        {/* Main photo */}
        <div style={{ position:'relative', borderRadius:14, overflow:'hidden', aspectRatio:'4/3', background:'#111' }}>
          <div key={`${trip.id}-${photoIdx}`} style={{ position:'absolute', inset:0, background:trip.photos[photoIdx].g, animation:'fadeIn 0.35s ease-out' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 50%)' }}/>
          <div style={{ position:'absolute', top:10, left:10, fontFamily:'monospace', fontSize:8, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', background:'rgba(0,0,0,0.4)', padding:'3px 7px', borderRadius:5, backdropFilter:'blur(4px)' }}>{trip.coords}</div>
          <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4 }}>
            {trip.photos.map((_,i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} style={{ width:i===photoIdx?20:6, height:6, borderRadius:999, background:i===photoIdx?'#fff':'rgba(255,255,255,0.3)', border:'none', cursor:'pointer', padding:0, transition:'width 0.2s, background 0.2s' }}/>
            ))}
          </div>
          <div style={{ position:'absolute', bottom:12, right:10, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.35)', background:'rgba(0,0,0,0.3)', padding:'2px 6px', borderRadius:4 }}>{trip.photos[photoIdx].l}</div>
          {trip.photos.length > 1 && (<>
            <button onClick={() => setPhotoIdx(i => (i-1+trip.photos.length)%trip.photos.length)} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.55)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color:'#fff', fontSize:15, backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
            <button onClick={() => setPhotoIdx(i => (i+1)%trip.photos.length)} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.55)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color:'#fff', fontSize:15, backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
          </>)}
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6 }}>
            {trip.photos.map((p,i) => (
              <button key={i} onClick={() => setPhotoIdx(i)} style={{ borderRadius:9, overflow:'hidden', border:'none', cursor:'pointer', padding:0, aspectRatio:'1', outline:i===photoIdx?`2px solid ${trip.accent}`:'none', outlineOffset:1, opacity:i===photoIdx?1:0.5, transition:'opacity 0.2s, outline 0.2s', position:'relative' }}>
                <div style={{ position:'absolute', inset:0, background:p.g }}/>
              </button>
            ))}
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.03)', borderRadius:12, border:`1px solid rgba(255,255,255,0.07)`, padding:'16px 18px', display:'flex', flexDirection:'column', justifyContent:'center', gap:8 }}>
            <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:trip.accent }}>{trip.flag} {trip.title} — {trip.year}</div>
            <p style={{ fontSize:12, color:'#D1D5DB', lineHeight:1.75, margin:0 }}>{trip.tagline}</p>
            <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:2 }}>
              <div style={{ height:1, flex:1, background:`linear-gradient(to right, ${trip.accent}44, transparent)` }}/>
              <span style={{ fontFamily:'monospace', fontSize:8, color:'#4B5563', letterSpacing:'0.1em' }}>{trip.photos.length} PHOTOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── JOURNEY CARDS ─────────────────────────────────────────────────────────────
function JourneyCards() {
  return (
    <div>
      <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#22D3EE', marginBottom:4 }}>Wanderlost with Dax</p>
      <h2 style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>Where I've been recently</h2>
      <p style={{ fontSize:12, color:'#6B7280', marginBottom:20 }}>A rolling collection of the trips I'm writing and filming about right now.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
        {LATEST.map((j,i) => {
          const [hov, setHov] = useState(false);
          const { ref, t, onMove, onLeave } = useTilt(9);
          return (
            <div key={i} ref={ref} onMouseMove={onMove} onMouseLeave={() => { onLeave(); setHov(false); }} onMouseEnter={() => setHov(true)}
              style={{ borderRadius:20, overflow:'hidden', background:'rgba(17,24,39,0.65)', border:`1px solid ${hov?'rgba(34,211,238,0.22)':'rgba(255,255,255,0.07)'}`, transform:`perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg)`, transition:'transform 0.1s ease-out, border-color 0.25s', cursor:'pointer' }}>
              <div style={{ position:'relative', aspectRatio:'4/3', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, background:j.grad, transform:`scale(${hov?1.06:1})`, transition:'transform 0.5s' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}/>
                <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`, pointerEvents:'none' }}/>
                <div style={{ position:'absolute', top:10, left:10, display:'flex', alignItems:'center', gap:4, background:'rgba(0,0,0,0.45)', borderRadius:999, padding:'3px 10px', backdropFilter:'blur(4px)' }}>
                  <span style={{ fontSize:9 }}>📍</span>
                  <span style={{ fontSize:10, color:'#fff', fontWeight:500 }}>{j.location}</span>
                </div>
                <div style={{ position:'absolute', bottom:8, right:8, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:4 }}>{j.imgLabel}</div>
              </div>
              <div style={{ padding:'16px 18px 18px' }}>
                <h3 style={{ fontSize:14, fontWeight:600, color:'#fff', margin:'0 0 6px', lineHeight:1.4 }}>{j.title}</h3>
                <p style={{ fontSize:11, color:'#9CA3AF', lineHeight:1.65, margin:'0 0 12px' }}>{j.hook}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
                  {j.tags.map(tag => (
                    <span key={tag} style={{ fontSize:9, fontWeight:500, borderRadius:999, padding:'2px 8px', color:TAG_COLOR[tag]??'#9CA3AF', background:`${TAG_COLOR[tag]??'#6B7280'}18`, border:`1px solid ${TAG_COLOR[tag]??'#6B7280'}44` }}>{tag}</span>
                  ))}
                </div>
                <span style={{ fontSize:11, fontWeight:500, color:'#22D3EE', display:'flex', alignItems:'center', gap:3 }}>Read the story →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PASSPORT PIECES ───────────────────────────────────────────────────────────
function PassportPieces() {
  const [hov, setHov] = useState<number|null>(null);
  return (
    <div style={{ background:'rgba(17,24,39,0.4)', borderRadius:20, border:'1px solid rgba(255,255,255,0.05)', padding:'28px' }}>
      <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#22D3EE', marginBottom:4 }}>Passport Pieces</p>
      <h2 style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>Every trip, organized</h2>
      <p style={{ fontSize:12, color:'#6B7280', marginBottom:20 }}>A growing index of every destination I've documented.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
        {ARCHIVE.map((a,i) => (
          <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ position:'relative', aspectRatio:'3/4', borderRadius:14, overflow:'hidden', cursor:'pointer', transform:hov===i?'translateY(-5px)':'none', transition:'transform 0.25s, box-shadow 0.25s', boxShadow:hov===i?'0 16px 40px rgba(0,0,0,0.5)':'0 4px 16px rgba(0,0,0,0.3)', border:`1px solid ${hov===i?'rgba(34,211,238,0.2)':'rgba(255,255,255,0.06)'}` }}>
            <div style={{ position:'absolute', inset:0, background:a.grad, transform:hov===i?'scale(1.07)':'scale(1)', transition:'transform 0.5s' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }}/>
            {hov===i && <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)', pointerEvents:'none' }}/>}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 12px 10px' }}>
              <div style={{ fontSize:10, color:'#22D3EE', fontWeight:500, marginBottom:2 }}>{a.year}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.25 }}>{a.destination}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>{a.count} stories</div>
            </div>
            <div style={{ position:'absolute', top:8, right:8, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:4 }}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MOBILE PREVIEW ────────────────────────────────────────────────────────────
function MobilePreview() {
  return (
    <div>
      <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#374151', marginBottom:20, textAlign:'center' }}>
        Mobile layout preview (390px)
      </p>
      <div style={{ display:'flex', gap:28, justifyContent:'center', flexWrap:'wrap', alignItems:'flex-start' }}>
        {/* Mobile Hero */}
        <div style={{ width:390, flexShrink:0 }}>
          <p style={{ fontSize:10, color:'#4B5563', marginBottom:8, textAlign:'center', fontFamily:'monospace' }}>Mobile Hero</p>
          <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 50px rgba(0,0,0,0.65)' }}>
            <div style={{ position:'relative', height:500, background:'#050810' }}>
              <div style={{ position:'absolute', inset:0, background:PHOTOS.cubaVieja, opacity:.45 }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.5) 0%, rgba(5,8,16,0.1) 40%, rgba(5,8,16,0.97) 100%)' }}/>
              <div style={{ position:'absolute', bottom:0, right:0, height:'72%', width:'52%' }}>
                <div style={{ position:'absolute', inset:0, background:PHOTOS.prStreet, opacity:.85 }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left, transparent, rgba(5,8,16,0.72) 100%)' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.35), transparent 40%, rgba(5,8,16,1) 100%)' }}/>
              </div>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-end', padding:'0 24px 48px' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.07)', borderRadius:999, padding:'4px 12px', fontSize:10, color:'#22D3EE', border:'1px solid rgba(34,211,238,0.2)', marginBottom:14 }}>🌍 Real trips. Honest stories.</div>
                <h1 style={{ fontSize:44, fontWeight:800, lineHeight:1.05, letterSpacing:'-0.02em', color:'#fff', margin:'0 0 12px' }}>Dax the<br/><span style={{ color:'#22D3EE' }}>Traveler</span></h1>
                <p style={{ fontSize:12, color:'#D1D5DB', lineHeight:1.7, marginBottom:18, maxWidth:260 }}>Real trips. Honest stories I wish someone had told me first.</p>
                <div style={{ display:'flex', gap:10 }}>
                  <span style={{ background:'#22D3EE', color:'#030712', borderRadius:999, padding:'10px 20px', fontWeight:700, fontSize:12 }}>See the trips →</span>
                  <span style={{ background:'rgba(255,255,255,0.07)', color:'#fff', borderRadius:999, padding:'10px 20px', fontSize:12, border:'1px solid rgba(255,255,255,0.18)' }}>Why I Travel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Chapter Rail */}
        <div style={{ width:390, flexShrink:0 }}>
          <p style={{ fontSize:10, color:'#4B5563', marginBottom:8, textAlign:'center', fontFamily:'monospace' }}>Mobile Chapter Rail</p>
          <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 50px rgba(0,0,0,0.65)', background:'#070b12', padding:'20px 16px' }}>
            <p style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#22D3EE', marginBottom:3 }}>Trip Chapters</p>
            <p style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:12 }}>Every destination, documented.</p>
            <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:6, scrollbarWidth:'none' }}>
              {TRIPS.map((t,i) => (
                <div key={t.id} style={{ flexShrink:0, width:130, height:180, borderRadius:12, overflow:'hidden', position:'relative', outline:i===0?`2px solid ${t.accent}`:'1px solid rgba(255,255,255,0.07)', outlineOffset:i===0?1:0 }}>
                  <div style={{ position:'absolute', inset:0, background:t.cover }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }}/>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px 8px 6px' }}>
                    <div style={{ fontFamily:'monospace', fontSize:7, color:t.accent, textTransform:'uppercase', letterSpacing:'0.12em' }}>{t.coords}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#fff', marginTop:2 }}>{t.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, borderRadius:12, overflow:'hidden', aspectRatio:'16/9', position:'relative', background:TRIPS[0].photos[0].g }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }}/>
              <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:i===0?18:6, height:6, borderRadius:999, background:i===0?'#fff':'rgba(255,255,255,0.3)' }}/>)}
              </div>
            </div>
            <p style={{ fontSize:11, color:'#6B7280', marginTop:10, padding:'10px 0 2px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              🇨🇺 Cuba — 2024 · <em style={{ color:'#9CA3AF' }}>Classic cars, casas, and the best mojito of my life.</em>
            </p>
          </div>
        </div>

        {/* Mobile Archive */}
        <div style={{ width:390, flexShrink:0 }}>
          <p style={{ fontSize:10, color:'#4B5563', marginBottom:8, textAlign:'center', fontFamily:'monospace' }}>Mobile Passport Pieces</p>
          <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 50px rgba(0,0,0,0.65)', background:'rgba(17,24,39,0.4)', padding:'20px 16px' }}>
            <p style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#22D3EE', marginBottom:3 }}>Passport Pieces</p>
            <p style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:12 }}>Every trip, organized</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {ARCHIVE.map((a,i) => (
                <div key={i} style={{ position:'relative', aspectRatio:'3/4', borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ position:'absolute', inset:0, background:a.grad }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }}/>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 10px 8px' }}>
                    <div style={{ fontSize:9, color:'#22D3EE', fontWeight:500, marginBottom:2 }}>{a.year}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{a.destination}</div>
                    <div style={{ fontSize:9, color:'#6B7280', marginTop:1 }}>{a.count} stories</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WORK WITH DAX ─────────────────────────────────────────────────────────────
function WorkWithDax() {
  return (
    <div style={{ background:'rgba(6,9,26,1)', borderRadius:20, border:'1px solid rgba(255,255,255,0.05)', padding:'48px 40px', textAlign:'center' }}>
      <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:'#F59E0B', marginBottom:14 }}>Work With Dax</p>
      <h2 style={{ fontSize:28, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:16 }}>You travel.<br/><span style={{ color:'#22D3EE' }}>I tell the story.</span></h2>
      <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.8, marginBottom:28, maxWidth:500, margin:'0 auto 28px' }}>
        If your destination, brand, or experience belongs in an honest travel story — not a paid listicle — reach out. No guaranteed coverage. Just a real conversation.
      </p>
      <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#22D3EE', color:'#030712', borderRadius:999, padding:'12px 26px', fontWeight:700, fontSize:13, cursor:'pointer' }}>✉ Get in touch</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.05)', color:'#fff', borderRadius:999, padding:'12px 26px', fontSize:13, border:'1px solid rgba(255,255,255,0.14)', cursor:'pointer' }}>📋 What I cover</span>
      </div>
    </div>
  );
}

// ── HERO MINI PREVIEW ─────────────────────────────────────────────────────────
function HeroPreview() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:'relative', height:480, overflow:'hidden', background:'#050810', borderRadius:20, border:'1px solid rgba(255,255,255,0.06)' }}>
      {/* BG layer */}
      <div style={{ position:'absolute', inset:0, background:PHOTOS.cubaVieja, opacity:.46 }}/>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.55) 0%, rgba(5,8,16,0.15) 40%, rgba(5,8,16,0.96) 100%)' }}/>
      {/* Mid panel */}
      <div style={{ position:'absolute', bottom:0, right:0, height:'88%', width:'60%' }}>
        <div style={{ position:'absolute', inset:0, background:PHOTOS.prStreet }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left, transparent, rgba(5,8,16,0.22) 40%, rgba(5,8,16,0.86) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.46) 0%, transparent 35%, rgba(5,8,16,1) 100%)' }}/>
      </div>
      {/* FG card */}
      <div style={{ position:'absolute', bottom:'9%', left:32, height:'44%', width:'26%', overflow:'hidden', borderRadius:16, boxShadow:'0 20px 50px rgba(0,0,0,0.6)', border:'1px solid rgba(245,158,11,0.28)', minWidth:100 }}>
        <div style={{ position:'absolute', inset:0, background:PHOTOS.cubaClassicCar }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)' }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px 12px', fontFamily:'monospace', fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:'#F59E0B' }}>Havana, Cuba — 2024</div>
      </div>
      {/* Glows */}
      <div style={{ position:'absolute', top:'32%', left:'38%', width:280, height:280, borderRadius:'50%', background:'rgba(34,211,238,0.055)', filter:'blur(80px)', pointerEvents:'none' }}/>
      {/* Text */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-end', padding:'0 44px 80px', opacity:mounted?1:0, transform:mounted?'none':'translateX(-18px)', transition:'opacity 0.9s ease, transform 0.9s ease' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.07)', borderRadius:999, padding:'5px 14px', fontSize:11, color:'#22D3EE', border:'1px solid rgba(34,211,238,0.2)', marginBottom:18, backdropFilter:'blur(6px)' }}>🌍 Real trips. Honest stories.</div>
        <h1 style={{ fontSize:'clamp(48px, 6vw, 80px)', fontWeight:800, lineHeight:1.03, letterSpacing:'-0.02em', color:'#fff', margin:'0 0 16px' }}>Dax the<br/><span style={{ color:'#22D3EE' }}>Traveler</span></h1>
        <p style={{ fontSize:14, color:'#D1D5DB', lineHeight:1.72, maxWidth:420, marginBottom:14 }}>I travel to learn how other people live — honest stories I wish someone had told me before my first trip.</p>
        <div style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.16em', color:'#4B5563', marginBottom:24 }}>
          <span>ATL → HAV → SJU</span><span style={{ height:1, width:20, background:'#374151', display:'inline-block' }}/><span>2024 Archive</span>
        </div>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <span style={{ background:'#22D3EE', color:'#030712', borderRadius:999, padding:'12px 26px', fontWeight:700, fontSize:13, cursor:'pointer' }}>See the trips →</span>
          <span style={{ background:'rgba(255,255,255,0.07)', color:'#fff', borderRadius:999, padding:'12px 26px', fontSize:13, border:'1px solid rgba(255,255,255,0.18)', backdropFilter:'blur(6px)', cursor:'pointer' }}>Why I Travel</span>
        </div>
      </div>
      {/* Scroll nudge */}
      <div style={{ position:'absolute', bottom:22, left:'50%', transform:'translateX(-50%)', animation:'nudge 2s ease-in-out infinite' }}>
        <div style={{ width:1, height:28, background:'linear-gradient(to bottom, rgba(34,211,238,0.5), transparent)' }}/>
      </div>
      <style>{`@keyframes nudge{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function ConceptSections() {
  useEffect(() => {
    const y = Number(new URLSearchParams(window.location.search).get('y') ?? 0);
    if (y > 0) window.scrollTo({ top: y, behavior: 'instant' });
  }, []);
  return (
    <div style={{ background:'#050810', color:'#fff', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", padding:'32px', display:'flex', flexDirection:'column', gap:40 }}>

      {/* Hero preview */}
      <div>
        <SectionLabel n="1" name="Layered Hero — 3 parallax depths · scroll fades text" />
        <HeroPreview />
      </div>

      {/* Route */}
      <div>
        <SectionLabel n="2" name="Animated Route — SVG path draws ATL → HAV → SJU on mount" />
        <RouteSection />
      </div>

      {/* Chapter rail + expanded */}
      <div>
        <SectionLabel n="3" name="Trip Chapter Rail — click cards to expand · ‹ › prev/next · dot nav" />
        <ChapterRail />
      </div>

      {/* Journey cards */}
      <div>
        <SectionLabel n="4" name="Editorial Journey Cards — 3D tilt · glare sweep · hover zoom · tag pills" />
        <JourneyCards />
      </div>

      {/* Archive */}
      <div>
        <SectionLabel n="5" name="Passport Pieces Archive — portrait cards · lift + light sweep on hover" />
        <PassportPieces />
      </div>

      {/* Work with Dax */}
      <div>
        <SectionLabel n="6" name="Work With Dax — no fake sponsors · honest outreach copy" />
        <WorkWithDax />
      </div>

      {/* Mobile */}
      <div>
        <SectionLabel n="7" name="Mobile Layout — hero · chapter rail · archive at 390px" />
        <MobilePreview />
      </div>

    </div>
  );
}

export default ConceptSections;
