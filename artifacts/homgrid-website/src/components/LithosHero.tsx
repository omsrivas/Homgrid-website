import { useRef, useState, useEffect } from 'react';

// Responsive spotlight base radius: ~17 vw, clamped 130 px – 240 px.
function spotlightRadius() {
  return Math.min(Math.max(window.innerWidth * 0.17, 130), 240);
}

// Build a patchy, organic mask from several overlapping ellipses offset around
// the cursor. Multiple comma-separated mask layers are additive by default
// (mask-composite: add), giving an irregular blob instead of a perfect circle.
function buildPatchyMask(cx: number, cy: number, r: number): string {
  const e = (dx: number, dy: number, rx: number, ry: number, opacity: number) =>
    `radial-gradient(ellipse ${r * rx}px ${r * ry}px at ${cx + r * dx}px ${cy + r * dy}px,` +
    ` rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity}) 25%, rgba(0,0,0,0) 75%)`;

  return [
    e(-0.08,  0.05, 1.15, 0.90, 1.00),
    e(-0.32, -0.30, 0.65, 0.58, 0.90),
    e( 0.36, -0.10, 0.60, 0.70, 0.85),
    e(-0.24,  0.38, 0.55, 0.45, 0.80),
    e( 0.16, -0.42, 0.36, 0.32, 0.70),
    e( 0.30,  0.34, 0.42, 0.38, 0.65),
  ].join(', ');
}

function RevealLayer({ cursorX, cursorY }: { cursorX: number; cursorY: number }) {
  const r = spotlightRadius();
  const mask = buildPatchyMask(cursorX, cursorY, r);

  const style: React.CSSProperties & { WebkitMaskImage?: string; WebkitMaskSize?: string; WebkitMaskComposite?: string } = {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    WebkitMaskComposite: 'source-over',
  };

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-none hero-bg-media hero-img-2"
      style={style}
    />
  );
}

// ── Mobile full-screen menu ───────────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: 'rgba(5,4,3,0.97)', backdropFilter: 'blur(24px)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-5">
        <div style={{ lineHeight: 1 }}>
          <span className="font-playfair italic" style={{ color: '#fff', fontSize: '22px', display: 'block', lineHeight: 1.1 }}>Homgrid</span>
          <span style={{ fontSize: '7.5px', letterSpacing: '0.30em', color: 'rgba(200,169,110,0.85)', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif" }}>Architects</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: 'none',
            border: '1px solid rgba(200,169,110,0.30)',
            color: 'rgba(255,255,255,0.80)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Gold rule */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.40), transparent)', margin: '0 20px' }} />

      {/* Nav links */}
      <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-6">
        {[
          { label: 'Projects',  href: '#projects' },
          { label: 'Services',  href: '#services' },
          { label: 'About',     href: '#about' },
          { label: 'Process',   href: '#process' },
          { label: 'Contact',   href: '#contact' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={onClose}
            style={{
              color: 'rgba(245,240,232,0.90)',
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              width: '100%',
              textAlign: 'center',
              padding: '6px 0',
              borderBottom: '1px solid rgba(200,169,110,0.08)',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </a>
        ))}

        {/* AI Floor Planner — special link */}
        <a
          href="/ai-floor-planner"
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#C8A96E',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px',
            letterSpacing: '0.06em',
            textDecoration: 'none',
            border: '1px solid rgba(200,169,110,0.40)',
            padding: '12px 28px',
            borderRadius: '4px',
            marginTop: '16px',
            background: 'rgba(200,169,110,0.08)',
          }}
        >
          ✦ AI Floor Planner
        </a>
      </nav>

      {/* Bottom contact strip */}
      <div
        className="text-center pb-10 pt-4"
        style={{ borderTop: '1px solid rgba(200,169,110,0.12)', margin: '0 20px' }}
      >
        <a
          href="tel:+917830355661"
          style={{
            color: 'rgba(200,169,110,0.70)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '16px',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            display: 'block',
            marginTop: '16px',
          }}
        >
          +91 78303 55661
        </a>
        <span
          style={{
            color: 'rgba(245,240,232,0.25)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            display: 'block',
            marginTop: '6px',
          }}
        >
          Vrindavan · Noida
        </span>
      </div>
    </div>
  );
}

