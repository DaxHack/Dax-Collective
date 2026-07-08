// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { analytics } from '../utils/analytics'

const navLinks = [
  {
    name: 'Home',
    to: '/',
    accent: '#ffffff',
    dim: 'rgba(255,255,255,0.08)',
    icon: '🏠',
    sub: 'The Dax Collective hub',
  },
  {
    name: 'Dax the Traveler',
    to: '/dax-the-traveler',
    accent: '#22D3EE',
    dim: 'rgba(34,211,238,0.08)',
    icon: '✈️',
    sub: 'Real trips. Honest stories.',
  },
  {
    name: 'Ani-Dax',
    to: '/ani-dax',
    accent: '#E879F9',
    dim: 'rgba(232,121,249,0.08)',
    icon: '⚡',
    sub: 'Anime content & culture',
  },
  {
    name: 'Timezone Travelers',
    to: '/timezone-travelers',
    accent: '#34D399',
    dim: 'rgba(52,211,153,0.08)',
    icon: '🌐',
    sub: 'Work, travel, productivity',
  },
  {
    name: "God's Vessel",
    to: '/gods-vessel',
    accent: '#F59E0B',
    dim: 'rgba(245,158,11,0.08)',
    icon: '✝️',
    sub: 'Faith-based content',
  },
]

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const drawerRef = useRef(null)

  const isActive = (to) => location.pathname === to

  // Close drawer on route change
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [isOpen])

  const handleDonationClick = () => {
    analytics.trackDonation('navbar', 'Keep the Lights On Button')
    window.open('https://buymeacoffee.com/DaxCollective', '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  const activeLink = navLinks.find(l => isActive(l.to))
  const activeAccent = activeLink?.accent ?? '#22D3EE'

  return (
    <nav
      ref={drawerRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9000,
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      }}
    >
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          background: scrolled
            ? 'rgba(5,8,16,0.88)'
            : 'rgba(5,8,16,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: `1px solid ${isOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'}`,
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.45)' : 'none',
          transition: 'background 0.25s, box-shadow 0.25s, border-color 0.25s',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#fff',
                lineHeight: 1,
              }}
            >
              Dax{' '}
              <span
                style={{
                  background: `linear-gradient(90deg, ${activeAccent}, #fff)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transition: 'background 0.4s',
                }}
              >
                Collective
              </span>
            </span>
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Desktop "current page" breadcrumb pill */}
            {activeLink && activeLink.to !== '/' && (
              <span
                className="hidden md:inline-flex"
                style={{
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: activeLink.accent,
                  background: activeLink.dim,
                  borderRadius: 999,
                  padding: '3px 11px',
                  border: `1px solid ${activeLink.accent}33`,
                  letterSpacing: '0.01em',
                }}
              >
                <span style={{ fontSize: 10 }}>{activeLink.icon}</span>
                {activeLink.name}
              </span>
            )}

            {/* Desktop slim links */}
            <div
              className="hidden lg:flex"
              style={{ alignItems: 'center', gap: 4 }}
            >
              {navLinks.filter(l => l.to !== '/').map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: isActive(link.to) ? 600 : 400,
                    color: isActive(link.to) ? link.accent : 'rgba(255,255,255,0.52)',
                    padding: '5px 10px',
                    borderRadius: 8,
                    background: isActive(link.to) ? link.dim : 'transparent',
                    transition: 'color 0.18s, background 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive(link.to)) {
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.to)) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.52)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Donation CTA — desktop only */}
            <button
              onClick={handleDonationClick}
              className="hidden md:inline-flex"
              style={{
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                borderRadius: 999,
                background: 'rgba(34,211,238,0.1)',
                border: '1px solid rgba(34,211,238,0.25)',
                color: '#22D3EE',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.18s, border-color 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(34,211,238,0.18)'
                e.currentTarget.style.borderColor = 'rgba(34,211,238,0.45)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(34,211,238,0.1)'
                e.currentTarget.style.borderColor = 'rgba(34,211,238,0.25)'
              }}
            >
              💡 Keep the Lights On
            </button>

            {/* Hamburger — always visible */}
            <button
              onClick={() => setIsOpen(o => !o)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                width: 40,
                height: 40,
                borderRadius: 10,
                background: isOpen ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isOpen ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.18s, border-color 0.18s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: 16,
                  height: 1.5,
                  borderRadius: 99,
                  background: '#fff',
                  transform: isOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                  transition: 'transform 0.22s cubic-bezier(.4,0,.2,1)',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 16,
                  height: 1.5,
                  borderRadius: 99,
                  background: '#fff',
                  opacity: isOpen ? 0 : 1,
                  transition: 'opacity 0.15s',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 16,
                  height: 1.5,
                  borderRadius: 99,
                  background: '#fff',
                  transform: isOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.22s cubic-bezier(.4,0,.2,1)',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Drawer panel ────────────────────────────────────────────────── */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? 600 : 0,
          transition: 'max-height 0.32s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div
          style={{
            background: 'rgba(5,8,16,0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: '12px 24px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 8,
            }}
          >
            {navLinks.map((link, idx) => {
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '13px 16px',
                    borderRadius: 14,
                    background: active ? link.dim : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${active ? link.accent + '33' : 'rgba(255,255,255,0.05)'}`,
                    borderLeft: `3px solid ${active ? link.accent : 'rgba(255,255,255,0.08)'}`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                    transition: `opacity 0.22s ease ${idx * 35}ms, transform 0.22s ease ${idx * 35}ms, background 0.18s, border-color 0.18s`,
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = link.dim
                      e.currentTarget.style.borderColor = link.accent + '33'
                      e.currentTarget.style.borderLeft = `3px solid ${link.accent}66`
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderLeft = '3px solid rgba(255,255,255,0.08)'
                    }
                  }}
                >
                  {/* Icon circle */}
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: active ? link.accent + '22' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? link.accent + '44' : 'rgba(255,255,255,0.07)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                      transition: 'background 0.18s, border-color 0.18s',
                    }}
                  >
                    {link.icon}
                  </span>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        color: active ? link.accent : '#fff',
                        lineHeight: 1.25,
                        transition: 'color 0.18s',
                      }}
                    >
                      {link.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.32)',
                        marginTop: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {link.sub}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {active && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: link.accent,
                        boxShadow: `0 0 8px ${link.accent}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Link>
              )
            })}

            {/* Donation row spanning full width */}
            <div
              style={{
                gridColumn: '1 / -1',
                marginTop: 4,
                paddingTop: 14,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.22)',
                  letterSpacing: '0.04em',
                }}
              >
                INDEPENDENT CREATOR · NO ADS · NO SPONSORS
              </span>
              <button
                onClick={handleDonationClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, rgba(34,211,238,0.15), rgba(245,158,11,0.12))',
                  border: '1px solid rgba(34,211,238,0.25)',
                  color: '#22D3EE',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.18s, border-color 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(34,211,238,0.25), rgba(245,158,11,0.2))'
                  e.currentTarget.style.borderColor = 'rgba(34,211,238,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(34,211,238,0.15), rgba(245,158,11,0.12))'
                  e.currentTarget.style.borderColor = 'rgba(34,211,238,0.25)'
                }}
              >
                💡 Help Keep the Lights On
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Backdrop scrim (mobile) ────────────────────────────────────── */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          top: 60,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: -1,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />
    </nav>
  )
}
