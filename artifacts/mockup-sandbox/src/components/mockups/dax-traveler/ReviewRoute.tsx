import React, { useState, useEffect } from 'react';

const ROUTE = [
  { code: 'ATL', label: 'Atlanta',  x: 80,  y: 72 },
  { code: 'HAV', label: 'Havana',   x: 345, y: 82 },
  { code: 'SJU', label: 'San Juan', x: 620, y: 64 },
];

export function ReviewRoute() {
  const [progress, setProgress] = useState(0);
  const [vis, setVis] = useState([false, false, false]);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + 0.01, 1);
      setProgress(p);
      setVis([p > 0.05, p > 0.42, p > 0.82]);
      if (p >= 1) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, []);

  const pathLen = 620;

  return (
    <div style={{ background: '#050810', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', gap: 32, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#374151', marginBottom: 6 }}>Section 2 — Animated Route</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>SVG path draws ATL → HAV → SJU on load</h2>
        <p style={{ fontSize: 12, color: '#4B5563' }}>Gradient stroke animates left to right · destination dots fade in sequentially</p>
      </div>

      <div style={{ background: '#06091a', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', padding: '40px 60px', width: '100%', maxWidth: 780 }}>
        <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#374151', marginBottom: 20 }}>
          2024 Route
        </p>
        <svg viewBox="0 0 700 110" style={{ width: '100%', display: 'block' }} fill="none">
          <defs>
            <linearGradient id="rg4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A78BFA"/>
              <stop offset="50%" stopColor="#F59E0B"/>
              <stop offset="100%" stopColor="#22D3EE"/>
            </linearGradient>
          </defs>
          <path d="M 80 72 C 185 34, 270 108, 345 82 C 420 56, 530 44, 620 64" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="5 4"/>
          <path
            d="M 80 72 C 185 34, 270 108, 345 82 C 420 56, 530 44, 620 64"
            stroke="url(#rg4)" strokeWidth="2"
            strokeDasharray={String(pathLen)}
            strokeDashoffset={pathLen * (1 - progress)}
            style={{ transition: 'none' }}
          />
          {ROUTE.map((s, i) => {
            const colors = ['#A78BFA', '#F59E0B', '#22D3EE'];
            return (
              <g key={s.code} style={{ opacity: vis[i] ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                <circle cx={s.x} cy={s.y} r={14} fill={colors[i]} fillOpacity={0.12}/>
                <circle cx={s.x} cy={s.y} r={5.5} fill={colors[i]}/>
                <text x={s.x} y={s.y - 18} fill="white" fontSize={10} fontWeight="700" textAnchor="middle" fontFamily="monospace">{s.code}</text>
                <text x={s.x} y={s.y + 24} fill="#6B7280" fontSize={9} textAnchor="middle">{s.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Behavior notes */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { dot: '#A78BFA', label: 'ATL → violet dot · home base' },
          { dot: '#F59E0B', label: 'HAV → amber dot · Cuba' },
          { dot: '#22D3EE', label: 'SJU → cyan dot · Puerto Rico' },
        ].map(({ dot, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.03)', borderRadius: 999, padding: '6px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }}/>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B7280' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