export default function LithosHero() {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) mouseRef.current = { x: t.clientX, y: t.clientY };
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
      setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="lithos-root" style={{ background: '#FAF8F5', height: '100dvh', overflow: 'hidden' }}>
      {/* Mobile full-screen menu */}
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo + wordmark */}
        <div className="flex items-center gap-2.5">
          <div style={{ lineHeight: 1 }}>
            <span className="font-playfair italic" style={{ color: '#fff', fontSize: '22px', display: 'block', lineHeight: 1.1 }}>Homgrid</span>
            <span style={{ fontSize: '7.5px', letterSpacing: '0.30em', color: 'rgba(200,169,110,0.85)', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif" }}>Architects</span>
          </div>
        </div>

        {/* Centre nav links — landscape only */}
        <div className="hero-nav-links">
          {['Projects', 'Services', 'About', 'Studio', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.70)', fontSize: '10.5px', letterSpacing: '0.13em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: "'Cormorant Garamond', serif", transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#C8A96E'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.70)'; }}
            >{l}</a>
          ))}
          <a
            href="/ai-floor-planner"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              color: '#C8A96E', fontSize: '10.5px', letterSpacing: '0.13em',
              textTransform: 'uppercase', textDecoration: 'none',
              fontFamily: "'Cormorant Garamond', serif",
              background: 'rgba(200,169,110,0.12)',
              border: '1px solid rgba(200,169,110,0.35)',
              padding: '4px 10px', borderRadius: '3px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,169,110,0.24)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,169,110,0.12)'; }}
          >
            ✦ AI
          </a>
        </div>

        {/* Right — Contact Us (desktop) / Hamburger (mobile) */}
        <a
          href="#contact"
          className="hidden sm:inline-flex"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '9px 22px',
            background: 'rgba(200,169,110,0.12)',
            color: '#C8A96E',
            border: '1px solid rgba(200,169,110,0.40)',
            backdropFilter: 'blur(12px)',
            textDecoration: 'none',
            borderRadius: '2px',
            transition: 'background 0.25s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,169,110,0.26)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,169,110,0.12)'; }}
        >
          Contact Us
        </a>

        {/* Hamburger button — mobile only */}
        <button
          className="sm:hidden flex flex-col justify-center items-center gap-[5px]"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'rgba(200,169,110,0.12)',
            border: '1px solid rgba(200,169,110,0.35)',
            borderRadius: '6px',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <span style={{ display: 'block', width: '18px', height: '1.5px', background: '#C8A96E', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '14px', height: '1.5px', background: '#C8A96E', borderRadius: '1px', marginLeft: '-4px' }} />
          <span style={{ display: 'block', width: '18px', height: '1.5px', background: '#C8A96E', borderRadius: '1px' }} />
        </button>
      </nav>

      {/* Hero section */}
      <section
        className="relative w-full overflow-hidden h-screen"
        style={{ height: '100dvh', background: '#FAF8F5' }}
      >
        {/* Layer 1: base image with Ken Burns zoom */}
        <div
          className="absolute inset-0 hero-zoom hero-bg-media hero-img-1 z-10"
        />

        {/* Layer 2: cursor-reveal layer */}
        <RevealLayer cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Dark gradient overlay — keeps nav text readable */}
        <div
          className="absolute inset-0 pointer-events-none z-40"
          style={{ background: 'linear-gradient(180deg, rgba(10,9,7,0.32) 0%, rgba(10,9,7,0.06) 40%, rgba(10,9,7,0.0) 100%)' }}
        />

        {/* Portrait-specific bottom darkening overlay */}
        <div className="absolute inset-0 pointer-events-none hero-portrait-overlay" style={{ zIndex: 41 }} />

        {/* Hero text panel */}
        <div className="hero-text-panel">
          <div style={{ paddingLeft: 'clamp(20px, 6vw, 88px)', paddingRight: 'clamp(20px, 5vw, 48px)', paddingTop: 'clamp(80px, 13vh, 128px)', maxWidth: '100%' }}>

            {/* Label with gold rule */}
            <div className="hero-text-anim" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', animationDelay: '0.08s' }}>
              <div style={{ width: '28px', height: '1px', background: '#C8A96E', flexShrink: 0 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(10px, 0.70vw, 11px)', fontWeight: 400, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C8A96E', margin: 0 }}>
                Designing Timeless Spaces
              </p>
            </div>

            {/* Headline */}
            <h1
              className="hero-text-anim"
              style={{
                fontWeight: 900,
                lineHeight: 1.0,
                margin: 0,
                marginBottom: '18px',
                animationDelay: '0.20s',
              }}
            >
              <span className="hero-serif-line" style={{ color: '#F5F0E8' }}>Architecture</span>
              <span className="hero-serif-line" style={{ color: '#F5F0E8', lineHeight: 1.15 }}>
                that{' '}<span className="hero-script-word">Inspires.</span>
              </span>
              <span className="hero-italic-line" style={{ color: '#F5F0E8' }}>Spaces that</span>
              <span className="hero-script-line">Endure.</span>
            </h1>

            {/* Description */}
            <p
              className="hero-text-anim hero-desc"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(14px, 1.02vw, 17px)',
                fontWeight: 300,
                lineHeight: 1.72,
                color: 'rgba(240,228,205,0.95)',
                margin: 0,
                marginBottom: '28px',
                maxWidth: '360px',
                animationDelay: '0.36s',
              }}
            >
              We craft timeless architecture that blends innovation, elegance, and purpose — creating spaces that elevate the human experience.
            </p>

            {/* CTA */}
            <div className="hero-text-anim" style={{ animationDelay: '0.50s', pointerEvents: 'auto' }}>
              <a
                href="#projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(12px, 0.82vw, 13px)',
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: 'clamp(12px, 1.5vw, 14px) clamp(20px, 2.5vw, 28px)',
                  background: 'transparent',
                  color: '#F5F0E8',
                  border: '1px solid rgba(245,240,232,0.45)',
                  borderRadius: '2px',
                  transition: 'border-color 0.25s, color 0.25s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(200,169,110,0.80)';
                  el.style.color = '#C8A96E';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(245,240,232,0.45)';
                  el.style.color = '#F5F0E8';
                }}
              >
                Explore Our Work
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                  <line x1="0" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1"/>
                  <polyline points="9,1 13,5 9,9" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar — portrait only */}
        <div className="hero-stats-bar" style={{ pointerEvents: 'none' }}>
          {[
            { num: '47+', label: 'Projects Delivered', sub: 'Across India' },
            { num: '8+',  label: 'Years of Practice',  sub: 'Creating Impact' },
            { num: '2',   label: 'Studio Offices',     sub: 'Vrindavan · Noida' },
            { num: '100%',label: 'Client Satisfaction', sub: 'Every Engagement' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '14px 4px', borderRight: i < 3 ? '1px solid rgba(200,169,110,0.12)' : 'none' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 4.5vw, 36px)', fontWeight: 300, color: '#C8A96E', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(7px, 1.7vw, 10px)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.60)', marginTop: '3px' }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(6px, 1.5vw, 9px)', letterSpacing: '0.08em', color: 'rgba(200,169,110,0.50)', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
