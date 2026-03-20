import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { ShoppingCart, Server, Smartphone, LineChart, CheckCircle, X, ChevronRight, Zap, ArrowRight, Shield, BarChart3, Layers, Star, Users, TrendingUp, Package, Terminal, FileJson, Code, LogOut } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

// IMPORT AUTH FROM YOUR SECURE FIREBASE.JS FILE
import { auth } from './firebase';

// ==========================================
// 1. LOGOLOOP COMPONENT (From Shadcn)
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

const LogoLoop = memo(({ logos, speed = 120, direction = 'left', width = '100%', logoHeight = 28, gap = 32, pauseOnHover, hoverSpeed, fadeOut = false, fadeOutColor, scaleOnHover = false, renderItem, ariaLabel = 'Partner logos', className, style }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = direction === 'up' || direction === 'down';
  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = isVertical ? (direction === 'up' ? 1 : -1) : (direction === 'left' ? 1 : -1);
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction, isVertical]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect?.();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;
    if (isVertical) {
      const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
      if (containerRef.current && parentHeight > 0) containerRef.current.style.height = `${Math.ceil(parentHeight)}px`;
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM));
    }
  }, [isVertical]);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

  const cssVariables = useMemo(() => ({ '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px`, ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }) }), [gap, logoHeight, fadeOutColor]);
  const rootClasses = useMemo(() => cx('relative group', isVertical ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden', '[--logoloop-gap:32px]', '[--logoloop-logoHeight:28px]', '[--logoloop-fadeColorAuto:#ffffff]', 'dark:[--logoloop-fadeColorAuto:#0b0b0b]', scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]', className), [isVertical, scaleOnHover, className]);

  const handleMouseEnter = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(true); }, [effectiveHoverSpeed]);
  const handleMouseLeave = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(false); }, [effectiveHoverSpeed]);

  const renderLogoItem = useCallback((item, key) => {
    const isNodeItem = 'node' in item;
    const content = isNodeItem ? <span className={cx('inline-flex items-center', 'motion-reduce:transition-none', scaleOnHover && 'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120')} aria-hidden={!!item.href && !item.ariaLabel}>{item.node}</span> : <img className={cx('h-[var(--logoloop-logoHeight)] w-auto block object-contain', '[-webkit-user-drag:none] pointer-events-none', '[image-rendering:-webkit-optimize-contrast]', 'motion-reduce:transition-none', scaleOnHover && 'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120')} src={item.src} alt={item.alt ?? ''} title={item.title} loading="lazy" draggable={false} />;
    return <li className={cx('flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]', isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]', scaleOnHover && 'overflow-visible group/item')} key={key} role="listitem">{content}</li>;
  }, [isVertical, scaleOnHover]);

  const logoLists = useMemo(() => Array.from({ length: copyCount }, (_, copyIndex) => <ul className={cx('flex items-center', isVertical && 'flex-col')} key={`copy-${copyIndex}`} role="list" aria-hidden={copyIndex > 0} ref={copyIndex === 0 ? seqRef : undefined}>{logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}</ul>), [copyCount, logos, renderLogoItem, isVertical]);

  return (
    <div ref={containerRef} className={rootClasses} style={{ width: isVertical ? (toCssLength(width) === '100%' ? undefined : toCssLength(width)) : (toCssLength(width) ?? '100%'), ...cssVariables, ...style }} role="region" aria-label={ariaLabel} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {fadeOut && (
        <>
          <div aria-hidden className={cx('pointer-events-none absolute inset-y-0 left-0 z-10', 'w-[clamp(24px,8%,120px)]', 'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]')} />
          <div aria-hidden className={cx('pointer-events-none absolute inset-y-0 right-0 z-10', 'w-[clamp(24px,8%,120px)]', 'bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]')} />
        </>
      )}
      <div className={cx('flex will-change-transform select-none relative z-0', 'motion-reduce:transform-none', isVertical ? 'flex-col h-max w-full' : 'flex-row w-max')} ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {logoLists}
      </div>
    </div>
  );
});
LogoLoop.displayName = 'LogoLoop';

const retailLogos = [
  { title: "Walmart", node: <span className="font-bold text-2xl tracking-tighter text-[#0071ce] flex items-center gap-2">Walmart <Zap className="w-5 h-5 text-[#ffc220] fill-[#ffc220]"/></span> },
  { title: "Costco", node: <span className="font-black text-2xl tracking-tighter text-[#e31837]">COSTCO <span className="text-[#005daal] font-bold">WHOLESALE</span></span> },
  { title: "Kroger", node: <span className="font-bold text-3xl tracking-tight text-[#0057b8] font-serif italic">Kroger</span> },
  { title: "Tesco", node: <span className="font-black text-2xl tracking-tighter text-[#ee1c2e]">TESCO</span> },
  { title: "Aldi", node: <span className="font-black text-2xl tracking-tighter text-[#003b7a] bg-[#f58220] px-3 py-1 rounded">ALDI</span> },
  { title: "Lidl", node: <span className="font-bold text-2xl tracking-tight text-[#0050aa] border-b-4 border-[#fff100]">Lidl</span> },
  { title: "Carrefour", node: <span className="font-bold text-2xl tracking-tighter text-[#0056a8]">Carrefour <span className="text-[#d81124]">&gt;</span></span> },
  { title: "7-Eleven", node: <span className="font-black text-2xl tracking-tighter text-[#007e61]">7-<span className="text-[#ea2839]">ELEVEn</span></span> },
  { title: "Target", node: <span className="font-bold text-2xl tracking-tighter text-[#cc0000] flex items-center gap-1"><div className="w-5 h-5 rounded-full border-4 border-[#cc0000] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full"/></div>Target</span> },
].map(logo => ({
  ...logo,
  node: <div className="flex items-center justify-center px-8 py-4 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 cursor-default">{logo.node}</div>
}));

// ==========================================
// 3. HARDWARE SVGS & INTERACTIVE WRAPPER
// ==========================================
const HandheldSVG = () => (
  <div className="w-full h-full pointer-events-none">
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
      <text x="148" y="300" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Real-time</text>
      <text x="148" y="314" textAnchor="middle" fill="#475569" fontSize="8">cart sync</text>
    </svg>
  </div>
);

const KioskSVG = () => (
  <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-[#080812] mb-8 relative" style={{ aspectRatio: '680/580' }}>
    <svg width="100%" height="100%" viewBox="0 0 680 580" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
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

      <rect width="680" height="580" fill="#080812"/>
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
      <rect x="238" y="162" width="206" height="2" fill="#06b6d4" opacity="0.3" rx="1"/>
      <rect x="238" y="216" width="206" height="2" fill="#06b6d4" opacity="0.3" rx="1"/>
      
      <g className="kscan">
        <rect x="238" y="166" width="206" height="5" rx="1" fill="url(#kScanLine)" opacity="0.9"/>
      </g>
      
      <line x1="252" y1="174" x2="252" y2="212" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="261" y1="170" x2="261" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="268" y1="172" x2="268" y2="214" stroke="#071530" strokeWidth="1"/>
      <line x1="275" y1="170" x2="275" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="282" y1="174" x2="282" y2="212" stroke="#071530" strokeWidth="1"/>
      <line x1="289" y1="170" x2="289" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="296" y1="172" x2="296" y2="214" stroke="#071530" strokeWidth="1"/>
      <line x1="304" y1="170" x2="304" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="311" y1="174" x2="311" y2="212" stroke="#071530" strokeWidth="1"/>
      <line x1="318" y1="170" x2="318" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="325" y1="172" x2="325" y2="214" stroke="#071530" strokeWidth="1"/>
      <line x1="332" y1="170" x2="332" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="340" y1="174" x2="340" y2="212" stroke="#071530" strokeWidth="1"/>
      <line x1="347" y1="170" x2="347" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="354" y1="172" x2="354" y2="214" stroke="#071530" strokeWidth="1"/>
      <line x1="361" y1="170" x2="361" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="368" y1="174" x2="368" y2="212" stroke="#071530" strokeWidth="1"/>
      <line x1="375" y1="170" x2="375" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="382" y1="172" x2="382" y2="214" stroke="#071530" strokeWidth="1"/>
      <line x1="389" y1="170" x2="389" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="396" y1="174" x2="396" y2="212" stroke="#071530" strokeWidth="1"/>
      <line x1="403" y1="170" x2="403" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="410" y1="172" x2="410" y2="214" stroke="#071530" strokeWidth="1"/>
      <line x1="418" y1="170" x2="418" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="425" y1="174" x2="425" y2="212" stroke="#071530" strokeWidth="1"/>
      <line x1="432" y1="170" x2="432" y2="216" stroke="#0f2040" strokeWidth="1.5"/>
      <line x1="439" y1="172" x2="439" y2="214" stroke="#071530" strokeWidth="1"/>
      
      <rect x="238" y="162" width="16" height="56" rx="1" fill="#060e1c"/>
      <rect x="428" y="162" width="16" height="56" rx="1" fill="#060e1c"/>
      
      <rect x="238" y="228" width="100" height="22" rx="5" fill="url(#kBtnGrad)" filter="url(#kGlow)"/>
      <text x="288" y="243" textAnchor="middle" fill="#001a22" fontSize="9" fontWeight="700" letterSpacing="0.5">Scan Item</text>
      
      <rect x="344" y="228" width="100" height="22" rx="5" fill="#0f1a2e" stroke="#1e3050" strokeWidth="0.5"/>
      <text x="394" y="243" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600">Skip &amp; Pay</text>
      
      <rect x="228" y="264" width="224" height="1" fill="#0e1e38" rx="0.5"/>
      <rect x="228" y="272" width="224" height="50" rx="6" fill="#060d1c" stroke="#0c1830" strokeWidth="0.5"/>
      
      <rect x="238" y="280" width="50" height="34" rx="4" fill="#0a1525" stroke="#112040" strokeWidth="0.5"/>
      <text x="263" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Weight</text>
      <text x="263" y="307" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="700">0.84kg</text>
      
      <rect x="296" y="280" width="70" height="34" rx="4" fill="#0a1525" stroke="#112040" strokeWidth="0.5"/>
      <text x="331" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Product</text>
      <text x="331" y="307" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Verified</text>
      <circle cx="375" cy="297" r="5" fill="#10b981" className="kblink"/>
      
      <rect x="374" y="280" width="70" height="34" rx="4" fill="#0a1525" stroke="#112040" strokeWidth="0.5"/>
      <text x="409" y="294" textAnchor="middle" fill="#64748b" fontSize="7">Total</text>
      <text x="409" y="307" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700">$12.40</text>
      
      <rect x="228" y="332" width="224" height="52" rx="8" fill="#070d1a" stroke="#0e1e38" strokeWidth="0.5"/>
      <rect x="238" y="342" width="32" height="32" rx="6" fill="#0a1528" stroke="#112040" strokeWidth="0.5"/>
      <rect x="244" y="348" width="20" height="14" rx="2" fill="#1e2a50"/>
      <rect x="245" y="362" width="18" height="8" rx="1" fill="#1e2a50"/>
      <rect x="247" y="360" width="14" height="3" rx="1" fill="#06b6d4" opacity="0.5"/>
      
      <text x="280" y="355" fill="#94a3b8" fontSize="9" fontWeight="600">Payment ready</text>
      <text x="280" y="368" fill="#475569" fontSize="8">Tap, insert, or swipe</text>
      
      <path d="M422 352 Q426 347 430 352" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" className="kwave1"/>
      <path d="M418 356 Q426 346 434 356" fill="none" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" className="kwave2"/>
      <path d="M414 360 Q426 345 438 360" fill="none" stroke="#06b6d4" strokeWidth="0.7" strokeLinecap="round" className="kwave3"/>
      <circle cx="426" cy="360" r="2" fill="#06b6d4"/>
      
      <rect x="215" y="372" width="250" height="22" rx="0" fill="#080f20" opacity="0.6"/>
      <rect x="228" y="376" width="224" height="14" rx="3" fill="#060c1a"/>
      
      <rect x="228" y="376" width="50" height="14" rx="3" fill="#06b6d4" opacity="0.07" stroke="#06b6d4" strokeWidth="0.3"/>
      <text x="253" y="386" textAnchor="middle" fill="#1e3a50" fontSize="7" fontWeight="600">NFC</text>
      
      <rect x="284" y="376" width="50" height="14" rx="3" fill="#8b5cf6" opacity="0.07" stroke="#8b5cf6" strokeWidth="0.3"/>
      <text x="309" y="386" textAnchor="middle" fill="#2e1a50" fontSize="7" fontWeight="600">CHIP</text>
      
      <rect x="340" y="376" width="50" height="14" rx="3" fill="#10b981" opacity="0.07" stroke="#10b981" strokeWidth="0.3"/>
      <text x="365" y="386" textAnchor="middle" fill="#0a2a1e" fontSize="7" fontWeight="600">SWIPE</text>
      
      <rect x="396" y="376" width="56" height="14" rx="3" fill="#f59e0b" opacity="0.07" stroke="#f59e0b" strokeWidth="0.3"/>
      <text x="424" y="386" textAnchor="middle" fill="#2a1a00" fontSize="7" fontWeight="600">PIN PAD</text>
      
      <rect x="222" y="394" width="236" height="6" rx="3" fill="#0d0d22" stroke="#1a1a38" strokeWidth="0.5"/>
      <rect x="312" y="390" width="16" height="10" rx="2" fill="#141428" stroke="#222242" strokeWidth="0.5"/>
      
      <rect x="185" y="94" width="30" height="50" rx="4" fill="#0e0e20" stroke="#1a1a38" strokeWidth="0.5"/>
      <rect x="191" y="100" width="18" height="8" rx="2" fill="#141428"/>
      <rect x="191" y="112" width="18" height="8" rx="2" fill="#141428"/>
      <rect x="191" y="124" width="18" height="8" rx="2" fill="#141428"/>
      <circle cx="200" cy="104" r="2" fill="#06b6d4" className="kpulse"/>
      
      <rect x="465" y="94" width="30" height="50" rx="4" fill="#0e0e20" stroke="#1a1a38" strokeWidth="0.5"/>
      <rect x="471" y="100" width="18" height="38" rx="3" fill="#060c1a" stroke="#0e1830" strokeWidth="0.5"/>
      <rect x="472" y="101" width="16" height="10" rx="2" fill="#0a1525"/>
      <text x="480" y="109" textAnchor="middle" fill="#334155" fontSize="6">CAM</text>
      <circle cx="480" cy="120" r="5" fill="#0a1525" stroke="#1e2a40" strokeWidth="0.5"/>
      <circle cx="480" cy="120" r="3" fill="#06b6d4" opacity="0.3"/>
      <circle cx="480" cy="120" r="1.5" fill="#06b6d4" className="kpulse"/>
      
      <text x="108" y="120" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="700">ScanPay</text>
      <text x="108" y="138" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="700">Kiosk Pro</text>
      <circle cx="108" cy="128" r="36" fill="none" stroke="#06b6d4" strokeWidth="0.4" opacity="0.25"/>
      <line x1="144" y1="155" x2="215" y2="180" stroke="#0e2a40" strokeWidth="0.5" strokeDasharray="3,3"/>
      <text x="108" y="160" textAnchor="middle" fill="#475569" fontSize="9">Hardware</text>
      <text x="108" y="174" textAnchor="middle" fill="#334155" fontSize="9">$1,299</text>
      
      <text x="572" y="140" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">15" display</text>
      <text x="572" y="153" textAnchor="middle" fill="#475569" fontSize="8">edge-to-edge</text>
      <line x1="465" y1="146" x2="538" y2="146" stroke="#0e2a40" strokeWidth="0.5" strokeDasharray="3,3"/>
      
      <text x="572" y="220" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">AI weight</text>
      <text x="572" y="233" textAnchor="middle" fill="#475569" fontSize="8">verification scale</text>
      <line x1="465" y1="226" x2="538" y2="226" stroke="#0e2a40" strokeWidth="0.5" strokeDasharray="3,3"/>
      
      <text x="572" y="300" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Sub-second</text>
      <text x="572" y="313" textAnchor="middle" fill="#475569" fontSize="8">processing</text>
      <line x1="465" y1="306" x2="538" y2="306" stroke="#0e2a40" strokeWidth="0.5" strokeDasharray="3,3"/>
      
      <text x="108" y="300" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Anti-theft</text>
      <text x="108" y="313" textAnchor="middle" fill="#475569" fontSize="8">computer vision</text>
      <line x1="144" y1="306" x2="215" y2="306" stroke="#0e2a40" strokeWidth="0.5" strokeDasharray="3,3"/>
      
      <text x="108" y="390" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Apple Pay</text>
      <text x="108" y="403" textAnchor="middle" fill="#475569" fontSize="8">Google Pay native</text>
      <line x1="144" y1="396" x2="215" y2="396" stroke="#0e2a40" strokeWidth="0.5" strokeDasharray="3,3"/>
      
      <rect x="200" y="536" width="280" height="1" rx="0.5" fill="#1e2a50" opacity="0.4"/>
      <text x="340" y="552" textAnchor="middle" fill="#334155" fontSize="9">Freestanding · AI-verified · One-time $1,299</text>
    </svg>
  </div>
);

// CSS 3D Interactive Wrapper for Hero Section
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

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1200px) rotateY(15deg) rotateX(10deg) scale3d(1, 1, 1)';
    }
  };

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
const products = [
  { id: 1, name: "ScanPay Kiosk Pro", type: "Hardware", price: 1299, billing: "One-time", description: "Freestanding self-checkout terminal with an edge-to-edge 15\" display, AI weight-verification scale, and lightning-fast payment gateway.", features: ["Sub-second processing", "Apple Pay / Google Pay", "Anti-theft CV vision"], icon: Server, customGraphic: <KioskSVG />, accent: "#06b6d4", accentDark: "#0e7490", glow: "rgba(6,182,212,0.25)", badge: "Most Popular", span: "lg:col-span-2" },
  { id: 2, name: "ScanPay Handheld", type: "Hardware (5-Pack)", price: 899, billing: "One-time", description: "Military-grade mobile scanners that dock directly into shopping carts for the ultimate in-aisle customer experience.", features: ["14-hour battery life", "Real-time cart sync", "Drop-resistant shell"], icon: Smartphone, customGraphic: <HandheldSVG />, accent: "#8b5cf6", accentDark: "#7c3aed", glow: "rgba(139,92,246,0.25)", badge: null, span: "lg:col-span-1" },
  { id: 3, name: "ThinkStack OS", type: "Enterprise Software", price: 2499, billing: "per year", description: "The intelligence layer behind your hardware. Centralized dashboard for inventory management, buyer heatmaps, and partner ad delivery.", features: ["Live store analytics", "Targeted ad engine", "24/7 priority support"], icon: LineChart, accent: "#f59e0b", accentDark: "#d97706", glow: "rgba(245,158,11,0.25)", badge: "Enterprise", span: "lg:col-span-3" }
];

