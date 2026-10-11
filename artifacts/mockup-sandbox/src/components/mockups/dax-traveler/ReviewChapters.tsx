import React, { useState, useEffect } from 'react';

const PHOTOS = {
  cubaClassicCar: 'linear-gradient(160deg,#7C3A1E 0%,#B85A2A 35%,#D4824A 60%,#8B4513 100%)',
  cubaVieja:      'linear-gradient(140deg,#4A6741 0%,#7A8B5A 30%,#C4A882 60%,#8B7355 100%)',
  cubaStreet:     'linear-gradient(155deg,#3D5A7A 0%,#6B8FAB 40%,#A89070 70%,#5C4A3A 100%)',
  prStreet:       'linear-gradient(150deg,#2E5BA8 0%,#4A7FC1 25%,#E8854A 55%,#C45A2A 85%,#1E3D6B 100%)',
  prBeach:        'linear-gradient(160deg,#1B4A8A 0%,#2E7ABF 30%,#5BB8D4 55%,#A8D8E8 75%,#7DBDD4 100%)',
  prElMorro:      'linear-gradient(145deg,#3A7A3A 0%,#5CAD5C 35%,#88C870 60%,#B8D890 80%,#4A8A4A 100%)',
  atlCamera:      'linear-gradient(155deg,#1A1A2E 0%,#16213E 35%,#0F3460 60%,#533483 85%,#E94560 100%)',
  atlPacking:     'linear-gradient(145deg,#2C2C54 0%,#474787 35%,#AAABB8 65%,#8888AA 100%)',
};

const TRIPS = [
  { id:'cuba', title:'Havana, Cuba',  year:'2024', coords:'23.1° N, 82.4° W', flag:'🇨🇺', accent:'#F59E0B',
    tagline:'Classic cars, casas, and the best mojito of my life.', cover:PHOTOS.cubaClassicCar, coverLabel:'Havana Classic Car',
    photos:[{g:PHOTOS.cubaClassicCar,l:'Havana Classic Car'},{g:PHOTOS.cubaVieja,l:'Havana Vieja Facade'},{g:PHOTOS.cubaStreet,l:'Havana Street B-Roll'}] },
  { id:'pr',  title:'Puerto Rico',    year:'2024', coords:'18.2° N, 66.6° W', flag:'🇵🇷', accent:'#22D3EE',
    tagline:'Old San Juan, El Morro, and a zipline I almost said no to.', cover:PHOTOS.prStreet, coverLabel:'Old San Juan Street',
    photos:[{g:PHOTOS.prStreet,l:'Old San Juan Street'},{g:PHOTOS.prBeach,l:'Condado Beach Morning'},{g:PHOTOS.prElMorro,l:'El Morro Kite'}] },
  { id:'atl', title:'Atlanta, GA',    year:'2024', coords:'33.7° N, 84.4° W', flag:'🇺🇸', accent:'#A78BFA',
    tagline:'Home base. Gear packed. Always ready for the next departure.', cover:PHOTOS.atlCamera, coverLabel:'Camera Bag & Gear',
    photos:[{g:PHOTOS.atlCamera,l:'Camera Bag & Gear'},{g:PHOTOS.atlPacking,l:'Packing Flatlay'}] },
];

