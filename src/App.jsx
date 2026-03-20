import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { ShoppingCart, Server, Smartphone, LineChart, CheckCircle, X, ChevronRight, Zap, ArrowRight, Shield, BarChart3, Layers, Star, Users, TrendingUp, Package, Terminal, FileJson, Code, LogOut, CreditCard, Lock, Loader2, ChevronDown } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

// IMPORT AUTH FROM YOUR SECURE FIREBASE.JS FILE
import { auth } from './firebase';

// ==========================================
// 1. HELPER COMPONENTS
// ==========================================
const Reveal = ({ children, delay = 0, className = "" }) => {
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

function Particle({ style }) {
  return <div className="absolute rounded-full pointer-events-none" style={{ width: `${style.size}px`, height: `${style.size}px`, left: `${style.x}%`, top: `${style.y}%`, background: style.color, opacity: style.opacity, animation: `float ${style.duration}s ease-in-out infinite`, animationDelay: `${style.delay}s`, filter: 'blur(1px)' }} />;
}

function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // Reduced tilt for smoother large cards
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.01,1.01,1.01)`;
  };
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'; };
  return <div ref={ref} className={className} style={{ transition: 'transform 0.2s ease-out', transformStyle: 'preserve-3d', ...style }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>{children}</div>;
}

// ==========================================
// 2. LOGOLOOP COMPONENT
// ==========================================
const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };
const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));
const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => observers.forEach(observer => observer?.disconnect());
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) { onLoad(); return; }
    let remainingImages = images.length;
    const handleImageLoad = () => { remainingImages -= 1; if (remainingImages === 0) onLoad(); };
    images.forEach(img => {
      if (img.complete) handleImageLoad();
      else {
        img.addEventListener('load', handleImageLoad, { once: true });
        img.addEventListener('error', handleImageLoad, { once: true });
      }
    });
    return () => images.forEach(img => { img.removeEventListener('load', handleImageLoad); img.removeEventListener('error', handleImageLoad); });
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical ? `translate3d(0, ${-offsetRef.current}px, 0)` : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => { lastTimestampRef.current = null; };
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;
      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;
        track.style.transform = isVertical ? `translate3d(0, ${-offsetRef.current}px, 0)` : `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
};