const stats = [
  { icon: Users, value: "2,400+", label: "Stores Deployed" },
  { icon: TrendingUp, value: "40%", label: "Overhead Reduction" },
  { icon: Package, value: "99.9%", label: "Uptime SLA" },
  { icon: Star, value: "4.9/5", label: "Client Rating" },
];

function Particle({ style }) {
  return <div className="absolute rounded-full pointer-events-none" style={{ width: `${style.size}px`, height: `${style.size}px`, left: `${style.x}%`, top: `${style.y}%`, background: style.color, opacity: style.opacity, animation: `float ${style.duration}s ease-in-out infinite`, animationDelay: `${style.delay}s`, filter: 'blur(1px)' }} />;
}

function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02,1.02,1.02)`;
  };
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'; };
  return <div ref={ref} className={className} style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d', ...style }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>{children}</div>;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [particles] = useState(() => Array.from({ length: 18 }, (_, i) => ({ size: Math.random() * 4 + 2, x: Math.random() * 100, y: Math.random() * 100, color: ['#06b6d4', '#8b5cf6', '#f59e0b', '#3b82f6'][i % 4], opacity: Math.random() * 0.3 + 0.05, duration: Math.random() * 8 + 6, delay: Math.random() * 5 })));

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });
      return () => unsubscribe();
    }
  }, []);

  // ONLY TRIGGER REAL GOOGLE POPUP
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
  const addToCart = (product) => { setCart(prev => [...prev, product]); setAddedId(product.id); setTimeout(() => setAddedId(null), 1200); };
  const removeFromCart = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const cartTotal = cart.reduce((t, item) => t + item.price, 0);

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans overflow-x-hidden relative" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
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
        
        /* SVG Internal Animations */
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
        @keyframes kPulse { 0%,100%{opacity:0.9} 50%{opacity:0.4} }
        .kpulse { animation: kPulse 2s ease-in-out infinite; }
        @keyframes kWave { 0%{opacity:0.2} 33%{opacity:1} 66%{opacity:0.5} 100%{opacity:0.2} }
        .kwave1{animation:kWave 2s ease-in-out infinite;}
        .kwave2{animation:kWave 2s ease-in-out infinite 0.4s;}
        .kwave3{animation:kWave 2s ease-in-out infinite 0.8s;}
        @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink-cursor 1s step-end infinite; }
      `}</style>

      {/* PREMIUM BACKGROUND: Aurora Blobs + Noise Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030305]">
        {/* Animated Aurora Glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%)', filter: 'blur(60px)', animation: 'aurora 25s linear infinite', transformOrigin: 'center center' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-20%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'aurora 30s linear infinite reverse', transformOrigin: 'top left' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 60%)', filter: 'blur(70px)', animation: 'aurora 20s linear infinite', transformOrigin: 'bottom right' }} />
        
        {/* Film Grain Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, zIndex: 1 }} />
        
        {particles.map((p, i) => <Particle key={i} style={{...p, zIndex: 2}} />)}
      </div>

      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto glass-card rounded-2xl px-6 py-4 flex justify-between items-center" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-500 blur-md opacity-50" />
              <div className="relative bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 rounded-xl"><Zap className="text-white w-5 h-5 fill-white" /></div>
            </div>
            <span className="text-xl font-black tracking-tight hero-title">ScanPay</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#docs" className="hover:text-white transition-colors">Developers</a>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1">
                <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-cyan-500/50" />
                <span className="text-xs font-bold text-white">{user.displayName?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-400 transition-colors" title="Log Out"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={handleGoogleLogin} disabled={isLoggingIn} className="hidden sm:flex items-center gap-2 text-sm font-semibold bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-xl transition-all disabled:opacity-70">
                {isLoggingIn ? <span className="animate-pulse">Connecting...</span> : <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Login
                </>}
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
      <section className="relative z-10 pt-48 pb-20 px-4 flex flex-col items-center text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-cyan-400 text-xs font-bold tracking-[0.15em] uppercase mb-10">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" style={{ animationName: 'pulse-ring' }}></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span></span>
            The Future of Retail Checkout
          </div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-black mb-6 leading-[1.0] tracking-tight">Scan. Pay.<br /><span className="shimmer-text">Walk Out.</span></h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            Eliminate queues, cut retail overhead by <strong className="text-slate-200 font-semibold">40%</strong>, and turn every shopper's device into a secure, blazing-fast point of sale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="#products">
              <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm" style={{ boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>Explore Products <ArrowRight className="w-4 h-4" /></button>
            </a>
            <a href="#docs">
              <button className="glass-card text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm flex items-center gap-2">View Documentation <Terminal className="w-4 h-4 text-slate-400" /></button>
            </a>
          </div>

          {/* INTERACTIVE 3D HERO MODEL */}
          <div className="animate-float-model w-full flex justify-center">
            <InteractiveHeroModel>
              <HandheldSVG />
            </InteractiveHeroModel>
          </div>

        </div>
      </section>

      {/* INFINITE LOGO LOOP BANNER */}
      <section className="py-12 border-y border-white/[0.06] bg-black/20 overflow-hidden relative z-10 w-full shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mt-20">
        <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-8">Trusted by visionary retailers worldwide</p>
        <LogoLoop logos={retailLogos} speed={35} direction="left" logoHeight={64} gap={24} fadeOut fadeOutColor="#030305" scaleOnHover={false} />
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-500 mb-3">The Ecosystem</p>
            <h2 className="hero-title text-4xl md:text-6xl font-black text-white tracking-tight mb-4">Build your store's<br/>future, today.</h2>
            <p className="text-slate-400 text-lg max-w-xl">Everything required to modernize your storefront — hardware, software, intelligence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => {
              const Icon = product.icon;
              const isAdded = addedId === product.id;
              return (
                <TiltCard key={product.id} className={`product-card relative rounded-3xl overflow-hidden flex flex-col ${product.span}`} style={{ animationDelay: `${idx * 0.15}s`, background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid rgba(255,255,255,0.1)`, backdropFilter: 'blur(20px)' }}>
                  <div style={{ position: 'absolute', top: -60, left: -40, width: 200, height: 200, borderRadius: '50%', background: product.glow, filter: 'blur(50px)', pointerEvents: 'none' }} />
                  {product.badge && <div style={{ position: 'absolute', top: 20, right: 20, background: `${product.accent}22`, border: `1px solid ${product.accent}44`, color: product.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 999, textTransform: 'uppercase' }}>{product.badge}</div>}
                  <div className="p-8 flex flex-col flex-1 relative">
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: `${product.accent}15`, border: `1px solid ${product.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}><Icon style={{ width: 28, height: 28, color: product.accent }} /></div>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: product.accent, marginBottom: 8, display: 'block' }}>{product.type}</span>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <h3 className="hero-title text-2xl md:text-3xl font-black text-white leading-tight">{product.name}</h3>
                      <div className="md:text-right flex-shrink-0"><div className="text-2xl font-black text-white">${product.price.toLocaleString()}</div><div className="text-xs text-slate-500 mt-0.5">{product.billing}</div></div>
                    </div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0 20px' }} />
                    {product.customGraphic && product.customGraphic}
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">{product.description}</p>
                    <div className="flex flex-wrap gap-3 mb-10">
                      {product.features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}><CheckCircle style={{ width: 14, height: 14, color: product.accent, flexShrink: 0 }} />{f}</div>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <button onClick={() => addToCart(product)} className={`w-full font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm ${isAdded ? 'added-flash' : ''}`} style={{ background: isAdded ? `${product.accent}33` : `linear-gradient(135deg, ${product.accent}, ${product.accentDark})`, color: isAdded ? product.accent : '#000', border: isAdded ? `1px solid ${product.accent}50` : 'none', boxShadow: isAdded ? 'none' : `0 8px 20px ${product.glow}` }}>
                        {isAdded ? '✓ Added to Order' : <>Add to Order <ChevronRight className="w-4 h-4" /></>}
                      </button>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="why-us" className="relative z-10 py-20 px-4 bg-black/40 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-3">Unfair Advantage</p>
            <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Why ThinkStack?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">We solve the root cause of poor shopping experiences by replacing traditional cashier-based billing with an autonomous, high-speed ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-3xl p-8 border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6"><Zap className="w-6 h-6 text-cyan-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Waiting Time</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Customers scan products using a mobile app while shopping. Items are added to a digital cart in real-time, completely bypassing the checkout queue.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-cyan-500" /> Faster shopping experience</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-cyan-500" /> Real-time bill transparency</li>
              </ul>
            </div>
            
            <div className="glass-card rounded-3xl p-8 border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6"><Layers className="w-6 h-6 text-purple-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Integrated Store Operations</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Our system isn't just a payment gateway. We offer an integrated app combined with a live store inventory system, creating high switching costs once adopted.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-purple-500" /> Reduces crowding inside stores</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-purple-500" /> Strong retailer partnerships built in</li>
              </ul>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6"><BarChart3 className="w-6 h-6 text-amber-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Deep Customer Data</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Unlock premium analytics for retailers. Gain granular data insights on customer buying behavior to optimize store layouts and featured product promotions.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-amber-500" /> Track daily transactions through app</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle className="w-4 h-4 text-amber-500" /> Identify and retain early adopters</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER DOCUMENTATION */}
      <section id="docs" className="relative z-10 py-32 px-4 bg-gradient-to-b from-transparent to-[#06b6d4]/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-bold tracking-wider uppercase mb-6"><Code className="w-3 h-3"/> Developer First</div>
            <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Retail integration<br/>made effortless.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              We provide full retail integration support. Whether you use traditional POS systems or modern cloud databases, the ThinkStack OS API syncs your entire inventory in minutes.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0"><Terminal className="w-5 h-5 text-cyan-400"/></div>
                <div>
                  <h4 className="text-white font-bold">RESTful & GraphQL APIs</h4>
                  <p className="text-sm text-slate-500 mt-1">Connect your existing ERP instantly with our thoroughly documented endpoints.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-blue-400"/></div>
                <div>
                  <h4 className="text-white font-bold">Secure Payment Gateways</h4>
                  <p className="text-sm text-slate-500 mt-1">We handle the payment gateway charges and PCI compliance routing.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-[#0d1117] shadow-2xl shadow-cyan-500/10">
              <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 flex items-center gap-2 text-xs text-slate-500 font-mono"><FileJson className="w-3 h-3"/> sync_inventory.js</div>
              </div>
              <div className="p-6 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                <pre><code><span className="text-purple-400">import</span> {'{ ThinkStack }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@thinkstack/os-sdk'</span>;{'\n\n'}<span className="text-slate-500">// Initialize client with store credentials</span>{'\n'}<span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> <span className="text-amber-300">ThinkStack</span>({'{'}{'\n'}{'  '}apiKey: process.env.<span className="text-blue-300">THINKSTACK_API_KEY</span>,{'\n'}{'  '}storeId: <span className="text-green-400">'STR_9841_NYC'</span>{'\n'}{'}'});{'\n\n'}<span className="text-slate-500">// Real-time inventory sync hook</span>{'\n'}client.inventory.<span className="text-blue-300">onUpdate</span>(<span className="text-purple-400">async</span> (payload) =&gt; {'{'}{'\n'}{'  '}<span className="text-purple-400">try</span> {'{'}{'\n'}{'    '}<span className="text-purple-400">await</span> database.<span className="text-blue-300">sync</span>(payload.items);{'\n'}{'    '}console.<span className="text-blue-300">log</span>(<span className="text-green-400">`Synced ${'{payload.items.length}'} products`</span>);{'\n'}{'  '}{'}'} <span className="text-purple-400">catch</span> (err) {'{'}{'\n'}{'    '}console.<span className="text-blue-300">error</span>(<span className="text-green-400">'Sync failed:'</span>, err);{'\n'}{'  '}{'}'}{'\n'}{'}'});<span className="cursor-blink bg-cyan-400 text-transparent">_</span></code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={(e) => e.target === e.currentTarget && setIsCartOpen(false)}>
          <div className="cart-slide w-full max-w-md h-full flex flex-col border-l border-white/10" style={{ background: '#0a0a18', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}>
            <div className="px-6 py-6 border-b border-white/[0.08] flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-lg font-black flex items-center gap-2 text-white hero-title"><ShoppingCart className="w-5 h-5 text-cyan-400" />Your Order</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
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
              )}
            </div>
            <div className="p-6 border-t border-white/[0.08]" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="glass-card rounded-2xl p-4 mb-5">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium text-sm">Order Total</span><span className="text-3xl font-black text-white hero-title">${cartTotal.toLocaleString()}</span></div>
              </div>
              <button disabled={cart.length === 0 || (!user && isLoggingIn)} onClick={() => { if (!user) { alert("Please login with Google first."); handleGoogleLogin(); } else { alert("Proceeding to payment..."); } }} className="w-full font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-sm" style={{ background: cart.length > 0 ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.05)', color: cart.length > 0 ? 'white' : '#334155', cursor: cart.length > 0 ? 'pointer' : 'not-allowed' }}>{user ? "Checkout" : "Login to Checkout"} <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] bg-[#05050a] py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-cyan-500 fill-cyan-500" /><span className="font-black text-xl tracking-tight hero-title">Think Stack</span></div>
          <div className="flex gap-8 text-sm text-slate-400">
            <div className="flex flex-col items-center"><span className="font-bold text-slate-200">Vedant Parab</span><span className="text-xs">CEO</span></div>
            <div className="flex flex-col items-center"><span className="font-bold text-slate-200">Omshree Parida</span><span className="text-xs">CTO</span></div>
            <div className="flex flex-col items-center"><span className="font-bold text-slate-200">Alan</span><span className="text-xs">CFO</span></div>
          </div>
          <div className="text-sm text-slate-500">© 2026 Think Stack. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}