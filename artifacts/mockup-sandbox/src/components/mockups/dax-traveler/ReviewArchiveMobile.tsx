import React, { useState } from 'react';

const PHOTOS = {
  prBeach:        'linear-gradient(160deg,#1B4A8A 0%,#2E7ABF 30%,#5BB8D4 55%,#A8D8E8 75%,#7DBDD4 100%)',
  cubaVieja:      'linear-gradient(140deg,#4A6741 0%,#7A8B5A 30%,#C4A882 60%,#8B7355 100%)',
  atlCamera:      'linear-gradient(155deg,#1A1A2E 0%,#16213E 35%,#0F3460 60%,#533483 85%,#E94560 100%)',
  storyBlackShirt:'linear-gradient(160deg,#1A1A1A 0%,#2D2D2D 40%,#3A3A3A 70%,#1A1A1A 100%)',
  cubaClassicCar: 'linear-gradient(160deg,#7C3A1E 0%,#B85A2A 35%,#D4824A 60%,#8B4513 100%)',
  prStreet:       'linear-gradient(150deg,#2E5BA8 0%,#4A7FC1 25%,#E8854A 55%,#C45A2A 85%,#1E3D6B 100%)',
  cubaVieja2:     'linear-gradient(140deg,#4A6741 0%,#7A8B5A 30%,#C4A882 60%,#8B7355 100%)',
};

const ARCHIVE = [
  {year:'2024',destination:'Puerto Rico',      count:3, grad:PHOTOS.prBeach,        label:'Condado Beach'},
  {year:'2024',destination:'Cuba',             count:2, grad:PHOTOS.cubaVieja,       label:'Havana Vieja'},
  {year:'2024',destination:'Atlanta Day Trips',count:6, grad:PHOTOS.atlCamera,       label:'Atlanta Gear'},
  {year:'2023',destination:'East Coast',       count:4, grad:PHOTOS.storyBlackShirt, label:'East Coast'},
];

const TRIPS_MINI = [
  {id:'cuba',title:'Havana, Cuba',  year:'2024',coords:'23.1° N, 82.4° W',flag:'🇨🇺',accent:'#F59E0B',cover:PHOTOS.cubaClassicCar},
  {id:'pr',  title:'Puerto Rico',   year:'2024',coords:'18.2° N, 66.6° W',flag:'🇵🇷',accent:'#22D3EE',cover:PHOTOS.prStreet},
  {id:'atl', title:'Atlanta, GA',   year:'2024',coords:'33.7° N, 84.4° W',flag:'🇺🇸',accent:'#A78BFA',cover:PHOTOS.atlCamera},
];

