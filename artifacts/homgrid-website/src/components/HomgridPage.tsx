import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  Instagram,
  MapPin,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

// ─── Design tokens — Homgrid Parchment & Burnished Gold ─────────────────────
const G = {
  // Backgrounds — warm paper / parchment
  bg:       '#EDE8E0',   // primary paper — warm cream
  sec:      '#DDD6CB',   // secondary paper — slightly darker

  // Accents — burnished gold / champagne
  wine:     '#BF9A48',
  burgundy: '#A07830',
  wineGlow: 'rgba(191,154,72,0.14)',
  wineGlowStrong: 'rgba(191,154,72,0.26)',
  wineBorder: 'rgba(191,154,72,0.42)',

  // Warm gold — dividers, icons, detail work
  gold:       '#9A7440',
  goldDim:    'rgba(154,116,64,0.10)',
  goldBorder: 'rgba(154,116,64,0.30)',

  // Typography — deep ink on paper
  ivory:   '#1A1208',   // near-black ink
  muted:   '#6B5A4E',   // warm brown secondary

  // Glass / card surfaces — translucent paper
  glass:       'rgba(255,252,248,0.72)',
  glassBorder: 'rgba(10,9,7,0.10)',
  glassWine:   'rgba(255,252,248,0.60)',
};

// ─── Easing ──────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } },
};
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14 } },
};
const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.0, ease: EASE } },
};
const slideRight: Variants = {
  hidden:  { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.0, ease: EASE } },
};

// ─── Torn paper edge — transition between sections ───────────────────────────
const TORN_A = "M0,0 L1440,0 L1440,55 L1392,40 L1344,58 L1296,36 L1248,52 L1200,30 L1152,48 L1104,62 L1056,44 L1008,28 L960,50 L912,38 L864,56 L816,34 L768,48 L720,24 L672,44 L624,58 L576,40 L528,26 L480,48 L432,36 L384,54 L336,30 L288,46 L240,60 L192,42 L144,28 L96,50 L48,38 L0,52 Z";
const TORN_B = "M0,0 L1440,0 L1440,48 L1392,62 L1344,44 L1296,60 L1248,40 L1200,56 L1152,36 L1104,52 L1056,30 L1008,46 L960,62 L912,44 L864,28 L816,48 L768,64 L720,46 L672,32 L624,52 L576,68 L528,50 L480,36 L432,56 L384,40 L336,58 L288,42 L240,28 L192,48 L144,64 L96,46 L48,32 L0,50 Z";

function TornEdge({ above, below, flip = false }: { above: string; below: string; flip?: boolean }) {
  const d = flip ? TORN_B : TORN_A;
  return (
    <div style={{ background: below, lineHeight: 0, marginTop: '-2px', position: 'relative', zIndex: 2 }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: '100%',
          height: '72px',
          filter: 'drop-shadow(0px -3px 8px rgba(10,9,7,0.13))',
        }}
      >
        <path d={d} fill={above} />
      </svg>
    </div>
  );
}