const LogoLoop = memo(({ logos, speed = 120, direction = 'left', width = '100%', logoHeight = 28, gap = 32, pauseOnHover, hoverSpeed, fadeOut = false, fadeOutColor, scaleOnHover = false }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => hoverSpeed !== undefined ? hoverSpeed : (pauseOnHover === true ? 0 : undefined), [hoverSpeed, pauseOnHover]);
  const targetVelocity = useMemo(() => Math.abs(speed) * (direction === 'left' ? 1 : -1) * (speed < 0 ? -1 : 1), [speed, direction]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, 0, isHovered, effectiveHoverSpeed, false);

  const cssVariables = useMemo(() => ({ '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px` }), [gap, logoHeight]);
  const logoLists = useMemo(() => Array.from({ length: copyCount }, (_, copyIndex) => <ul className="flex items-center flex-row" key={`copy-${copyIndex}`} role="list" aria-hidden={copyIndex > 0} ref={copyIndex === 0 ? seqRef : undefined}>{logos.map((item, itemIndex) => <li className="flex-none text-[length:var(--logoloop-logoHeight)] leading-[1] mr-[var(--logoloop-gap)]" key={`${copyIndex}-${itemIndex}`}>{item.node}</li>)}</ul>), [copyCount, logos]);

  return (
    <div ref={containerRef} className="relative group overflow-x-hidden" style={{ width: '100%', ...cssVariables }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex will-change-transform select-none relative z-0 flex-row w-max" ref={trackRef}>{logoLists}</div>
    </div>
  );
});
LogoLoop.displayName = 'LogoLoop';

const retailLogos = [
  { node: <span className="font-bold text-2xl tracking-tighter text-[#0071ce] flex items-center gap-2">Walmart <Zap className="w-5 h-5 text-[#ffc220] fill-[#ffc220]"/></span> },
  { node: <span className="font-black text-2xl tracking-tighter text-[#e31837]">COSTCO <span className="text-[#005daal] font-bold">WHOLESALE</span></span> },
  { node: <span className="font-bold text-3xl tracking-tight text-[#0057b8] font-serif italic">Kroger</span> },
  { node: <span className="font-black text-2xl tracking-tighter text-[#ee1c2e]">TESCO</span> },
  { node: <span className="font-black text-2xl tracking-tighter text-[#003b7a] bg-[#f58220] px-3 py-1 rounded">ALDI</span> },
  { node: <span className="font-bold text-2xl tracking-tight text-[#0050aa] border-b-4 border-[#fff100]">Lidl</span> },
  { node: <span className="font-bold text-2xl tracking-tighter text-[#0056a8]">Carrefour <span className="text-[#d81124]">&gt;</span></span> },
  { node: <span className="font-black text-2xl tracking-tighter text-[#007e61]">7-<span className="text-[#ea2839]">ELEVEn</span></span> },
  { node: <span className="font-bold text-2xl tracking-tighter text-[#cc0000] flex items-center gap-1"><div className="w-5 h-5 rounded-full border-4 border-[#cc0000] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full"/></div>Target</span> },
].map(logo => ({
  node: <div className="flex items-center justify-center px-8 py-3 h-16 bg-white/[0.06] border border-white/[0.12] rounded-2xl hover:bg-white/[0.15] hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-md cursor-default text-white">{logo.node}</div>
}));

// ==========================================
// 3. HARDWARE SVGS & INTERACTIVE WRAPPER
// ==========================================
const HandheldSVG = () => (
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
      <g className="scan-beam"><rect x="228" y="128" width="204" height="6" rx="1" fill="url(#scanBeam)" opacity="0.8"/></g>
      <rect x="228" y="170" width="204" height="8" rx="4" fill="#06b6d4" opacity="0.9" filter="url(#glow)"/>
      <text x="340" y="177" textAnchor="middle" fill="#003344" fontSize="6" fontWeight="700" letterSpacing="1">SCAN ITEM</text>
      <rect x="218" y="230" width="244" height="120" rx="10" fill="#0a0f1c" stroke="#1a1a3a" strokeWidth="0.5"/>
      <text x="235" y="302" fill="#94a3b8" fontSize="8">Battery</text>
      <rect x="286" y="296" width="22" height="6" rx="1.5" fill="#10b981" className="batt"/>
      <text x="335" y="302" fill="#94a3b8" fontSize="8">Sync</text>
      <circle cx="371" cy="299" r="4" fill="#10b981" className="blink"/>
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

const KioskSVG = () => (
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
      <g className="kscan"><rect x="238" y="166" width="206" height="5" rx="1" fill="url(#kScanLine)" opacity="0.9"/></g>
      
      <text x="288" y="243" textAnchor="middle" fill="#001a22" fontSize="9" fontWeight="700" letterSpacing="0.5">Scan Item</text>
      <rect x="228" y="272" width="224" height="50" rx="6" fill="#060d1c" stroke="#0c1830" strokeWidth="0.5"/>
      <text x="263" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Weight</text>
      <text x="263" y="307" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="700">0.84kg</text>
      <text x="331" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Product</text>
      <text x="331" y="307" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Verified</text>
      <circle cx="375" cy="297" r="5" fill="#10b981" className="kblink"/>
      
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

function InteractiveHeroModel({ children }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40; 
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -40; 
    el.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(1200px) rotateY(15deg) rotateX(10deg) scale3d(1, 1, 1)'; };
  useEffect(() => { handleMouseLeave(); }, []); 

  return (
    <div className="relative w-full max-w-[680px] h-[520px] mx-auto cursor-crosshair z-20 group" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={ref} className="w-full h-full relative" style={{ transition: 'transform 0.3s ease-out', transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-20 bg-cyan-500/20 blur-[80px] rounded-full -z-10 group-hover:bg-cyan-400/30 transition-colors duration-500" style={{ transform: 'translateZ(-50px)' }} />
        {children}
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN APP DATA & LOGIC
// ==========================================
const faqs = [
  { q: "How long does the hardware installation take?", a: "For a standard retail location, our technicians can deploy the complete ScanPay ecosystem within 48 hours. We operate during off-hours to prevent any disruption to your current store operations." },
  { q: "Does the system integrate with our current inventory?", a: "Yes. ThinkStack OS features plug-and-play API integrations for over 40 major retail ERPs and inventory management systems. Your stock levels sync in real-time." },
  { q: "What happens if a customer tries to walk out without paying?", a: "Our Kiosk Pro includes an AI-powered weight verification scale and computer vision anti-theft protocols. Handheld scanners feature geofencing that alerts security if an unpaid device leaves the premises." },
  { q: "Is the ThinkStack OS subscription mandatory?", a: "Yes. The ThinkStack OS is the intelligence layer that powers the hardware, processes payments, syncs inventory, and provides you with the analytics dashboard." }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');


  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // DYNAMIC PRODUCTS (Formatted to match the Bento Split design in reference image)
  const products = useMemo(() => [
    { 
      id: 1, name: "ScanPay Kiosk Pro", type: "Hardware", price: 1299, billing: "One-time", 
      description: "Freestanding self-checkout terminal with an edge-to-edge 15\" display, AI weight-verification scale, and lightning-fast payment gateway.", 
      features: ["Sub-second processing", "Apple Pay / Google Pay", "Anti-theft CV vision"], 
      specs: [{l: "Processor", v: "Octa-core ARM"}, {l: "Display", v: "15.6\" 4K Touch"}, {l: "Connectivity", v: "Wi-Fi 6, 5G LTE"}], 
      icon: Server, 
      customGraphic: <KioskSVG />, 
      accent: "#06b6d4", accentDark: "#0e7490", glow: "rgba(6,182,212,0.15)", badge: "Most Popular", span: "lg:col-span-2",
      hideDetails: true // Hide HTML details so it looks exactly like the left card in image_b52452.jpg
    },
    { 
      id: 2, name: "ScanPay Handheld", type: "Hardware (5-Pack)", price: 899, billing: "One-time", 
      description: "Military-grade mobile scanners that dock directly into shopping carts for the ultimate in-aisle customer experience.", 
      features: ["14-hour battery life", "Real-time cart sync", "Drop-resistant shell"], 
      specs: [{l: "Battery", v: "5000mAh"}, {l: "Durability", v: "IP67 Water/Dust"}, {l: "Scanner", v: "2D Omni-directional"}], 
      icon: Smartphone, 
      customGraphic: <HandheldSVG />, 
      accent: "#8b5cf6", accentDark: "#7c3aed", glow: "rgba(139,92,246,0.15)", badge: null, span: "lg:col-span-1" 
    },
    { 
      id: 3, name: "ThinkStack OS", type: "Enterprise Software", price: isAnnual ? 2499 : 249, billing: isAnnual ? "per year" : "per month", 
      description: "The intelligence layer behind your hardware. Centralized dashboard for inventory management, buyer heatmaps, and partner ad delivery.", 
      features: ["Live store analytics", "Targeted ad engine", "24/7 priority support"], 
      specs: [{l: "Uptime", v: "99.99% SLA"}, {l: "Updates", v: "Over-the-air (OTA)"}, {l: "Support", v: "24/7 Dedicated Team"}], 
      icon: LineChart, 
      accent: "#f59e0b", accentDark: "#d97706", glow: "rgba(245,158,11,0.15)", badge: isAnnual ? "Save 17%" : null, span: "lg:col-span-3" 
    }
  ], [isAnnual]);

  const [particles] = useState(() => Array.from({ length: 18 }, (_, i) => ({ size: Math.random() * 4 + 2, x: Math.random() * 100, y: Math.random() * 100, color: ['#06b6d4', '#8b5cf6', '#f59e0b', '#3b82f6'][i % 4], opacity: Math.random() * 0.3 + 0.05, duration: Math.random() * 8 + 6, delay: Math.random() * 5 })));



  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });
      return () => unsubscribe();
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (!auth) {
      alert("Firebase is not configured! Please check your .env file setup.");
      return;
    }
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
      alert(`Failed to login: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => { if (auth) { await signOut(auth); } setUser(null); };
  
  const addToCart = (product) => { 
    setCart(prev => [...prev, product]); 
    setAddedId(product.id); 
    setTimeout(() => setAddedId(null), 1200); 
    setCheckoutStep('cart');
  };
  
  const removeFromCart = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const cartTotal = cart.reduce((t, item) => t + item.price, 0);

  const processDummyPayment = (e) => {
    e.preventDefault();
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      setCart([]);
    }, 2000);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans overflow-x-hidden relative" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 100px; }

        @keyframes float { 0%, 100% { transform: translateY(0px) translateX(0px); } 33% { transform: translateY(-18px) translateX(8px); } 66% { transform: translateY(8px) translateX(-12px); } }
        @keyframes float-model { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cartBounce { 0%, 100% { transform: scale(1); } 40% { transform: scale(1.3); } 70% { transform: scale(0.9); } }
        @keyframes aurora { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(1); } }
        
        .animate-float-model { animation: float-model 6s ease-in-out infinite; }
        .hero-title { font-family: 'Syne', sans-serif; }
        .glass-card { background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .glass-card:hover { border-color: rgba(255,255,255,0.1); }
        .glow-btn:hover { box-shadow: 0 0 30px rgba(6,182,212,0.5), 0 0 60px rgba(6,182,212,0.2); }
        .shimmer-text { background: linear-gradient(90deg, #06b6d4, #8b5cf6, #f59e0b, #06b6d4); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s linear infinite; }
        .product-card { animation: fadeUp 0.6s ease forwards; }
        .cart-slide { animation: slideIn 0.3s ease forwards; }
        .added-flash { animation: cartBounce 0.5s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #030305; }
        ::-webkit-scrollbar-thumb { background: #1e1e3a; border-radius: 3px; }
        
        @keyframes scanMove { 0%,100% { transform: translateY(0px); opacity: 0.9; } 50% { transform: translateY(44px); opacity: 1; } }
        .scan-beam { animation: scanMove 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .blink { animation: blink 1.4s ease-in-out infinite; }
        @keyframes battPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .batt { animation: battPulse 2s ease-in-out infinite; }
        @keyframes kScan { 0%,100% { transform: translateY(0px); opacity:1; } 50% { transform: translateY(52px); opacity:0.7; } }
        .kscan { animation: kScan 2.4s ease-in-out infinite; }
        @keyframes kBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .kblink { animation: kBlink 1.2s ease-in-out infinite; }
        @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink-cursor 1s step-end infinite; }
      `}</style>



      {/* PREMIUM BACKGROUND - Z-INDEX SET TO 0 SO LINKS WORK */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030305]">
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%)', filter: 'blur(60px)', animation: 'aurora 25s linear infinite', transformOrigin: 'center center' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-20%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'aurora 30s linear infinite reverse', transformOrigin: 'top left' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 60%)', filter: 'blur(70px)', animation: 'aurora 20s linear infinite', transformOrigin: 'bottom right' }} />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, zIndex: 1 }} />
        {particles.map((p, i) => <Particle key={i} style={{...p, zIndex: 2}} />)}
      </div>

      {/* Navbar - Higher Z-Index */}
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-4 flex justify-between items-center bg-[#0d1117]/80" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-500 blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 rounded-xl"><Zap className="text-white w-5 h-5 fill-white" /></div>
            </div>
            <span className="text-xl font-black tracking-tight hero-title">ScanPay</span>
          </div>
          
          {/* THESE LINKS NOW WORK PERFECTLY */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 relative z-50">
            <a href="#products" className="hover:text-white transition-colors drop-shadow-md">Products</a>
            <a href="#why-us" className="hover:text-white transition-colors drop-shadow-md">Why Us</a>
            <a href="#docs" className="hover:text-white transition-colors drop-shadow-md">Developers</a>
          </div>
          
          <div className="flex items-center gap-4 relative z-50">
            {user ? (
              <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1">
                <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-cyan-500/50" />
                <span className="text-xs font-bold text-white">{user.displayName?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-400 transition-colors" title="Log Out"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="hidden sm:flex items-center gap-2 text-sm font-semibold bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-xl transition-all disabled:opacity-70">
                {isLoggingIn ? <span className="animate-pulse">Connecting...</span> : <>Login</>}
              </button>
            )}

            <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] text-sm">
              <ShoppingCart className="w-4 h-4" /><span>Cart</span>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-cyan-400 border border-cyan-500 font-black text-xs w-5 h-5 flex items-center justify-center rounded-full" style={{ animation: addedId ? 'cartBounce 0.5s ease' : 'none' }}>{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-10 px-4 flex flex-col items-center text-center pointer-events-auto">
        <div className="max-w-5xl mx-auto">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-cyan-400 text-xs font-bold tracking-[0.15em] uppercase mb-10">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span></span>
              The Future of Retail Checkout
            </div>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="hero-title text-6xl md:text-8xl font-black mb-6 leading-[1.0] tracking-tight drop-shadow-2xl">Scan. Pay.<br /><span className="shimmer-text">Walk Out.</span></h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
              Eliminate queues, cut retail overhead by <strong className="text-slate-200 font-semibold">40%</strong>, and turn every shopper's device into a secure, blazing-fast point of sale.
            </p>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 relative z-50">
              <a href="#products">
                <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105">Explore Products <ArrowRight className="w-4 h-4" /></button>
              </a>
              <a href="#docs">
                <button className="glass-card text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm flex items-center gap-2 hover:scale-105">View Documentation <Terminal className="w-4 h-4 text-slate-400" /></button>
              </a>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="animate-float-model w-full flex justify-center">
              <InteractiveHeroModel><HandheldSVG /></InteractiveHeroModel>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INFINITE LOGO LOOP BANNER */}
      <Reveal delay={100}>
        <section className="py-16 my-10 relative z-10 w-full overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-purple-900/20 backdrop-blur-sm border-y border-white/[0.08]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
          
          <p className="text-center text-sm font-bold tracking-[0.3em] uppercase text-cyan-300 mb-10 relative z-10 drop-shadow-md">
            Trusted by Visionary Retailers
          </p>
          
          <div className="w-full relative z-10" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
            <LogoLoop logos={retailLogos} speed={40} direction="left" logoHeight={64} gap={32} fadeOut={false} scaleOnHover={false} />
          </div>
        </section>
      </Reveal>

      {/* PRODUCTS SECTION (Matches image_b52452.jpg Exactly) */}
      <section id="products" className="relative z-20 pt-20 pb-20 px-4 pointer-events-auto">
        <div className="max-w-7xl mx-auto">
          
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-500 mb-3 drop-shadow-md">The Ecosystem</p>
                <h2 className="hero-title text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">Build your store's<br/>future, today.</h2>
                <p className="text-slate-400 text-lg max-w-xl drop-shadow-md">Everything required to modernize your storefront — hardware, software, intelligence.</p>
              </div>
              
              <div className="flex items-center bg-[#0a0a14] border border-white/10 rounded-full p-1 self-start md:self-auto shadow-xl z-50">
                <button onClick={() => setIsAnnual(false)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}>Monthly</button>
                <button onClick={() => setIsAnnual(true)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}>Annually <span className={isAnnual ? 'bg-black text-cyan-400 px-2 py-0.5 rounded text-[10px]' : 'bg-white/10 text-white px-2 py-0.5 rounded text-[10px]'}>Save 17%</span></button>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => {
              const Icon = product.icon;
              const isAdded = addedId === product.id;
              
              return (
                <Reveal delay={idx * 150} key={product.id} className={product.span}>
                  <TiltCard className="product-card relative rounded-[2rem] overflow-hidden flex flex-col h-full group" style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)' }}>
                    
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '60%', borderRadius: '50%', background: product.glow, filter: 'blur(80px)', pointerEvents: 'none', opacity: 0.6 }} />

                    {product.customGraphic && (
                      <div className={`w-full relative z-10 flex items-center justify-center ${product.hideDetails ? 'h-full p-4' : 'pt-10 px-6'}`}>
                        {product.customGraphic}
                      </div>
                    )}

                    {/* ONLY SHOW HTML DETAILS IF NOT HIDDEN (E.g. Handheld & OS show details, Kiosk Pro matches the image by hiding them) */}
                    {!product.hideDetails && (
                      <div className={`p-8 flex flex-col flex-1 relative z-10 ${product.customGraphic ? 'pt-4' : ''}`}>
                        
                        {!product.customGraphic && (
                          <div style={{ width: 60, height: 60, borderRadius: 16, background: `${product.accent}15`, border: `1px solid ${product.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }} className="group-hover:scale-110 transition-transform duration-300">
                            <Icon style={{ width: 28, height: 28, color: product.accent }} />
                          </div>
                        )}

                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: product.accent, marginBottom: 8, display: 'block' }}>{product.type}</span>
                        
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                          <h3 className="hero-title text-2xl md:text-3xl font-black text-white leading-tight">{product.name}</h3>
                          <div className="md:text-right flex-shrink-0"><div className="text-2xl font-black text-white">${product.price.toLocaleString()}</div><div className="text-xs text-slate-500 mt-0.5">{product.billing}</div></div>
                        </div>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-10">
                          {product.features.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}><CheckCircle style={{ width: 14, height: 14, color: product.accent, flexShrink: 0 }} />{f}</div>
                          ))}
                        </div>
                        
                        <div className="mt-auto">
                          <button onClick={() => addToCart(product)} className={`w-full font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm relative z-50 ${isAdded ? 'added-flash' : ''}`} style={{ background: isAdded ? `${product.accent}33` : `linear-gradient(135deg, ${product.accent}, ${product.accentDark})`, color: isAdded ? product.accent : '#000', border: isAdded ? `1px solid ${product.accent}50` : 'none', boxShadow: isAdded ? 'none' : `0 8px 20px ${product.glow}` }}>
                            {isAdded ? '✓ Added to Order' : <>Add to Order <ChevronRight className="w-4 h-4" /></>}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* KIOSK SPECIFIC BUTTON (If details are hidden, we still need a way to buy it!) */}
                    {product.hideDetails && (
                      <div className="p-8 mt-auto relative z-20">
                        <button onClick={() => addToCart(product)} className={`w-full font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm relative z-50 ${isAdded ? 'added-flash' : 'hover:scale-[1.02]'}`} style={{ background: isAdded ? `${product.accent}33` : `linear-gradient(135deg, ${product.accent}, ${product.accentDark})`, color: isAdded ? product.accent : '#000', border: isAdded ? `1px solid ${product.accent}50` : 'none', boxShadow: isAdded ? 'none' : `0 8px 20px ${product.glow}` }}>
                          {isAdded ? '✓ Added to Order' : <>Add to Order <ChevronRight className="w-4 h-4" /></>}
                        </button>
                      </div>
                    )}
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="why-us" className="relative z-20 py-24 px-4 bg-black/40 border-y border-white/[0.05] pointer-events-auto">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-3 drop-shadow-md">Unfair Advantage</p>
              <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">Why ThinkStack?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto drop-shadow-md">We solve the root cause of poor shopping experiences by replacing traditional cashier-based billing with an autonomous, high-speed ecosystem.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <div className="glass-card rounded-3xl p-8 border border-white/[0.08] h-full hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6"><Zap className="w-6 h-6 text-cyan-400" /></div>
                <h3 className="text-xl font-bold text-white mb-3">Zero Waiting Time</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Customers scan products using a mobile app while shopping. Items are added to a digital cart in real-time, completely bypassing the checkout queue.</p>
                <ul className="space-y-2 mt-auto">
                  <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-cyan-500" /> Faster shopping experience</li>
                  <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-cyan-500" /> Real-time bill transparency</li>
                </ul>
              </div>
            </Reveal>
            
            <Reveal delay={200}>
              <div className="glass-card rounded-3xl p-8 border border-white/[0.08] h-full hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6"><Layers className="w-6 h-6 text-purple-400" /></div>
                <h3 className="text-xl font-bold text-white mb-3">Integrated Store Operations</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Our system isn't just a payment gateway. We offer an integrated app combined with a live store inventory system, creating high switching costs once adopted.</p>
                <ul className="space-y-2 mt-auto">
                  <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-purple-500" /> Reduces crowding inside stores</li>
                  <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-purple-500" /> Strong retailer partnerships built in</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="glass-card rounded-3xl p-8 border border-white/[0.08] h-full hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6"><BarChart3 className="w-6 h-6 text-amber-400" /></div>
                <h3 className="text-xl font-bold text-white mb-3">Deep Customer Data</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Unlock premium analytics for retailers. Gain granular data insights on customer buying behavior to optimize store layouts and featured product promotions.</p>
                <ul className="space-y-2 mt-auto">
                  <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-amber-500" /> Track daily transactions through app</li>
                  <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-amber-500" /> Identify and retain early adopters</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DEVELOPER DOCUMENTATION */}
      <section id="docs" className="relative z-20 py-32 px-4 bg-gradient-to-b from-transparent to-[#06b6d4]/5 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-bold tracking-wider uppercase mb-6 drop-shadow-md"><Code className="w-3 h-3"/> Developer First</div>
              <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-6 drop-shadow-lg">Retail integration<br/>made effortless.</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 drop-shadow-md">
                We provide full retail integration support. Whether you use traditional POS systems or modern cloud databases, the ThinkStack OS API syncs your entire inventory in minutes.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20"><Terminal className="w-5 h-5 text-cyan-400"/></div>
                  <div>
                    <h4 className="text-white font-bold drop-shadow-md">RESTful & GraphQL APIs</h4>
                    <p className="text-sm text-slate-500 mt-1">Connect your existing ERP instantly with our thoroughly documented endpoints.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20"><Shield className="w-5 h-5 text-blue-400"/></div>
                  <div>
                    <h4 className="text-white font-bold drop-shadow-md">Secure Payment Gateways</h4>
                    <p className="text-sm text-slate-500 mt-1">We handle the payment gateway charges and PCI compliance routing.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <Reveal delay={200}>
              <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-[#0d1117] shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
                <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 flex items-center gap-2 text-xs text-slate-500 font-mono"><FileJson className="w-3 h-3"/> sync_inventory.js</div>
                </div>
                <div className="p-6 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                  <pre><code><span className="text-purple-400">import</span> {'{ ThinkStack }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@thinkstack/os-sdk'</span>;{'\n\n'}<span className="text-slate-500">// Initialize client with store credentials</span>{'\n'}<span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> <span className="text-amber-300">ThinkStack</span>({'{'}{'\n'}{'  '}apiKey: process.env.<span className="text-blue-300">THINKSTACK_API_KEY</span>,{'\n'}{'  '}storeId: <span className="text-green-400">'STR_9841_NYC'</span>{'\n'}{'}'});{'\n\n'}<span className="text-slate-500">// Real-time inventory sync hook</span>{'\n'}client.inventory.<span className="text-blue-300">onUpdate</span>(<span className="text-purple-400">async</span> (payload) =&gt; {'{'}{'\n'}{'  '}<span className="text-purple-400">try</span> {'{'}{'\n'}{'    '}<span className="text-purple-400">await</span> database.<span className="text-blue-300">sync</span>(payload.items);{'\n'}{'    '}console.<span className="text-blue-300">log</span>(<span className="text-green-400">`Synced ${'{payload.items.length}'} products`</span>);{'\n'}{'  '}{'}'} <span className="text-purple-400">catch</span> (err) {'{'}{'\n'}{'    '}console.<span className="text-blue-300">error</span>(<span className="text-green-400">'Sync failed:'</span>, err);{'\n'}{'  '}{'}'}{'\n'}{'}'});<span className="cursor-blink bg-cyan-400 text-transparent">_</span></code></pre>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ SECTION */}
      <section className="relative z-20 py-24 px-4 pointer-events-auto">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="hero-title text-3xl md:text-4xl font-black text-white tracking-tight mb-4 drop-shadow-lg">Frequently Asked Questions</h2>
              <p className="text-slate-400 drop-shadow-md">Everything you need to know about deploying ScanPay.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card rounded-2xl border border-white/[0.05] overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none">
                    <span className="font-bold text-white pr-4 drop-shadow-md">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-cyan-500 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SIDEBAR CART WITH CHECKOUT FLOW */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={(e) => e.target === e.currentTarget && closeCart()}>
          <div className="cart-slide w-full max-w-md h-full flex flex-col border-l border-white/10" style={{ background: '#0a0a18', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}>
            
            {/* HEADER */}
            <div className="px-6 py-6 border-b border-white/[0.08] flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-lg font-black flex items-center gap-2 text-white hero-title">
                {checkoutStep === 'cart' && <><ShoppingCart className="w-5 h-5 text-cyan-400" /> Your Order</>}
                {checkoutStep === 'checkout' && <><CreditCard className="w-5 h-5 text-cyan-400" /> Secure Checkout</>}
                {checkoutStep === 'processing' && <><Loader2 className="w-5 h-5 text-cyan-400 animate-spin" /> Processing...</>}
                {checkoutStep === 'success' && <><CheckCircle className="w-5 h-5 text-green-400" /> Order Confirmed</>}
              </h3>
              {checkoutStep !== 'processing' && <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>}
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {checkoutStep === 'cart' && (
                cart.length === 0 ? (
                  <div className="text-center text-slate-500 mt-28"><ShoppingCart className="w-16 h-16 mx-auto mb-5 opacity-15" /><p className="font-medium text-slate-400">Your order is empty.</p></div>
                ) : (
                  cart.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="glass-card p-4 rounded-2xl flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.accent}15`, border: `1px solid ${item.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon style={{ width: 18, height: 18, color: item.accent }} /></div>
                          <div><h4 className="font-bold text-white text-sm">{item.name}</h4><p className="text-xs font-bold" style={{ color: item.accent }}>${item.price.toLocaleString()}</p></div>
                        </div>
                        <button onClick={() => removeFromCart(index)} className="text-slate-600 hover:text-red-400 hover:bg-red-400/10 text-xs font-bold px-3 py-2 rounded-lg transition-colors">Remove</button>
                      </div>
                    );
                  })
                )
              )}

              {checkoutStep === 'checkout' && (
                <form onSubmit={processDummyPayment} className="space-y-5 animate-slideIn">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl mb-6">
                    <p className="text-sm text-cyan-400 font-medium flex items-center gap-2"><Lock className="w-4 h-4"/> ThinkStack Sandbox Environment</p>
                    <p className="text-xs text-slate-400 mt-1">This is a dummy payment page. No real charges will be made.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Information</label>
                    <input required type="text" placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" />
                    <input required type="email" placeholder="Billing Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" defaultValue={user?.email || ''} />
                  </div>
                  <div className="space-y-3 pt-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Details</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input required type="text" placeholder="Card Number" maxLength="19" className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono" />
                    </div>
                    <div className="flex gap-3">
                      <input required type="text" placeholder="MM/YY" maxLength="5" className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono" />
                      <input required type="text" placeholder="CVC" maxLength="4" className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono" />
                    </div>
                    <input required type="text" placeholder="Cardholder Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" defaultValue={user?.displayName || ''} />
                  </div>
                  <button type="submit" id="submit-payment" className="hidden"></button>
                </form>
              )}

              {checkoutStep === 'processing' && (
                <div className="flex flex-col items-center justify-center h-full mt-20 animate-fadeUp">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
                  </div>
                  <h4 className="text-white font-bold text-lg mt-6">Processing Payment</h4>
                  <p className="text-slate-400 text-sm mt-2">Connecting to secure gateway...</p>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="flex flex-col items-center text-center h-full mt-16 animate-fadeUp">
                  <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2 hero-title">Payment Successful</h4>
                  <p className="text-slate-400 text-sm mb-8">Thank you for partnering with ThinkStack.</p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full text-left">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold">Order Reference</p>
                    <p className="text-lg text-cyan-400 font-mono mb-4">#SP-{Math.floor(10000 + Math.random() * 90000)}</p>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold">Next Steps</p>
                    <p className="text-sm text-slate-300">Your hardware provisioning team will contact you within 24 hours to schedule deployment.</p>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-6 border-t border-white/[0.08]" style={{ background: 'rgba(0,0,0,0.3)' }}>
              {(checkoutStep === 'cart' || checkoutStep === 'checkout') && (
                <div className="glass-card rounded-2xl p-4 mb-5">
                  <div className="flex justify-between items-center"><span className="text-slate-400 font-medium text-sm">Total Due Today</span><span className="text-3xl font-black text-white hero-title">${cartTotal.toLocaleString()}</span></div>
                </div>
              )}

              {checkoutStep === 'cart' && (
                <button disabled={cart.length === 0 || (!user && isLoggingIn)} onClick={() => { if (!user) { alert("Please login with Google first."); handleGoogleLogin(); } else { setCheckoutStep('checkout'); } }} className="w-full font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm" style={{ background: cart.length > 0 ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.05)', color: cart.length > 0 ? 'white' : '#334155', cursor: cart.length > 0 ? 'pointer' : 'not-allowed' }}>{user ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="w-4 h-4" /></button>
              )}

              {checkoutStep === 'checkout' && (
                <div className="flex gap-3">
                  <button onClick={() => setCheckoutStep('cart')} className="px-5 py-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold transition-all text-sm">Back</button>
                  <button onClick={() => document.getElementById('submit-payment').click()} className="flex-1 font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm text-black shadow-[0_8px_24px_rgba(6,182,212,0.3)]" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>Pay ${cartTotal.toLocaleString()} <Shield className="w-4 h-4" /></button>
                </div>
              )}

              {checkoutStep === 'success' && (
                <button onClick={closeCart} className="w-full font-bold py-4 rounded-xl transition-all duration-300 border border-white/10 text-white hover:bg-white/5 flex justify-center items-center gap-2 text-sm">Return to Store</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] bg-[#05050a] py-12 px-4 relative z-20 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-cyan-500 fill-cyan-500" /><span className="font-black text-xl tracking-tight hero-title drop-shadow-md">Think Stack</span></div>
          <div className="flex gap-8 text-sm text-slate-400">
            <div className="flex flex-col items-center"><span className="font-bold text-slate-200">Scan</span><span className="text-xs">-x--x-</span></div>
            <div className="flex flex-col items-center"><span className="font-bold text-slate-200">Pay</span><span className="text-xs">-x--x-</span></div>
            <div className="flex flex-col items-center"><span className="font-bold text-slate-200">Go</span><span className="text-xs">-x--x-</span></div>
          </div>
          <div className="text-sm text-slate-500">© 2026 Think Stack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}