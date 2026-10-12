// src/components/OperationalGrid.jsx
// Restrained system-grid / node / route background for the "Precision Studio
// x Executive Creator Lab" homepage direction. No rainbow gradients, no AI
// imagery — just a faint operational-diagram texture: a grid, a handful of
// connection nodes, and slow-moving route lines. Opacity stays low so it
// reads as atmosphere, not decoration.

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const NODES = [
  { x: 12, y: 18 },
  { x: 78, y: 14 },
  { x: 32, y: 46 },
  { x: 64, y: 58 },
  { x: 88, y: 72 },
  { x: 18, y: 80 },
  { x: 50, y: 30 },
];

const ROUTES = [
  [0, 2],
  [2, 4],
  [1, 3],
  [3, 5],
  [2, 6],
  [6, 1],
];

const OperationalGrid = () => {
  const nodes = useMemo(() => NODES, []);
  const routes = useMemo(() => ROUTES, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Base grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #2F6FED 1px, transparent 1px), linear-gradient(to bottom, #2F6FED 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Route lines + nodes, rendered as a single SVG so lines connect precisely */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {routes.map(([a, b], i) => {
          const from = nodes[a];
          const to = nodes[b];
          return (
            <motion.line
              key={`route-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#2F6FED"
              strokeWidth="0.12"
              strokeDasharray="1.5 2"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
            />
          );
        })}

        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r="0.5"
            fill="#5B8DFF"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </svg>

      {/* Single restrained prismatic edge-light accent, top-right corner only */}
      <div
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-[0.08]"
        style={{
          background:
            'conic-gradient(from 200deg, #2F6FED, #7C5CFF, #22D3EE, #2F6FED)',
        }}
      />
    </div>
  );
};

export default OperationalGrid;