// ─── Scroll-trigger wrapper ──────────────────────────────────────────────────
function Reveal({
  children,
  variant = fadeUp,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  variant?: Variants;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Ambient wine glow ───────────────────────────────────────────────────────
function WineGlow({ position = 'top-right', intensity = 1 }: { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'; intensity?: number }) {
  const map: Record<string, string> = {
    'top-right':    '100% 0%',
    'top-left':     '0% 0%',
    'bottom-right': '100% 100%',
    'bottom-left':  '0% 100%',
    'center':       '50% 50%',
  };
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 55% 45% at ${map[position]}, rgba(191,154,72,${0.13 * intensity}) 0%, transparent 70%)`,
      }}
    />
  );
}

// ─── Gold rule ───────────────────────────────────────────────────────────────
function GoldRule({ className = '', fade = 'both' }: { className?: string; fade?: 'both' | 'left' | 'right' | 'none' }) {
  const gradients: Record<string, string> = {
    both:  `linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
    left:  `linear-gradient(90deg, ${G.gold}, transparent)`,
    right: `linear-gradient(90deg, transparent, ${G.gold})`,
    none:  G.gold,
  };
  return (
    <div
      className={`h-px ${className}`}
      style={{ background: gradients[fade] }}
    />
  );
}

// ─── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-6 h-px" style={{ background: G.wine }} />
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: G.wine,
        }}
      >
        {children}
      </span>
      <div className="w-6 h-px" style={{ background: G.wine }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI FEATURE SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function AIFeatureSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: G.bg, padding: 'clamp(56px, 9vw, 120px) 0' }}
    >
      <WineGlow position="center" intensity={0.8} />
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        <Reveal>
          <div
            className="relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(26,18,8,0.96) 0%, rgba(40,28,12,0.94) 100%)`,
              border: `1px solid ${G.wineBorder}`,
              borderRadius: '24px',
              padding: 'clamp(40px, 6vw, 80px)',
              boxShadow: '0 20px 80px rgba(26,18,8,0.24)',
            }}
          >
            {/* Subtle grid pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(191,154,72,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(191,154,72,0.04) 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
                borderRadius: '24px',
              }}
            />
            {/* Gold glow top-right */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-80px', right: '-80px',
                width: '320px', height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(191,154,72,0.18) 0%, transparent 70%)',
              }}
            />

            <div className="relative flex flex-col lg:flex-row gap-14 lg:items-center">
              {/* Left — copy */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-8">
                  <div style={{ width: '20px', height: '1px', background: G.wine }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: G.wine }}>
                    Exclusive Studio Tool
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(34px, 4.2vw, 62px)',
                    fontWeight: 700,
                    color: '#FAF8F5',
                    lineHeight: 1.08,
                    letterSpacing: '-0.022em',
                    marginBottom: '24px',
                  }}
                >
                  AI Floor Planner
                </h2>

                <p
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(16px, 1.4vw, 20px)',
                    lineHeight: 1.8,
                    color: 'rgba(237,232,224,0.72)',
                    maxWidth: '480px',
                    marginBottom: '36px',
                  }}
                >
                  Generate photorealistic, Vastu-compliant floor plans in seconds. Enter your plot size, select your style, and let our AI do the rest — complete with room legends, area statements, and a compass rose.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {[
                    'Plot Size Input',
                    'Floor Selection',
                    'Room Requirements',
                    'Vastu Options',
                    'Instant Results',
                    'Download PDF',
                  ].map(feat => (
                    <span
                      key={feat}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        color: G.wine,
                        background: 'rgba(191,154,72,0.10)',
                        border: `1px solid rgba(191,154,72,0.30)`,
                        padding: '5px 12px',
                        borderRadius: '6px',
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <a
                  href="/ai-floor-planner"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 36px',
                    background: `linear-gradient(135deg, ${G.wine} 0%, ${G.gold} 100%)`,
                    border: 'none',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    color: '#FAF8F5',
                    textDecoration: 'none',
                    boxShadow: '0 6px 28px rgba(191,154,72,0.38)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 36px rgba(191,154,72,0.50)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(191,154,72,0.38)';
                  }}
                >
                  ✦ Try AI Floor Planner
                  <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Right — mock floor plan preview */}
              <div
                className="flex-shrink-0 relative"
                style={{ width: 'clamp(260px, 36%, 420px)' }}
              >
                {/* Blueprint card */}
                <div
                  style={{
                    background: '#f5f0e8',
                    borderRadius: '14px',
                    padding: '24px',
                    border: '1px solid rgba(200,168,130,0.50)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.30)',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <div style={{ borderBottom: '2px solid #5a3e28', paddingBottom: '10px', marginBottom: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#2a1a0a', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '3px' }}>Ground Floor Plan</div>
                    <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', color: '#5a3e28', textTransform: 'uppercase' }}>Modern Villa · Plot 40×60 Ft</div>
                  </div>
                  {/* Floor plan schematic SVG */}
                  <svg viewBox="0 0 200 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    {/* Outer boundary */}
                    <rect x="10" y="10" width="180" height="140" fill="#e8e0d0" stroke="#2a1a0a" strokeWidth="2.5" />
                    {/* Rooms */}
                    <rect x="10" y="10" width="80" height="55" fill="#f0ebe0" stroke="#5a3e28" strokeWidth="1" />
                    <rect x="90" y="10" width="100" height="55" fill="#ede5d5" stroke="#5a3e28" strokeWidth="1" />
                    <rect x="10" y="65" width="50" height="50" fill="#f0ebe0" stroke="#5a3e28" strokeWidth="1" />
                    <rect x="60" y="65" width="80" height="50" fill="#ede5d5" stroke="#5a3e28" strokeWidth="1" />
                    <rect x="140" y="65" width="50" height="50" fill="#f0ebe0" stroke="#5a3e28" strokeWidth="1" />
                    <rect x="10" y="115" width="180" height="35" fill="#e0d8c8" stroke="#5a3e28" strokeWidth="1" />
                    {/* Room labels */}
                    <text x="50" y="40" textAnchor="middle" fontSize="7" fill="#5a3e28" fontFamily="Georgia, serif">Living</text>
                    <text x="140" y="40" textAnchor="middle" fontSize="7" fill="#5a3e28" fontFamily="Georgia, serif">Master Bed</text>
                    <text x="35" y="93" textAnchor="middle" fontSize="6" fill="#5a3e28" fontFamily="Georgia, serif">Kitchen</text>
                    <text x="100" y="93" textAnchor="middle" fontSize="7" fill="#5a3e28" fontFamily="Georgia, serif">Dining</text>
                    <text x="165" y="93" textAnchor="middle" fontSize="6" fill="#5a3e28" fontFamily="Georgia, serif">Bedroom</text>
                    <text x="100" y="135" textAnchor="middle" fontSize="7" fill="#5a3e28" fontFamily="Georgia, serif">Car Parking · Garden</text>
                    {/* Door arcs */}
                    <path d="M 90 10 Q 90 25 105 25" fill="none" stroke="#5a3e28" strokeWidth="0.8" />
                    <path d="M 10 65 Q 25 65 25 80" fill="none" stroke="#5a3e28" strokeWidth="0.8" />
                    {/* Staircase */}
                    <rect x="62" y="67" width="18" height="20" fill="none" stroke="#8b6914" strokeWidth="0.8" />
                    <line x1="65" y1="70" x2="77" y2="70" stroke="#8b6914" strokeWidth="0.5" />
                    <line x1="65" y1="74" x2="77" y2="74" stroke="#8b6914" strokeWidth="0.5" />
                    <line x1="65" y1="78" x2="77" y2="78" stroke="#8b6914" strokeWidth="0.5" />
                    <line x1="65" y1="82" x2="77" y2="82" stroke="#8b6914" strokeWidth="0.5" />
                    {/* North indicator */}
                    <text x="188" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5a3e28" fontFamily="Georgia, serif">N</text>
                    <line x1="188" y1="24" x2="188" y2="36" stroke="#5a3e28" strokeWidth="1" />
                    <polygon points="188,24 185,32 188,30 191,32" fill="#5a3e28" />
                  </svg>
                  {/* Area statement */}
                  <div style={{ borderTop: '1px solid #c8a882', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#5a3e28', fontFamily: 'monospace' }}>
                    <span>Built-up: <strong>2100 SQ.FT.</strong></span>
                    <span>Carpet: <strong>1725 SQ.FT.</strong></span>
                  </div>
                </div>

                {/* AI badge */}
                <div
                  className="absolute"
                  style={{
                    top: '-14px', right: '-14px',
                    background: `linear-gradient(135deg, ${G.wine}, ${G.gold})`,
                    borderRadius: '50%',
                    width: '56px', height: '56px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                    boxShadow: '0 4px 18px rgba(191,154,72,0.50)',
                  }}
                >
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, color: '#FAF8F5', letterSpacing: '0.06em', lineHeight: 1 }}>AI</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '6px', color: 'rgba(250,248,245,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.2 }}>Generated</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 01 — MARQUEE STRIP
// ═══════════════════════════════════════════════════════════════════════════════
function MarqueeStrip() {
  const items = [
    'Architecture',
    'Interior Design',
    'Landscape',
    'Urban Planning',
    'Residential',
    'Commercial',
    'Renovation',
    'Consultancy',
  ];
  const repeated = [...items, ...items, ...items];
  return (
    <div
      className="relative overflow-hidden py-4 border-y"
      style={{ background: G.sec, borderColor: G.glassBorder }}
    >
      {/* Subtle wine edge glow */}
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: `linear-gradient(90deg, ${G.sec}, transparent)`, zIndex: 1 }} />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none" style={{ background: `linear-gradient(270deg, ${G.sec}, transparent)`, zIndex: 1 }} />

      <div className="hg-marquee flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: G.muted,
            }}
          >
            {item}
            <span style={{ color: G.wine, fontSize: '8px' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 02 — ABOUT / PHILOSOPHY
// ═══════════════════════════════════════════════════════════════════════════════
function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden paper-grid"
      style={{ background: G.bg, padding: 'clamp(64px, 10vw, 160px) 0' }}
    >
      <WineGlow position="top-right" intensity={1.2} />
      <WineGlow position="bottom-left" intensity={0.7} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left — Philosophy */}
          <Reveal variant={slideLeft}>
            <SectionLabel>Our Philosophy</SectionLabel>

            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(48px, 5.5vw, 84px)',
                fontWeight: 700,
                color: G.ivory,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                marginBottom: '40px',
              }}
            >
              Space is{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  color: 'transparent',
                  WebkitTextStroke: `1px ${G.gold}`,
                  background: `linear-gradient(135deg, ${G.gold}, ${G.wine})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                memory
              </em>{' '}
              made permanent.
            </h2>

            <GoldRule className="w-1/2 mb-12" fade="left" />

            <p
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '21px',
                lineHeight: 1.85,
                color: G.ivory,
                marginBottom: '24px',
                opacity: 0.9,
              }}
            >
              At Homgrid Architects, we believe architecture is the art of giving
              form to human aspiration. Every line drawn, every material chosen,
              every space sculpted carries the weight of those who will inhabit it
              — for generations.
            </p>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '18px',
                lineHeight: 1.85,
                color: G.muted,
              }}
            >
              Founded with an obsession for craft and a reverence for context, we
              translate our clients' most ambitious visions into structures that
              stand at the intersection of timelessness and innovation.
            </p>

            <motion.a
              href="#contact"
              className="inline-flex items-center gap-3 mt-14 group"
              style={{
                color: G.ivory,
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: `1px solid ${G.goldBorder}`,
                paddingBottom: '6px',
              }}
              whileHover={{ letterSpacing: '0.24em' }}
              transition={{ duration: 0.4 }}
            >
              Begin a Conversation
              <ArrowUpRight size={14} style={{ color: G.gold }} />
            </motion.a>
          </Reveal>

          {/* Right — Stat cards */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '47+', label: 'Projects Delivered', sub: 'Across India' },
                { num: '5+',  label: 'Years of Practice',  sub: 'Est. 2020' },
                { num: '2',   label: 'Studio Offices',     sub: 'Vrindavan · Noida' },
                { num: '5.0★', label: 'Google Rating',     sub: 'Architecture Firm' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.85, ease: EASE, delay: i * 0.08 }}
                  className="relative p-8 overflow-hidden"
                  style={{
                    background: G.glass,
                    border: `1px solid ${G.glassBorder}`,
                    backdropFilter: 'blur(24px)',
                    borderRadius: '16px',
                  }}
                  whileHover={{ borderColor: G.goldBorder }}
                >
                  {/* Subtle corner wine blush */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${G.wineGlow}, transparent 70%)` }}
                  />
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(40px, 4.5vw, 54px)',
                      fontWeight: 300,
                      color: G.gold,
                      lineHeight: 1,
                      marginBottom: '14px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ color: G.ivory, fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                    {s.label}
                  </div>
                  <div style={{ color: G.muted, fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.04em' }}>
                    {s.sub}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tagline card */}
            <motion.div
              className="mt-4 p-7 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${G.glassWine}, ${G.glass})`,
                border: `1px solid ${G.wineBorder}`,
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
              }}
              whileHover={{ borderColor: `rgba(200,160,85,0.20)` }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-start gap-5">
                {/* Minimal gold cross icon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    border: `1px solid ${G.goldBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderRadius: '10px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <line x1="8" y1="1" x2="8" y2="15" stroke={G.gold} strokeWidth="1" />
                    <line x1="1" y1="8" x2="15" y2="8" stroke={G.gold} strokeWidth="1" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      color: G.wine,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: 600,
                    }}
                  >
                    Homgrid Architects
                  </div>
                  <div
                    style={{
                      color: G.ivory,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '17px',
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      opacity: 0.9,
                    }}
                  >
                    "Designing Timeless Spaces,<br />Building Exceptional Experiences."
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 03 — SERVICES
// ═══════════════════════════════════════════════════════════════════════════════
const services = [
  {
    num: '01',
    title: 'Architectural Design',
    desc: 'From concept to completion — buildings that are functionally precise and aesthetically enduring. Residential, commercial, and mixed-use structures that define their context.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <polygon points="16,2 30,28 2,28" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="16" y1="2" x2="16" y2="28" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="9" y1="17" x2="23" y2="17" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Interior Architecture',
    desc: 'Interior spaces designed with the same rigour as the buildings that enclose them. Material, proportion, light, and texture orchestrated into lived-in masterworks.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="10" y="10" width="12" height="12" rx="0.5" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.45" />
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="22" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="16" y1="4" x2="16" y2="10" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="16" y1="22" x2="16" y2="28" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Landscape Design',
    desc: 'Exterior environments that extend the architectural narrative. Gardens, terraces, courtyards, and public realms conceived as outdoor rooms with intentional character.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.45" />
        <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Renovation & Restoration',
    desc: 'Breathing new life into existing structures. Our restoration practice honours the character of heritage fabric while introducing contemporary standards of comfort.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M6 26 L6 12 L16 4 L26 12 L26 26 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="12" y="18" width="8" height="8" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.45" />
        <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Project Management',
    desc: 'Seamless delivery from groundbreaking to handover. We coordinate consultants, contractors, and suppliers — holding every thread to schedule, budget, and quality.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="10" y1="17" x2="22" y2="17" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <line x1="10" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <rect x="12" y="3" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.45" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Design Consultancy',
    desc: 'Expert architectural counsel for developers, investors, and institutions. Feasibility studies, concept validation, and design reviews that sharpen vision and derisk decisions.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 C10 4 6 8 6 13 C6 17 8 20 12 22 L12 28 L20 28 L20 22 C24 20 26 17 26 13 C26 8 22 4 16 4 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="16" y1="10" x2="16" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="16" cy="19" r="1" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
];

function ServicesSection() {
  return (
    <section id="services"
      className="relative overflow-hidden" style={{ background: G.sec, padding: 'clamp(64px, 10vw, 160px) 0' }}>
      <WineGlow position="top-left" intensity={1.0} />
      <WineGlow position="bottom-right" intensity={0.8} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        {/* Header */}
        <Reveal className="mb-10 lg:mb-24">
          <SectionLabel>Our Disciplines</SectionLabel>
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-28">
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(42px, 4.8vw, 70px)',
                fontWeight: 700,
                color: G.ivory,
                lineHeight: 1.06,
                letterSpacing: '-0.022em',
                flex: 1,
              }}
            >
              Six Ways We<br />Shape the World
            </h2>
            <p
              style={{
                color: G.muted,
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '19px',
                lineHeight: 1.8,
                maxWidth: '380px',
              }}
            >
              Each engagement is unique. We bring the same depth of thinking
              to a 300 sq ft studio as to a 30,000 sq ft corporate campus.
            </p>
          </div>
        </Reveal>

        <GoldRule className="mb-24" />

        {/* Grid — separated cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{
                hidden: { opacity: 0, y: 56, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.88,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.09,
                  },
                },
              }}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="group relative overflow-hidden cursor-default service-card"
              style={{
                background: 'rgba(255,252,248,0.94)',
                border: `1px solid rgba(154,116,64,0.20)`,
                borderRadius: '16px',
                padding: 'clamp(24px,5vw,44px) clamp(20px,4vw,40px) clamp(20px,4vw,40px)',
                boxShadow: '0 1px 4px rgba(10,8,4,0.07), 0 4px 16px rgba(10,8,4,0.05)',
              }}
            >
              {/* Top accent bar — grows in on hover */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: `linear-gradient(90deg, ${G.wine}, ${G.gold})`,
                }}
              />

              {/* Number watermark — top right */}
              <div className="absolute top-8 right-9" style={{ userSelect: 'none', pointerEvents: 'none' }}>
                <motion.span
                  initial={{ opacity: 0.055 }}
                  whileHover={{ opacity: 0.13 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '72px',
                    fontWeight: 200,
                    color: G.ivory,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    display: 'block',
                  }}
                >
                  {svc.num}
                </motion.span>
              </div>

              {/* Icon */}
              <div
                className="mb-8 inline-flex items-center justify-center rounded-full"
                style={{
                  width: '52px',
                  height: '52px',
                  background: `rgba(154,116,64,0.10)`,
                  border: `1px solid rgba(154,116,64,0.22)`,
                  color: G.gold,
                  transition: 'background 0.35s ease, border-color 0.35s ease',
                }}
              >
                {svc.icon}
              </div>

              {/* Thin gold rule under icon */}
              <div
                className="mb-6"
                style={{
                  height: '1px',
                  background: `linear-gradient(90deg, rgba(154,116,64,0.35) 0%, rgba(154,116,64,0.04) 100%)`,
                  width: '48px',
                }}
              />

              <h3
                className="mb-4"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '21px',
                  fontWeight: 600,
                  color: G.ivory,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.25,
                }}
              >
                {svc.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13.5px',
                  lineHeight: 1.85,
                  color: G.muted,
                  flex: 1,
                }}
              >
                {svc.desc}
              </p>

              {/* Bottom CTA */}
              <motion.div
                className="flex items-center gap-2 mt-8"
                initial={{ opacity: 0, x: -6 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{
                  color: G.wine,
                  fontSize: '10.5px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                }}
              >
                <ChevronRight size={12} strokeWidth={2.5} />
                <span>Explore</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 04 — SELECTED WORKS / PORTFOLIO
// ═══════════════════════════════════════════════════════════════════════════════
const projects = [
  {
    num: '001',
    title: 'The Vrindavan Residence',
    location: 'Vrindavan, Mathura',
    year: '2024',
    type: 'Luxury Residential',
    desc: 'A 6,800 sq ft family home that draws from the sacred geometry of Braj architecture — filtered through a contemporary vocabulary of raw concrete, aged teak, and hand-cut stone.',
    image: '/vrindavan-residence.png',
    gradient: 'linear-gradient(145deg, #C4BAB0 0%, #B0A89E 50%, #C4BAB0 100%)',
    lineColor: G.wine,
  },
  {
    num: '002',
    title: 'Logix Corporate Tower',
    location: 'Noida, Uttar Pradesh',
    year: '2023',
    type: 'Commercial Office',
    desc: 'A 22,000 sq ft premium office fitout at Logix City Centre. Biophilic design meets precision workplace strategy for a Fortune 500 financial services client.',
    image: '/logix-corporate.png',
    gradient: 'linear-gradient(145deg, #C4BAB0 0%, #B0A89E 50%, #C4BAB0 100%)',
    lineColor: G.gold,
  },
  {
    num: '003',
    title: 'The Garden Pavilion',
    location: 'Greater Noida, UP',
    year: '2023',
    type: 'Hospitality & Landscape',
    desc: 'An event pavilion conceived as a dialogue between built form and nature. Floating steel canopies, water bodies, and curated planting create a destination in motion.',
    image: '/garden-pavilion.png',
    gradient: 'linear-gradient(145deg, #C4BAB0 0%, #B0A89E 50%, #C4BAB0 100%)',
    lineColor: G.wine,
  },
];

function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden" style={{ background: G.bg, padding: 'clamp(64px, 10vw, 160px) 0' }}>
      <WineGlow position="top-right" intensity={0.9} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        <Reveal className="mb-10 lg:mb-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <SectionLabel>Selected Works</SectionLabel>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(42px, 4.8vw, 70px)',
                  fontWeight: 700,
                  color: G.ivory,
                  lineHeight: 1.06,
                  letterSpacing: '-0.022em',
                }}
              >
                Projects That<br />Define Our Practice
              </h2>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 self-start lg:self-end shrink-0 group"
              style={{
                color: G.muted,
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 500,
                paddingBottom: '4px',
                borderBottom: `1px solid ${G.glassBorder}`,
                textDecoration: 'none',
                transition: 'color 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = G.ivory; e.currentTarget.style.borderColor = G.goldBorder; }}
              onMouseLeave={e => { e.currentTarget.style.color = G.muted; e.currentTarget.style.borderColor = G.glassBorder; }}
            >
              View All Projects
              <ArrowUpRight size={13} />
            </a>
          </div>
        </Reveal>

        <div className="space-y-5">
          {projects.map((proj, i) => (
            <Reveal key={proj.num} delay={i * 0.08}>
              <motion.div
                className="group relative overflow-hidden flex flex-col sm:flex-row"
                style={{
                  border: `1px solid ${G.glassBorder}`,
                  borderRadius: '16px',
                  minHeight: '200px',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                }}
                whileHover={{ borderColor: `rgba(154,116,64,0.38)` }}
                transition={{ duration: 0.4 }}
              >
                {/* Image — fixed width column on all screen sizes */}
                <div
                  className="relative shrink-0 overflow-hidden hg-project-image"
                  style={{
                    width: 'clamp(120px, 38%, 400px)',
                    background: proj.gradient,
                    ...(proj.image ? {
                      backgroundImage: `url('${proj.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {}),
                  }}
                >
                  {/* Scrim */}
                  {proj.image && (
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(160deg, rgba(10,9,7,0.38) 0%, rgba(10,9,7,0.10) 100%)' }}
                    />
                  )}
                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
                    style={{ background: proj.lineColor }}
                  />
                  {/* Type badge */}
                  <div
                    className="absolute bottom-5 left-5"
                    style={{
                      background: 'rgba(10,9,7,0.78)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid rgba(255,255,255,0.10)`,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      color: 'rgba(210,195,175,0.85)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {proj.type}
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex flex-col justify-between flex-1 min-w-0"
                  style={{ background: G.sec, padding: 'clamp(18px, 4vw, 44px)' }}
                >
                  <div>
                    <div
                      className="flex items-center gap-2 mb-4"
                      style={{ color: G.muted, fontFamily: 'Inter, sans-serif', fontSize: '10.5px', letterSpacing: '0.08em' }}
                    >
                      <MapPin size={10} style={{ color: G.wine }} />
                      <span>{proj.location}</span>
                      <span style={{ opacity: 0.3 }}>·</span>
                      <span>{proj.year}</span>
                    </div>

                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(18px, 2.4vw, 30px)',
                        fontWeight: 700,
                        color: G.ivory,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.15,
                      }}
                    >
                      {proj.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(14px, 1.3vw, 17px)',
                        lineHeight: 1.75,
                        color: G.muted,
                      }}
                    >
                      {proj.desc}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-2 mt-5 self-start group/link"
                    style={{
                      color: G.gold,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      paddingBottom: '3px',
                      borderBottom: `1px solid ${G.goldBorder}`,
                      cursor: 'pointer',
                    }}
                  >
                    View Project
                    <ArrowUpRight size={11} />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 05 — PROCESS
// ═══════════════════════════════════════════════════════════════════════════════
const steps = [
  { num: '01', title: 'Discovery & Brief',       duration: '1–2 Weeks',      desc: 'We begin by listening. Site visits, stakeholder interviews, and a thorough programme brief allow us to understand your vision, constraints, and aspirations before a single line is drawn.' },
  { num: '02', title: 'Concept Design',          duration: '2–4 Weeks',      desc: 'Our designers explore multiple directions through sketches, massing models, and mood studies. We present a curated concept that crystallises your brief into a spatial narrative.' },
  { num: '03', title: 'Design Development',      duration: '4–8 Weeks',      desc: 'The chosen concept is developed in detail — plans, sections, elevations, material boards. Every decision is validated against your programme, budget, and regulatory requirements.' },
  { num: '04', title: 'Technical Documentation', duration: '4–6 Weeks',      desc: 'We produce a complete set of construction documents: architectural drawings, specifications, BOQ, and coordination drawings aligned with structural and MEP consultants.' },
  { num: '05', title: 'Construction & Handover', duration: 'Project Duration', desc: 'On-site architectural supervision ensures the built work faithfully reflects design intent. We conduct regular inspections and hold snagging reviews before handover.' },
];

function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden" style={{ background: G.sec, padding: 'clamp(64px, 10vw, 160px) 0' }}>
      <WineGlow position="center" intensity={0.6} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        <Reveal className="mb-10 lg:mb-24">
          <SectionLabel>Our Method</SectionLabel>
          <div className="flex flex-col lg:flex-row gap-10 lg:items-end">
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(42px, 4.8vw, 70px)',
                fontWeight: 700,
                color: G.ivory,
                lineHeight: 1.06,
                letterSpacing: '-0.022em',
                flex: 1,
              }}
            >
              From First Meeting<br />to Final Handover
            </h2>
            <p
              style={{
                color: G.muted,
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '19px',
                lineHeight: 1.8,
                maxWidth: '360px',
              }}
            >
              A rigorous yet collaborative process that keeps you informed,
              in control, and confident at every stage.
            </p>
          </div>
        </Reveal>

        <div className="space-y-1">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.07}>
              <motion.div
                className="group flex gap-5 sm:gap-8 lg:gap-14 p-5 sm:p-8 lg:p-10 relative overflow-hidden"
                style={{ borderRadius: '16px', border: '1px solid transparent' }}
                whileHover={{
                  backgroundColor: G.bg,
                  borderColor: G.glassBorder,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Left wine accent on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform duration-400 origin-top"
                  style={{ background: `linear-gradient(180deg, ${G.wine}, transparent)` }}
                />

                {/* Step number */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center"
                    style={{
                      background: G.glassWine,
                      border: `1px solid ${G.wineBorder}`,
                      borderRadius: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(26px, 2.8vw, 36px)',
                        fontWeight: 300,
                        color: G.wine,
                        lineHeight: 1,
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 py-1 lg:py-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <h3
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(19px, 2.2vw, 26px)',
                        fontWeight: 600,
                        color: G.ivory,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: G.gold,
                        background: G.goldDim,
                        border: `1px solid ${G.goldBorder}`,
                        padding: '4px 12px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap',
                        alignSelf: 'flex-start',
                        fontWeight: 500,
                      }}
                    >
                      {step.duration}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      lineHeight: 1.82,
                      color: G.muted,
                      maxWidth: '580px',
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 06 — TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════
const testimonials = [
  {
    quote: "Homgrid transformed our vision into something we could never have imagined alone. The attention to detail — from the orientation of each room to the specification of every door handle — was extraordinary.",
    author: 'Rajesh & Priya Sharma',
    role: 'Residential Client · Vrindavan',
    initials: 'RS',
  },
  {
    quote: "Working with Homgrid on our Noida office was unlike any contractor experience I have had. They brought genuine design intelligence to a brief that others would have reduced to a fit-out exercise.",
    author: 'Ankit Mehrotra',
    role: 'Managing Director · Delhi NCR',
    initials: 'AM',
  },
  {
    quote: "They understood that our pavilion needed to be a place people remember. The way they wove the landscape and the architecture together — it feels like it grew there naturally.",
    author: 'Sunita Agarwal',
    role: 'Event & Hospitality Developer',
    initials: 'SA',
  },
];

function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: G.bg, padding: 'clamp(64px, 10vw, 160px) 0' }}>
      <WineGlow position="bottom-left" intensity={1.1} />
      <WineGlow position="top-right" intensity={0.6} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        <Reveal className="text-center mb-10 lg:mb-24">
          <SectionLabel>Client Voices</SectionLabel>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(38px, 4.8vw, 68px)',
              fontWeight: 700,
              color: G.ivory,
              lineHeight: 1.1,
              letterSpacing: '-0.022em',
            }}
          >
            What Our Clients Say
          </h2>
        </Reveal>

        <motion.div
          className="grid md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative p-10 lg:p-12 overflow-hidden"
              style={{
                background: G.glass,
                border: `1px solid ${G.glassBorder}`,
                backdropFilter: 'blur(24px)',
                borderRadius: '16px',
              }}
              whileHover={{ borderColor: G.goldBorder, y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${G.wine}, transparent)` }}
              />

              {/* Corner wine blush */}
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${G.wineGlow}, transparent 65%)` }}
              />

              {/* Quotation mark */}
              <div
                className="mb-8"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '72px',
                  lineHeight: 0.7,
                  color: G.wine,
                  opacity: 0.35,
                  fontWeight: 300,
                  userSelect: 'none',
                }}
              >
                "
              </div>

              <p
                className="mb-10"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '19px',
                  lineHeight: 1.8,
                  color: G.ivory,
                  fontStyle: 'italic',
                  opacity: 0.92,
                }}
              >
                {t.quote}
              </p>

              <GoldRule className="mb-8" />

              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: G.glassWine,
                    border: `1px solid ${G.wineBorder}`,
                    borderRadius: '10px',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: G.ivory,
                    letterSpacing: '0.05em',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: G.ivory }}>
                    {t.author}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: G.muted, marginTop: '3px', letterSpacing: '0.02em' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 07 — CTA STRIP