export function ReviewArchiveMobile() {
  const [hov, setHov] = useState<number|null>(null);

  return (
    <div style={{ background:'#050810', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", padding:'32px 40px', color:'#fff' }}>

      {/* ── Section 5: Archive ── */}
      <div style={{ marginBottom:36 }}>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151', marginBottom:4 }}>Section 5 — Passport Pieces Archive</p>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:2 }}>Portrait cards · lift + light sweep on hover · scale on image</h2>
        <p style={{ fontSize:11, color:'#4B5563', marginBottom:20 }}>Hover a card to see translateY lift + image scale + subtle light sweep overlay</p>

        <div style={{ background:'rgba(17,24,39,0.4)', borderRadius:18, border:'1px solid rgba(255,255,255,0.05)', padding:'24px' }}>
          <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#22D3EE', marginBottom:4 }}>Passport Pieces</p>
          <h3 style={{ fontSize:20, fontWeight:700, color:'#fff', marginBottom:4 }}>Every trip, organized</h3>
          <p style={{ fontSize:12, color:'#6B7280', marginBottom:18 }}>A growing index of every destination I've documented.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {ARCHIVE.map((a,i) => (
              <div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
                style={{ position:'relative', aspectRatio:'3/4', borderRadius:14, overflow:'hidden', cursor:'pointer',
                  transform:hov===i?'translateY(-5px)':'translateY(0)', transition:'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                  boxShadow:hov===i?'0 16px 40px rgba(0,0,0,0.5)':'0 4px 16px rgba(0,0,0,0.3)',
                  border:`1px solid ${hov===i?'rgba(34,211,238,0.2)':'rgba(255,255,255,0.06)'}` }}>
                <div style={{ position:'absolute', inset:0, background:a.grad,
                  transform:hov===i?'scale(1.07)':'scale(1)', transition:'transform 0.5s' }}/>
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
      </div>

      {/* ── Section 6: Work With Dax ── */}
      <div style={{ marginBottom:36 }}>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151', marginBottom:4 }}>Section 6 — Work With Dax</p>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:2 }}>No fake sponsors · no fake partnerships · honest outreach copy</h2>
        <p style={{ fontSize:11, color:'#4B5563', marginBottom:16 }}>Premium feel without fabricated social proof</p>
        <div style={{ background:'rgba(6,9,26,1)', borderRadius:18, border:'1px solid rgba(255,255,255,0.05)', padding:'40px 40px', textAlign:'center' }}>
          <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:'#F59E0B', marginBottom:14 }}>Work With Dax</p>
          <h3 style={{ fontSize:28, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:14 }}>You travel.<br/><span style={{color:'#22D3EE'}}>I tell the story.</span></h3>
          <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.8, marginBottom:24, maxWidth:480, margin:'0 auto 24px' }}>
            If your destination, brand, or experience belongs in an honest travel story — not a paid listicle — reach out. No guaranteed coverage. Just a real conversation.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#22D3EE', color:'#030712', borderRadius:999, padding:'12px 26px', fontWeight:700, fontSize:13, cursor:'pointer' }}>✉ Get in touch</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.05)', color:'#fff', borderRadius:999, padding:'12px 26px', fontSize:13, border:'1px solid rgba(255,255,255,0.14)', cursor:'pointer' }}>📋 What I cover</span>
          </div>
        </div>
      </div>

      {/* ── Section 7: Mobile ── */}
      <div>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151', marginBottom:4 }}>Section 7 — Mobile Layout (390px containers)</p>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:16 }}>Hero · Chapter Rail · Archive at mobile breakpoint</h2>

        <div style={{ display:'flex', gap:24, flexWrap:'wrap', alignItems:'flex-start' }}>
          {/* Mobile hero */}
          <div style={{ flexShrink:0 }}>
            <p style={{ fontSize:10, color:'#4B5563', marginBottom:8, fontFamily:'monospace', textAlign:'center' }}>Mobile Hero</p>
            <div style={{ width:360, borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 50px rgba(0,0,0,0.65)' }}>
              <div style={{ position:'relative', height:480, background:'#050810' }}>
                <div style={{ position:'absolute', inset:0, background:PHOTOS.cubaVieja, opacity:.46 }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.52) 0%, rgba(5,8,16,0.12) 40%, rgba(5,8,16,0.97) 100%)' }}/>
                <div style={{ position:'absolute', bottom:0, right:0, height:'72%', width:'52%' }}>
                  <div style={{ position:'absolute', inset:0, background:PHOTOS.prStreet, opacity:.85 }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left, transparent, rgba(5,8,16,0.72) 100%)' }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,8,16,0.35), transparent 40%, rgba(5,8,16,1) 100%)' }}/>
                </div>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-end', padding:'0 22px 44px' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.07)', borderRadius:999, padding:'4px 12px', fontSize:10, color:'#22D3EE', border:'1px solid rgba(34,211,238,0.2)', marginBottom:14 }}>🌍 Real trips. Honest stories.</div>
                  <h1 style={{ fontSize:40, fontWeight:800, lineHeight:1.05, color:'#fff', margin:'0 0 10px' }}>Dax the<br/><span style={{color:'#22D3EE'}}>Traveler</span></h1>
                  <p style={{ fontSize:12, color:'#D1D5DB', lineHeight:1.7, marginBottom:16, maxWidth:240 }}>Real trips. Honest stories I wish someone had told me first.</p>
                  <div style={{ display:'flex', gap:10 }}>
                    <span style={{ background:'#22D3EE', color:'#030712', borderRadius:999, padding:'10px 18px', fontWeight:700, fontSize:11 }}>See the trips →</span>
                    <span style={{ background:'rgba(255,255,255,0.07)', color:'#fff', borderRadius:999, padding:'10px 18px', fontSize:11, border:'1px solid rgba(255,255,255,0.18)' }}>Why I Travel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile chapter rail */}
          <div style={{ flexShrink:0 }}>
            <p style={{ fontSize:10, color:'#4B5563', marginBottom:8, fontFamily:'monospace', textAlign:'center' }}>Mobile Chapter Rail</p>
            <div style={{ width:360, borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 50px rgba(0,0,0,0.65)', background:'#070b12', padding:'18px 14px' }}>
              <p style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.2em', color:'#22D3EE', marginBottom:3 }}>Trip Chapters</p>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:12 }}>Every destination, documented.</p>
              <div style={{ display:'flex', gap:9, overflowX:'auto', paddingBottom:6, scrollbarWidth:'none' }}>
                {TRIPS_MINI.map((t,i) => (
                  <div key={t.id} style={{ flexShrink:0, width:120, height:168, borderRadius:11, overflow:'hidden', position:'relative', outline:i===0?`2px solid ${t.accent}`:'1px solid rgba(255,255,255,0.07)', outlineOffset:i===0?1:0 }}>
                    <div style={{ position:'absolute', inset:0, background:t.cover }}/>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }}/>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'7px 8px 6px' }}>
                      <div style={{ fontFamily:'monospace', fontSize:7, color:t.accent, textTransform:'uppercase', letterSpacing:'0.12em' }}>{t.coords}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:'#fff', marginTop:2 }}>{t.title}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, borderRadius:11, overflow:'hidden', aspectRatio:'16/9', position:'relative', background:TRIPS_MINI[0].cover }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }}/>
                <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4 }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:i===0?16:5, height:5, borderRadius:999, background:i===0?'#fff':'rgba(255,255,255,0.3)' }}/>)}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile archive */}
          <div style={{ flexShrink:0 }}>
            <p style={{ fontSize:10, color:'#4B5563', marginBottom:8, fontFamily:'monospace', textAlign:'center' }}>Mobile Archive (2-col)</p>
            <div style={{ width:360, borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 50px rgba(0,0,0,0.65)', background:'rgba(17,24,39,0.4)', padding:'18px 14px' }}>
              <p style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.2em', color:'#22D3EE', marginBottom:3 }}>Passport Pieces</p>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:12 }}>Every trip, organized</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
                {ARCHIVE.map((a,i) => (
                  <div key={i} style={{ position:'relative', aspectRatio:'3/4', borderRadius:11, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ position:'absolute', inset:0, background:a.grad }}/>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }}/>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'9px 9px 7px' }}>
                      <div style={{ fontSize:9, color:'#22D3EE', fontWeight:500, marginBottom:1 }}>{a.year}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{a.destination}</div>
                      <div style={{ fontSize:9, color:'#6B7280', marginTop:1 }}>{a.count} stories</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