export function ReviewChapters() {
  const [activeId, setActiveId] = useState('cuba');
  const [photoIdx, setPhotoIdx] = useState(0);
  const trip = TRIPS.find(t => t.id === activeId)!;
  useEffect(() => { setPhotoIdx(0); }, [activeId]);

  return (
    <div style={{ background:'#050810', minHeight:'100vh', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", padding:'32px 40px', color:'#fff' }}>
      <div style={{ marginBottom:20 }}>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151', marginBottom:4 }}>Section 3 — Trip Chapter Rail</p>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:2 }}>Click a card → photo viewer expands below · ‹ › to navigate · dot nav</h2>
        <p style={{ fontSize:11, color:'#4B5563' }}>Active card scales up + accent glow + radial highlight · 3D tilt on hover</p>
      </div>

      <div style={{ background:'#070b12', borderRadius:18, border:'1px solid rgba(255,255,255,0.05)', overflow:'hidden' }}>
        <div style={{ padding:'24px 24px 18px' }}>
          <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#22D3EE', marginBottom:3 }}>Trip Chapters</p>
          <h3 style={{ fontSize:20, fontWeight:700, color:'#fff', marginBottom:16 }}>Every destination, documented.</h3>

          {/* Card rail */}
          <div style={{ display:'flex', gap:14, paddingBottom:6 }}>
            {TRIPS.map(t => {
              const isActive = t.id === activeId;
              return (
                <button key={t.id} onClick={() => setActiveId(t.id)} style={{
                  flexShrink:0, width:190, height:268, borderRadius:14, overflow:'hidden', border:'none', cursor:'pointer', position:'relative',
                  outline: isActive ? `2px solid ${t.accent}` : '2px solid rgba(255,255,255,0.07)', outlineOffset:2,
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  transition:'all 0.2s ease',
                  boxShadow: isActive ? `0 0 28px ${t.accent}28, 0 8px 32px rgba(0,0,0,0.5)` : '0 4px 16px rgba(0,0,0,0.4)',
                }}>
                  <div style={{ position:'absolute', inset:0, background:t.cover }}/>
                  {isActive && <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 55% 20%, ${t.accent}28 0%, transparent 65%)` }}/>}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 50%)' }}/>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 12px 10px' }}>
                    <div style={{ fontFamily:'monospace', fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:t.accent }}>{t.coords}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginTop:3, lineHeight:1.3 }}>{t.title}</div>
                    <div style={{ fontFamily:'monospace', fontSize:8, color:'#6B7280', marginTop:2 }}>{t.year}</div>
                    <p style={{ fontSize:10, color:'#9CA3AF', lineHeight:1.5, marginTop:5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2 as unknown as string, WebkitBoxOrient:'vertical' as const }}>{t.tagline}</p>
                  </div>
                  <div style={{ position:'absolute', top:8, right:8, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:4 }}>{t.flag} {t.coverLabel}</div>
                </button>
              );
            })}
            <div style={{ flexShrink:0, display:'flex', alignItems:'center', color:'#374151', fontSize:11, fontStyle:'italic', padding:'0 8px' }}>← swipe on mobile</div>
          </div>
        </div>

        {/* Expanded viewer */}
        <div key={activeId} style={{ padding:'0 24px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, animation:'fadeUp 0.3s ease-out' }}>
          {/* Main photo */}
          <div style={{ position:'relative', borderRadius:14, overflow:'hidden', aspectRatio:'4/3', background:'#111' }}>
            <div key={`${trip.id}-${photoIdx}`} style={{ position:'absolute', inset:0, background:trip.photos[photoIdx].g, animation:'fadeIn 0.35s ease-out' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 50%)' }}/>
            <div style={{ position:'absolute', top:10, left:10, fontFamily:'monospace', fontSize:8, color:'rgba(255,255,255,0.5)', background:'rgba(0,0,0,0.4)', padding:'3px 7px', borderRadius:5, backdropFilter:'blur(4px)' }}>{trip.coords}</div>
            <div style={{ position:'absolute', bottom:10, right:10, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.35)', background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:4 }}>{trip.photos[photoIdx].l}</div>
            {/* Dot nav */}
            <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4 }}>
              {trip.photos.map((_,i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{ width:i===photoIdx?20:6, height:6, borderRadius:999, background:i===photoIdx?'#fff':'rgba(255,255,255,0.3)', border:'none', cursor:'pointer', padding:0, transition:'width 0.2s' }}/>
              ))}
            </div>
            {/* Arrows */}
            {trip.photos.length > 1 && (<>
              <button onClick={() => setPhotoIdx(i => (i-1+trip.photos.length)%trip.photos.length)} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.55)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color:'#fff', fontSize:15, backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
              <button onClick={() => setPhotoIdx(i => (i+1)%trip.photos.length)} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.55)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color:'#fff', fontSize:15, backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
            </>)}
          </div>

          {/* Right col */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {trip.photos.map((p,i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{ borderRadius:9, overflow:'hidden', border:'none', cursor:'pointer', padding:0, aspectRatio:'1', outline:i===photoIdx?`2px solid ${trip.accent}`:'none', outlineOffset:1, opacity:i===photoIdx?1:0.5, transition:'opacity 0.2s, outline 0.2s', position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, background:p.g }}/>
                </button>
              ))}
            </div>
            <div style={{ flex:1, background:'rgba(255,255,255,0.03)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', padding:'16px 18px', display:'flex', flexDirection:'column', justifyContent:'center', gap:8 }}>
              <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:trip.accent }}>{trip.flag} {trip.title} — {trip.year}</div>
              <p style={{ fontSize:12, color:'#D1D5DB', lineHeight:1.75, margin:0 }}>{trip.tagline}</p>
              <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:2 }}>
                <div style={{ height:1, flex:1, background:`linear-gradient(to right, ${trip.accent}44, transparent)` }}/>
                <span style={{ fontFamily:'monospace', fontSize:8, color:'#4B5563' }}>{trip.photos.length} PHOTOS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
