/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#3b82f6',
        'neon-purple': '#8b5cf6',
        'neon-pink': '#ec4899',
        // Precision Studio x Executive Creator Lab system (Home)
        charcoal: {
          950: '#07080b',
          900: '#0c0e13',
          800: '#12151c',
          700: '#1a1e27',
          600: '#252a36',
        },
        'electric-blue': {
          DEFAULT: '#2F6FED',
          light: '#5B8DFF',
          dim: '#1E4FB8',
        },
        // Restrained prismatic edge-light accents (used sparingly)
        'edge-violet': '#7C5CFF',
        'edge-cyan': '#22D3EE',
        'edge-magenta': '#D946EF',
        // God's Vessel split identity: site atmosphere + archive/product
        'vessel-indigo': '#312E81',
        'vessel-cream': '#F2EDE4',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // or 'media' if you want to respect system preferences
}
