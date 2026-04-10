import React, { useState, useEffect, useRef, useCallback } from 'react';

export const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'} ${className}`}>
      {children}
    </div>
  );
};

export function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: `${style.size}px`,
        height: `${style.size}px`,
        left: `${style.x}%`,
        top: `${style.y}%`,
        background: style.color,
        opacity: style.opacity,
        /* GPU compositing: promote to own layer, prevent layout reflow */
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
        contain: 'strict',
        filter: 'blur(1px)',
        animation: `float ${style.duration}s ease-in-out infinite`,
        animationDelay: `${style.delay}s`,
      }}
    />
  );
}

export function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.01,1.01,1.01)`;
  };
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'; };
  return <div ref={ref} className={className} style={{ transition: 'transform 0.2s ease-out', transformStyle: 'preserve-3d', ...style }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>{children}</div>;
}

export const HandheldSVG = () => (
  <div className="w-full h-full pointer-events-none drop-shadow-[0_0_30px_rgba(139,92,246,0.15)]">
    <svg width="100%" height="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e1e3a"/><stop offset="100%" stopColor="#0d0d1e"/></linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1628"/><stop offset="100%" stopColor="#050d1a"/></linearGradient>
        <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0"/><stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/></linearGradient>
        <linearGradient id="btnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#0891b2"/></linearGradient>
        <linearGradient id="highlightGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ffffff" stopOpacity="0"/><stop offset="40%" stopColor="#ffffff" stopOpacity="0.07"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="200" y="30" width="280" height="460" rx="36" fill="url(#bodyGrad)" stroke="#2e2e5a" strokeWidth="1.5"/>
      <rect x="202" y="32" width="276" height="180" rx="34" fill="url(#highlightGrad)"/>
      <rect x="218" y="52" width="244" height="164" rx="12" fill="url(#screenGrad)" stroke="#1a2a4a" strokeWidth="1"/>
      <text x="228" y="76" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="2">SCANPAY HANDHELD</text>
      <rect x="228" y="84" width="90" height="28" rx="6" fill="#0f1a30" stroke="#1e3050" strokeWidth="0.5"/>
      <text x="238" y="96" fill="#94a3b8" fontSize="8">Items</text>
      <text x="238" y="107" fill="#06b6d4" fontSize="11" fontWeight="700">14</text>
      <rect x="324" y="84" width="108" height="28" rx="6" fill="#0f1a30" stroke="#1e3050" strokeWidth="0.5"/>
      <text x="334" y="96" fill="#94a3b8" fontSize="8">Total</text>
      <text x="334" y="107" fill="#10b981" fontSize="11" fontWeight="700">$47.82</text>
      <rect x="228" y="118" width="204" height="44" rx="6" fill="#060e1c" stroke="#0e2040" strokeWidth="0.5"/>
      <line x1="238" y1="130" x2="238" y2="152" stroke="#1e3a5a" strokeWidth="1"/>
      <line x1="248" y1="126" x2="248" y2="156" stroke="#1e3a5a" strokeWidth="1"/>
      <line x1="255" y1="128" x2="255" y2="154" stroke="#0d2040" strokeWidth="0.8"/>
      <line x1="261" y1="126" x2="261" y2="156" stroke="#1e3a5a" strokeWidth="1"/>
      <line x1="323" y1="126" x2="323" y2="156" stroke="#1e3a5a" strokeWidth="1"/>
      <line x1="416" y1="130" x2="416" y2="152" stroke="#0d2040" strokeWidth="0.8"/>
      <line x1="422" y1="126" x2="422" y2="156" stroke="#1e3a5a" strokeWidth="1"/>
      <rect x="228" y="126" width="10" height="30" rx="1" fill="#060e1c" stroke="none"/>
      <rect x="420" y="126" width="12" height="30" rx="1" fill="#060e1c" stroke="none"/>
      
      <rect className="scan-beam" x="228" y="170" width="204" height="8" rx="4" fill="url(#scanBeam)" opacity="0.9" />
      <text className="blink" x="340" y="177" textAnchor="middle" fill="#003344" fontSize="6" fontWeight="700" letterSpacing="1">SCAN ITEM</text>
      <rect x="218" y="230" width="244" height="120" rx="10" fill="#0a0f1c" stroke="#1a1a3a" strokeWidth="0.5"/>
      <text x="235" y="302" fill="#94a3b8" fontSize="8">Battery</text>
      <rect className="batt" x="286" y="296" width="22" height="6" rx="1.5" fill="#10b981" />
      <text x="335" y="302" fill="#94a3b8" fontSize="8">Sync</text>
      <circle cx="371" cy="299" r="4" fill="#10b981" />
      <text x="340" y="334" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" letterSpacing="0.5">Confirm &amp; Pay</text>
      <rect x="218" y="364" width="244" height="50" rx="10" fill="#070c18" stroke="#111830" strokeWidth="0.5"/>
      <text x="268" y="387" fill="#94a3b8" fontSize="9">Cart device dock</text>
      <text x="268" y="399" fill="#475569" fontSize="8">Snap-fit magnetic mount</text>
      <text x="148" y="88" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">ScanPay</text>
      <text x="148" y="106" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">Handheld</text>
      <circle cx="148" cy="130" r="30" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3"/>
      <text x="534" y="200" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">14h</text>
      <text x="534" y="214" textAnchor="middle" fill="#475569" fontSize="8">battery</text>
    </svg>
  </div>
);

export const KioskSVG = () => (
  <div className="w-full h-full pointer-events-none drop-shadow-[0_0_40px_rgba(6,182,212,0.1)]">
    <svg width="100%" height="100%" viewBox="0 0 680 580" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kBodyGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a1a32"/><stop offset="100%" stopColor="#0d0d1e"/></linearGradient>
        <linearGradient id="kPoleGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#141428"/><stop offset="50%" stopColor="#222240"/><stop offset="100%" stopColor="#141428"/></linearGradient>
        <linearGradient id="kBaseGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e1e3a"/><stop offset="100%" stopColor="#0d0d1c"/></linearGradient>
        <linearGradient id="kScreenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#080f20"/><stop offset="100%" stopColor="#040a18"/></linearGradient>
        <linearGradient id="kBtnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#0891b2"/></linearGradient>
        <linearGradient id="kScanLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0"/><stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/></linearGradient>
        <linearGradient id="kHighlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.06"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
        <filter id="kGlow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      <rect x="255" y="490" width="170" height="18" rx="6" fill="url(#kBaseGrad)" stroke="#252545" strokeWidth="1"/>
      <rect x="245" y="504" width="190" height="10" rx="5" fill="#111128" stroke="#1e1e3a" strokeWidth="0.5"/>
      <rect x="235" y="510" width="210" height="8" rx="4" fill="#0d0d22" stroke="#1a1a38" strokeWidth="0.5"/>
      
      <rect x="313" y="390" width="54" height="104" rx="6" fill="url(#kPoleGrad)" stroke="#252545" strokeWidth="0.5"/>
      <rect x="318" y="392" width="8" height="100" rx="3" fill="#1a1a38" opacity="0.4"/>
      <rect x="354" y="392" width="8" height="100" rx="3" fill="#1a1a38" opacity="0.2"/>
      
      <rect x="215" y="80" width="250" height="316" rx="16" fill="url(#kBodyGrad)" stroke="#2a2a50" strokeWidth="1.5"/>
      <rect x="216" y="81" width="248" height="160" rx="15" fill="url(#kHighlight)"/>
      <rect x="228" y="95" width="224" height="160" rx="10" fill="url(#kScreenGrad)" stroke="#0e1e3c" strokeWidth="1"/>
      
      <text x="340" y="116" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="600" letterSpacing="2">SCANPAY KIOSK PRO</text>
      
      <rect x="238" y="122" width="68" height="32" rx="5" fill="#0a1528" stroke="#112040" strokeWidth="0.5"/>
      <text x="243" y="135" fill="#64748b" fontSize="7">Transactions</text>
      <text x="243" y="148" fill="#06b6d4" fontSize="12" fontWeight="700">2,847</text>
      
      <rect x="312" y="122" width="68" height="32" rx="5" fill="#0a1528" stroke="#112040" strokeWidth="0.5"/>
      <text x="317" y="135" fill="#64748b" fontSize="7">Revenue</text>
      <text x="317" y="148" fill="#10b981" fontSize="12" fontWeight="700">$48.2k</text>
      
      <rect x="386" y="122" width="58" height="32" rx="5" fill="#0a1528" stroke="#112040" strokeWidth="0.5"/>
      <text x="391" y="135" fill="#64748b" fontSize="7">Queue</text>
      <text x="391" y="148" fill="#f59e0b" fontSize="12" fontWeight="700">0 sec</text>
      
      <rect x="238" y="162" width="206" height="56" rx="6" fill="#060e1c" stroke="#0c1e3a" strokeWidth="0.5"/>
      <rect className="kscan" x="238" y="162" width="206" height="3" rx="1" fill="url(#kScanLine)" opacity="0.8"/>

      <text className="kblink" x="288" y="243" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="700" letterSpacing="0.5">Scan Item</text>
      <rect x="228" y="272" width="224" height="50" rx="6" fill="#060d1c" stroke="#0c1830" strokeWidth="0.5"/>
      <text x="263" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Weight</text>
      <text x="263" y="307" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="700">0.84kg</text>
      <text x="331" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Product</text>
      <text x="331" y="307" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Verified</text>
      <circle cx="375" cy="297" r="5" fill="#10b981" />
      
      <rect x="228" y="332" width="224" height="52" rx="8" fill="#070d1a" stroke="#0e1e38" strokeWidth="0.5"/>
      <text x="280" y="355" fill="#94a3b8" fontSize="9" fontWeight="600">Payment ready</text>
      <text x="280" y="368" fill="#475569" fontSize="8">Tap, insert, or swipe</text>
      
      <text x="108" y="120" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="700">ScanPay</text>
      <text x="108" y="138" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="700">Kiosk Pro</text>
      <circle cx="108" cy="128" r="36" fill="none" stroke="#06b6d4" strokeWidth="0.4" opacity="0.25"/>
      <text x="572" y="140" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">15" display</text>
      <text x="572" y="220" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">AI weight</text>
    </svg>
  </div>
);

export function InteractiveHeroModel({ children, rotateLimit = 40 }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * rotateLimit; 
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -rotateLimit; 
    el.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = `perspective(1200px) rotateY(${rotateLimit/3}deg) rotateX(${rotateLimit/4}deg) scale3d(1, 1, 1)`; };
  useEffect(() => { handleMouseLeave(); }, []); 

  return (
    <div className="relative w-full max-w-[680px] h-auto aspect-video mx-auto cursor-crosshair z-20 group" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={ref} className="w-full h-full relative" style={{ transition: 'transform 0.3s ease-out', transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-20 bg-cyan-500/20 blur-[80px] rounded-full -z-10 group-hover:bg-cyan-400/30 transition-colors duration-500" style={{ transform: 'translateZ(-50px)' }} />
        {children}
      </div>
    </div>
  );
}

export const LogoLoop = ({ logos = [], speed = 40, direction = 'left', logoHeight = 64, gap = 32, fadeOut = true, scaleOnHover = false }) => {
  return (
    <div className={`flex overflow-hidden relative w-full ${fadeOut ? 'mask-edges' : ''}`} style={{ gap: `${gap}px` }}>
      <style>{`
        @keyframes scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(calc(-100% - ${gap}px), 0, 0); }
        }
      `}</style>
      <div className="flex min-w-full shrink-0 items-center justify-around will-change-transform" style={{ animation: `scroll ${speed}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`, gap: `${gap}px` }}>
        {logos.map((logo, i) => (
          <div key={`logo-1-${i}`} className={`flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 ${scaleOnHover ? 'hover:scale-110' : ''}`} style={{ height: logoHeight }}>
            {typeof logo === 'string' ? <img src={logo} alt="Partner" style={{ height: '100%', objectFit: 'contain' }} /> : (logo.node || logo)}
          </div>
        ))}
      </div>
      <div className="flex min-w-full shrink-0 items-center justify-around will-change-transform" style={{ animation: `scroll ${speed}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`, gap: `${gap}px` }} aria-hidden="true">
        {logos.map((logo, i) => (
          <div key={`logo-2-${i}`} className={`flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 ${scaleOnHover ? 'hover:scale-110' : ''}`} style={{ height: logoHeight }}>
            {typeof logo === 'string' ? <img src={logo} alt="Partner" style={{ height: '100%', objectFit: 'contain' }} /> : (logo.node || logo)}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// SKELETON SYSTEM
// ============================================================

/* Inject shimmer keyframes once */
if (typeof document !== 'undefined' && !document.getElementById('skeleton-keyframes')) {
  const el = document.createElement('style');
  el.id = 'skeleton-keyframes';
  el.textContent = `
    @keyframes skeletonShimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes skeletonFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .skeleton-page { animation: skeletonFadeIn 0.25s ease forwards; }
  `;
  document.head.appendChild(el);
}

/**
 * usePageLoader — returns { loading } that flips to false after `ms` ms.
 */
export function usePageLoader(ms = 900) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return { loading };
}

/**
 * Base Skeleton block — a shimmer rectangle.
 * All sizing / radius comes from className / style.
 */
export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.05)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)',
          animation: 'skeletonShimmer 1.6s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// HOME PAGE SKELETON
// ------------------------------------------------------------------
export function HomePageSkeleton() {
  return (
    <div className="skeleton-page pt-48 pb-10 px-4">
      {/* Hero */}
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <Skeleton className="rounded-full" style={{ width: 220, height: 28 }} />
        <Skeleton className="rounded-2xl" style={{ width: '70%', height: 80 }} />
        <Skeleton className="rounded-2xl" style={{ width: '50%', height: 28 }} />
        <Skeleton className="rounded-2xl" style={{ width: '42%', height: 20 }} />
        <div className="flex gap-4 mt-2">
          <Skeleton className="rounded-xl" style={{ width: 180, height: 52 }} />
          <Skeleton className="rounded-xl" style={{ width: 180, height: 52 }} />
        </div>
        {/* Hero model placeholder */}
        <Skeleton className="rounded-3xl mt-4" style={{ width: '100%', maxWidth: 680, height: 280 }} />
      </div>

      {/* Logo strip */}
      <div className="py-16 my-10 px-4">
        <Skeleton className="rounded-full mx-auto mb-8" style={{ width: 200, height: 14 }} />
        <div className="flex gap-6 overflow-hidden justify-center">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="rounded-2xl shrink-0" style={{ width: 140, height: 64 }} />
          ))}
        </div>
      </div>

      {/* Products section */}
      <div className="max-w-5xl mx-auto px-4">
        <Skeleton className="rounded-lg mb-4" style={{ width: 160, height: 14 }} />
        <Skeleton className="rounded-2xl mb-2" style={{ width: '55%', height: 52 }} />
        <Skeleton className="rounded-lg mb-12" style={{ width: '40%', height: 20 }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="rounded-[2rem]" style={{ height: 400 }} />
          <Skeleton className="rounded-[2rem]" style={{ height: 400 }} />
          <Skeleton className="rounded-[2rem] lg:col-span-2" style={{ height: 320 }} />
        </div>
      </div>

      {/* Why us */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <Skeleton className="rounded-lg mx-auto mb-4" style={{ width: 160, height: 14 }} />
        <Skeleton className="rounded-2xl mx-auto mb-12" style={{ width: '40%', height: 44 }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="rounded-3xl" style={{ height: 280 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// PRODUCTS PAGE SKELETON
// ------------------------------------------------------------------
export function ProductsPageSkeleton() {
  return (
    <div className="skeleton-page pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center gap-4">
          <Skeleton className="rounded-full" style={{ width: 180, height: 28 }} />
          <Skeleton className="rounded-2xl" style={{ width: '60%', height: 72 }} />
          <Skeleton className="rounded-2xl" style={{ width: '45%', height: 20 }} />
        </div>

        {/* Two product rows */}
        <div className="space-y-20">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 lg:gap-20 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <Skeleton className="rounded-[3rem]" style={{ height: 380 }} />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <Skeleton className="rounded-lg" style={{ width: 120, height: 12 }} />
                <Skeleton className="rounded-2xl" style={{ width: '80%', height: 54 }} />
                <Skeleton className="rounded-2xl" style={{ width: 120, height: 32 }} />
                <Skeleton className="rounded-2xl" style={{ width: '90%', height: 60 }} />
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="rounded-xl" style={{ height: 48 }} />
                  ))}
                </div>
                <Skeleton className="rounded-xl mt-2" style={{ width: '60%', height: 52 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// SERVICES PAGE SKELETON
// ------------------------------------------------------------------
export function ServicesPageSkeleton() {
  return (
    <div className="skeleton-page pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center gap-4">
          <Skeleton className="rounded-full" style={{ width: 180, height: 28 }} />
          <Skeleton className="rounded-2xl" style={{ width: '55%', height: 72 }} />
          <Skeleton className="rounded-2xl" style={{ width: '42%', height: 20 }} />
        </div>

        {/* 3-col cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-[2.5rem] p-10 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <Skeleton className="rounded-2xl" style={{ width: 72, height: 72 }} />
              <Skeleton className="rounded-lg" style={{ width: 100, height: 12 }} />
              <Skeleton className="rounded-2xl" style={{ width: '75%', height: 36 }} />
              <Skeleton className="rounded-lg" style={{ height: 72 }} />
              <div className="flex flex-col gap-2 mt-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="rounded-lg" style={{ height: 20 }} />
                ))}
              </div>
              {i === 0 && (
                <Skeleton className="rounded-2xl mt-4" style={{ height: 120 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// DOCS PAGE SKELETON
// ------------------------------------------------------------------
export function DocsPageSkeleton() {
  return (
    <div className="skeleton-page pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left: text column */}
        <div className="lg:w-1/2 flex flex-col gap-5">
          <Skeleton className="rounded-full" style={{ width: 160, height: 26 }} />
          <Skeleton className="rounded-2xl" style={{ width: '85%', height: 72 }} />
          <Skeleton className="rounded-lg" style={{ height: 64 }} />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="rounded-full shrink-0" style={{ width: 48, height: 48 }} />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="rounded-lg" style={{ width: '55%', height: 20 }} />
                <Skeleton className="rounded-lg" style={{ height: 40 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right: code block */}
        <div className="lg:w-1/2 w-full pt-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0d1117' }}
          >
            {/* Mac chrome dots */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex gap-1.5">
                {['#ef4444', '#eab308', '#22c55e'].map((c) => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <Skeleton className="rounded-full ml-4" style={{ width: 120, height: 12 }} />
            </div>
            <div className="p-8 flex flex-col gap-3">
              {[80, 60, 100, 50, 90, 70, 55, 80, 65].map((w, i) => (
                <Skeleton key={i} className="rounded-md" style={{ width: `${w}%`, height: 16 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// PROFILE PAGE SKELETON
// ------------------------------------------------------------------
export function ProfilePageSkeleton() {
  return (
    <div className="skeleton-page pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <Skeleton className="rounded-full" style={{ width: 80, height: 80 }} />
        <Skeleton className="rounded-2xl" style={{ width: 200, height: 28 }} />
        <Skeleton className="rounded-lg" style={{ width: 160, height: 16 }} />
        <div className="w-full flex flex-col gap-4 mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="rounded-2xl" style={{ height: 72 }} />
          ))}
        </div>
        <Skeleton className="rounded-xl w-full" style={{ height: 52 }} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// ORDER HISTORY PAGE SKELETON
// ------------------------------------------------------------------
export function OrderHistoryPageSkeleton() {
  return (
    <div className="skeleton-page pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="rounded-2xl mb-2" style={{ width: 200, height: 40 }} />
        <Skeleton className="rounded-lg mb-10" style={{ width: 260, height: 18 }} />
        <div className="flex flex-col gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex justify-between">
                <Skeleton className="rounded-lg" style={{ width: 140, height: 20 }} />
                <Skeleton className="rounded-full" style={{ width: 90, height: 24 }} />
              </div>
              <Skeleton className="rounded-lg" style={{ width: 100, height: 14 }} />
              <div className="flex gap-3">
                {[...Array(2)].map((_, j) => (
                  <Skeleton key={j} className="rounded-xl" style={{ width: 120, height: 40 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// SAVED ADDRESSES PAGE SKELETON
// ------------------------------------------------------------------
export function SavedAddressesPageSkeleton() {
  return (
    <div className="skeleton-page pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col gap-2">
            <Skeleton className="rounded-2xl" style={{ width: 220, height: 40 }} />
            <Skeleton className="rounded-lg" style={{ width: 280, height: 18 }} />
          </div>
          <Skeleton className="rounded-xl" style={{ width: 150, height: 48 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex justify-between">
                <Skeleton className="rounded-full" style={{ width: 80, height: 22 }} />
                <Skeleton className="rounded-full" style={{ width: 56, height: 22 }} />
              </div>
              <Skeleton className="rounded-lg" style={{ height: 18 }} />
              <Skeleton className="rounded-lg" style={{ width: '60%', height: 14 }} />
              <div className="flex gap-2 mt-1">
                <Skeleton className="rounded-lg" style={{ width: 70, height: 34 }} />
                <Skeleton className="rounded-lg" style={{ width: 70, height: 34 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