// ═══════════════════════════════════════════════════════════════════════════════
function CtaStrip() {
  return (
    <Reveal>
      <div
        className="relative overflow-hidden py-16 md:py-28 px-6 lg:px-20 text-center"
        style={{
          background: `linear-gradient(135deg, ${G.burgundy} 0%, ${G.wine} 50%, ${G.burgundy} 100%)`,
          borderTop: `1px solid ${G.wineBorder}`,
          borderBottom: `1px solid ${G.wineBorder}`,
        }}
      >
        {/* Gold shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,169,110,0.14) 0%, transparent 70%)` }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
        />

        <p
          className="relative mb-5"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(10,9,7,0.55)',
            fontWeight: 500,
          }}
        >
          Ready to Build Something Extraordinary?
        </p>
        <h2
          className="relative mb-12"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(34px, 4.5vw, 60px)',
            fontWeight: 700,
            color: G.ivory,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
        >
          Your Vision.<br />
          <em style={{ fontStyle: 'italic', color: G.gold }}>Our Craft.</em>
        </h2>
        <motion.a
          href="#contact"
          className="relative inline-flex items-center gap-3"
          style={{
            background: G.ivory,
            color: G.burgundy,
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '16px 44px',
            borderRadius: '50px',
            textDecoration: 'none',
          }}
          whileHover={{ scale: 1.02, backgroundColor: '#F5F0E8' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          Begin a Project
          <ArrowUpRight size={15} />
        </motion.a>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 08 — CONTACT
// ═══════════════════════════════════════════════════════════════════════════════
function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden" style={{ background: G.bg, padding: 'clamp(64px, 10vw, 160px) 0' }}>
      <WineGlow position="top-left" intensity={1.0} />
      <WineGlow position="bottom-right" intensity={0.8} />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-20">
        <Reveal className="mb-10 lg:mb-24">
          <SectionLabel>Find Us</SectionLabel>
          <div className="flex flex-col lg:flex-row gap-10 lg:items-end justify-between">
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(42px, 4.8vw, 70px)',
                fontWeight: 700,
                color: G.ivory,
                lineHeight: 1.06,
                letterSpacing: '-0.022em',
              }}
            >
              Two Studios.<br />
              One Vision.
            </h2>
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '19px',
                lineHeight: 1.8,
                color: G.muted,
                maxWidth: '360px',
              }}
            >
              Visit us in Vrindavan or our Noida studio. We welcome clients
              by appointment and are reachable across all channels.
            </div>
          </div>
        </Reveal>

        {/* Office cards */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Vrindavan */}
          <Reveal variant={slideLeft}>
            <motion.a
              href="https://www.google.com/maps/place/Homgrid+Architects/@27.5610187,77.6810692,515m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397371cb02ea2147:0x709c26692cc18e9f!8m2!3d27.5610187!4d77.6810692!16s%2Fg%2F11w_zdmcjk"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 sm:p-10 lg:p-12 relative overflow-hidden group"
              style={{
                background: G.glass,
                border: `1px solid ${G.glassBorder}`,
                backdropFilter: 'blur(24px)',
                borderRadius: '16px',
                textDecoration: 'none',
              }}
              whileHover={{ borderColor: G.goldBorder }}
              transition={{ duration: 0.35 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, ${G.wine}, transparent)` }}
              />
              <WineGlow position="top-left" intensity={0.7} />

              <div className="flex items-start justify-between mb-10">
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: G.wine, marginBottom: '10px', fontWeight: 600 }}>
                    Studio One
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', fontWeight: 700, color: G.ivory, letterSpacing: '-0.015em' }}>
                    Vrindavan
                  </h3>
                </div>
                <MapPin size={18} style={{ color: G.gold, marginTop: '6px', flexShrink: 0 }} />
              </div>

              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 2.0, color: G.muted }}>
                Plot No.20, Mathura–Vrindavan Marg<br />
                Girraj Nagar Colony, Vatsalya Gram<br />
                Vrindavan, Uttar Pradesh — 281121
              </div>

              <div
                className="flex items-center gap-2 mt-10 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: G.gold, fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                Open in Maps <ArrowUpRight size={12} />
              </div>
            </motion.a>
          </Reveal>

          {/* Noida */}
          <Reveal variant={slideRight}>
            <motion.a
              href="https://www.google.com/maps/place/Homgrid+Architects/@27.5610187,77.6810692"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 sm:p-10 lg:p-12 relative overflow-hidden group"
              style={{
                background: G.glass,
                border: `1px solid ${G.glassBorder}`,
                backdropFilter: 'blur(24px)',
                borderRadius: '16px',
                textDecoration: 'none',
              }}
              whileHover={{ borderColor: G.goldBorder }}
              transition={{ duration: 0.35 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${G.wine})` }}
              />
              <WineGlow position="top-right" intensity={0.7} />

              <div className="flex items-start justify-between mb-10">
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: G.wine, marginBottom: '10px', fontWeight: 600 }}>
                    Studio Two
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', fontWeight: 700, color: G.ivory, letterSpacing: '-0.015em' }}>
                    Noida
                  </h3>
                </div>
                <MapPin size={18} style={{ color: G.gold, marginTop: '6px', flexShrink: 0 }} />
              </div>

              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 2.0, color: G.muted }}>
                7th Floor, Plot No BW-58<br />
                Logix City Centre, Wave City Center<br />
                Sector 32, Noida<br />
                Uttar Pradesh — 201307
              </div>

              <div
                className="flex items-center gap-2 mt-10 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: G.gold, fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                Open in Maps <ArrowUpRight size={12} />
              </div>
            </motion.a>
          </Reveal>
        </div>

        {/* Contact channels */}
        <Reveal delay={0.15}>
          <div
            className="grid sm:grid-cols-3 overflow-hidden"
            style={{ border: `1px solid ${G.glassBorder}`, borderRadius: '16px' }}
          >
            {[
              { icon: <Phone size={18} style={{ color: G.gold }} />,        label: 'Call Us',    value: '+91 78303 55661',    sub: 'Mon–Sat · 10 AM – 5:30 PM',    href: 'tel:+917830355661' },
              { icon: <MessageCircle size={18} style={{ color: G.gold }} />, label: 'WhatsApp',  value: 'Message Us',         sub: 'Quick replies guaranteed',      href: 'http://wa.link/i628n0' },
              { icon: <Instagram size={18} style={{ color: G.gold }} />,    label: 'Instagram', value: '@homgridarchitects', sub: 'Projects · Behind the scenes', href: 'https://www.instagram.com/homgridarchitects' },
            ].map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="relative flex flex-col gap-4 p-6 sm:p-8 lg:p-10 group overflow-hidden hg-contact-channel"
                style={{
                  background: 'rgba(255,252,248,0.55)',
                  textDecoration: 'none',
                  }}
                whileHover={{ backgroundColor: 'rgba(255,252,248,0.85)' }}
                transition={{ duration: 0.25 }}
              >
                {/* Wine left border on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"
                  style={{ background: G.wine }}
                />
                <div>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '6px', fontWeight: 600 }}>
                    {c.label}
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: G.ivory, letterSpacing: '-0.01em', marginBottom: '5px' }}>
                    {c.value}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: G.muted }}>
                    {c.sub}
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: G.gold, fontSize: '10px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}
                >
                  Connect <ArrowUpRight size={10} />
                </div>
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 09 — FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: G.sec, borderTop: `1px solid ${G.glassBorder}` }}
    >
      <WineGlow position="bottom-left" intensity={0.6} />

      <div className="max-w-screen-xl mx-auto px-8 lg:px-20 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-7">
              <svg width="26" height="26" viewBox="0 0 256 256" fill={G.wine} aria-hidden="true">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: G.ivory,
                  letterSpacing: '-0.01em',
                }}
              >
                Homgrid Architects
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '18px',
                fontStyle: 'italic',
                color: G.muted,
                lineHeight: 1.75,
                maxWidth: '340px',
                marginBottom: '28px',
              }}
            >
              Designing Timeless Spaces,<br />Building Exceptional Experiences.
            </p>
            <div style={{ width: '40px', height: '1px', background: `linear-gradient(90deg, ${G.wine}, ${G.gold})` }} />
          </div>

          {/* Navigate */}
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: G.wine, marginBottom: '22px', fontWeight: 600 }}>
              Navigate
            </div>
            <ul className="space-y-4">
              {['Philosophy', 'Services', 'Portfolio', 'Process', 'Contact'].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: G.muted,
                      textDecoration: 'none',
                      transition: 'color 0.25s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = G.ivory)}
                    onMouseLeave={e => (e.currentTarget.style.color = G.muted)}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: G.wine, marginBottom: '22px', fontWeight: 600 }}>
              Connect
            </div>
            <ul className="space-y-4">
              {[
                { label: '+91 78303 55661', href: 'tel:+917830355661' },
                { label: 'WhatsApp',        href: 'http://wa.link/i628n0' },
                { label: 'Instagram',       href: 'https://www.instagram.com/homgridarchitects' },
                { label: 'Google Maps',     href: 'https://www.google.com/maps/place/Homgrid+Architects/@27.5610187,77.6810692' },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: G.muted,
                      textDecoration: 'none',
                      transition: 'color 0.25s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = G.ivory)}
                    onMouseLeave={e => (e.currentTarget.style.color = G.muted)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <GoldRule className="mb-10" />

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: G.muted, opacity: 0.55 }}>
            © {new Date().getFullYear()} Homgrid Architects. All rights reserved. · Vrindavan · Noida
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: G.muted, opacity: 0.35, letterSpacing: '0.08em' }}>
            Designing Timeless Spaces
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomgridPage() {
  return (
    <div style={{ background: G.sec }}>
      {/* Torn edge: hero image (light) tears into marquee strip */}
      <TornEdge above="#FAF8F5" below={G.sec} />
      <MarqueeStrip />
      <TornEdge above={G.sec} below={G.bg} flip />
      <AboutSection />
      <TornEdge above={G.bg} below={G.sec} />
      <ServicesSection />
      <TornEdge above={G.sec} below={G.bg} flip />
      <AIFeatureSection />
      <TornEdge above={G.bg} below={G.sec} />
      <ProjectsSection />
      <TornEdge above={G.bg} below={G.sec} />
      <ProcessSection />
      <TornEdge above={G.sec} below={G.bg} flip />
      <TestimonialsSection />
      <TornEdge above={G.bg} below={G.burgundy} />
      <CtaStrip />
      <TornEdge above={G.wine} below={G.sec} flip />
      <ContactSection />
      <Footer />
    </div>
  );
}
