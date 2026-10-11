import React, { useState, useRef, useCallback } from 'react';

const PHOTOS = {
  prStreet:  'linear-gradient(150deg,#2E5BA8 0%,#4A7FC1 25%,#E8854A 55%,#C45A2A 85%,#1E3D6B 100%)',
  prZipline: 'linear-gradient(150deg,#1A4A1A 0%,#2D6B2D 30%,#4A8A3A 55%,#6AAA5A 75%,#88C878 100%)',
  cubaClassicCar: 'linear-gradient(160deg,#7C3A1E 0%,#B85A2A 35%,#D4824A 60%,#8B4513 100%)',
};

const LATEST = [
  { title:'Old San Juan: Color, Salt, and Silence', location:'Puerto Rico',
    hook:'A solo walk through cobblestone streets that taught me how to slow down on the road.',
    tags:['solo trip','culture'], grad:PHOTOS.prStreet, imgLabel:'Old San Juan Street' },
  { title:'Above the Canopy: My First Zipline', location:'Toro Verde',
    hook:'I am terrified of heights. I went anyway. 90 seconds airborne changed that.',
    tags:['adventure','first time'], grad:PHOTOS.prZipline, imgLabel:'Toro Verde Zipline' },
  { title:'Cuba on a Budget: $40 a Day', location:'Havana',
    hook:'No tourist traps, no resorts. Classic cars, casas, and the best mojito of my life.',
    tags:['budget','food'], grad:PHOTOS.cubaClassicCar, imgLabel:'Havana Classic Car' },
];

const TAG_COLOR: Record<string,string> = {
  'solo trip':'#22D3EE','budget':'#34D399','food':'#F59E0B',
  'adventure':'#FB923C','first time':'#A78BFA','culture':'#F472B6',
};

function useTilt(s=10) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({x:0,y:0,gx:50,gy:50});
  const onMove = useCallback((e:React.MouseEvent) => {
    if(!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({y:((e.clientX-(r.left+r.width/2))/r.width)*s, x:-((e.clientY-(r.top+r.height/2))/r.height)*(s*.7), gx:((e.clientX-r.left)/r.width)*100, gy:((e.clientY-r.top)/r.height)*100});
  },[s]);
  const onLeave = useCallback(() => setT({x:0,y:0,gx:50,gy:50}),[]);
  return {ref, t, onMove, onLeave};
}

function Card({ j, idx }: { j: typeof LATEST[0]; idx: number }) {
  const { ref, t, onMove, onLeave } = useTilt();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={()=>{onLeave();setHov(false);}} onMouseEnter={()=>setHov(true)}
      style={{ borderRadius:20, overflow:'hidden', background:'rgba(17,24,39,0.65)',
        border:`1px solid ${hov?'rgba(34,211,238,0.22)':'rgba(255,255,255,0.07)'}`,
        transform:`perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg)`,
        transition:'transform 0.1s ease-out, border-color 0.25s',
        boxShadow:hov?'0 8px 40px rgba(34,211,238,0.07)':'none', cursor:'pointer',
        animation:`fadeUp 0.45s ease-out ${idx*0.08}s both`,
      }}>
      <div style={{ position:'relative', aspectRatio:'4/3', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:j.grad, transform:`scale(${hov?1.06:1})`, transition:'transform 0.5s' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}/>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:10, left:10, display:'flex', alignItems:'center', gap:4, background:'rgba(0,0,0,0.45)', borderRadius:999, padding:'3px 10px', backdropFilter:'blur(4px)' }}>
          <span style={{fontSize:9}}>📍</span>
          <span style={{fontSize:10, color:'#fff', fontWeight:500}}>{j.location}</span>
        </div>
        <div style={{ position:'absolute', bottom:8, right:8, fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.3)', padding:'2px 5px', borderRadius:4 }}>{j.imgLabel}</div>
      </div>
      <div style={{ padding:'16px 18px 18px' }}>
        <h3 style={{ fontSize:14, fontWeight:600, color:'#fff', margin:'0 0 6px', lineHeight:1.4 }}>{j.title}</h3>
        <p style={{ fontSize:11, color:'#9CA3AF', lineHeight:1.65, margin:'0 0 12px' }}>{j.hook}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
          {j.tags.map(tag=>(
            <span key={tag} style={{ fontSize:9, fontWeight:500, borderRadius:999, padding:'2px 8px', color:TAG_COLOR[tag]??'#9CA3AF', background:`${TAG_COLOR[tag]??'#6B7280'}18`, border:`1px solid ${TAG_COLOR[tag]??'#6B7280'}44` }}>{tag}</span>
          ))}
        </div>
        <span style={{ fontSize:11, fontWeight:500, color:'#22D3EE', display:'flex', alignItems:'center', gap:3 }}>
          Read the story <span style={{ transform:hov?'translateX(3px)':'none', transition:'transform 0.2s' }}>→</span>
        </span>
      </div>
    </div>
  );
}

export function ReviewCards() {
  return (
    <div style={{ background:'#050810', minHeight:'100vh', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", padding:'32px 40px', color:'#fff' }}>
      <div style={{ marginBottom:20 }}>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151', marginBottom:4 }}>Section 4 — Editorial Journey Cards</p>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:2 }}>3D perspective tilt · glare sweep · photo zoom · tag pills</h2>
        <p style={{ fontSize:11, color:'#4B5563' }}>Hover any card to see tilt + glare · border brightens cyan · "Read the story" arrow shifts right</p>
      </div>

      <div style={{ marginBottom:16 }}>
        <p style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#22D3EE', marginBottom:4 }}>Wanderlost with Dax</p>
        <h3 style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>Where I've been recently</h3>
        <p style={{ fontSize:12, color:'#6B7280', marginBottom:20 }}>A rolling collection of the trips I'm writing and filming about right now.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {LATEST.map((j,i) => <Card key={i} j={j} idx={i}/>)}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
