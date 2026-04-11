import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, ShieldCheck, BarChart3, TrendingUp, Users, Store, ChevronRight } from 'lucide-react';
import { Reveal } from '../components/Shared';

/* ─────────────────────────────────────────────
   ANIMATED DIAGRAMS — ScanPay Handheld Device
───────────────────────────────────────────── */

/** DIAGRAM 1 — LIFT (handheld lifted from cart dock, powers on) */
function DockDiagram() {
  const [lifted, setLifted] = useState(false);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setLifted(false); setGlowing(false);
      const t1 = setTimeout(() => setLifted(true), 1000);
      const t2 = setTimeout(() => setGlowing(true), 1600);
      return [t1, t2];
    };
    let timers = cycle();
    const interval = setInterval(() => { timers.forEach(clearTimeout); timers = cycle(); }, 3600);
    return () => { clearInterval(interval); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div style={{ position: 'relative', width: 220, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>

        {/* Handheld body — floats up when lifted */}
        <div style={{ position: 'absolute', bottom: lifted ? 130 : 60, transition: 'bottom 0.6s cubic-bezier(0.34,1.56,0.64,1)', zIndex: 2 }}>
          <div style={{
            width: 72, height: 110,
            background: 'linear-gradient(160deg,#1e293b,#0f172a)',
            borderRadius: '12px 12px 6px 6px',
            border: `2px solid ${glowing ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: glowing ? '0 0 30px rgba(6,182,212,0.5), inset 0 0 15px rgba(6,182,212,0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 6px 6px', position: 'relative',
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}>
            {/* Mini screen */}
            <div style={{
              width: '100%', height: 52, background: glowing ? 'linear-gradient(135deg,#0c1a2e,#0a1628)' : '#0a0a12',
              borderRadius: 8, border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              transition: 'background 0.4s',
            }}>
              {glowing ? (
                <>
                  <Zap style={{ width: 14, height: 14, color: '#06b6d4', fill: '#06b6d4' }} />
                  <span style={{ fontSize: 8, color: '#06b6d4', fontWeight: 800, letterSpacing: '0.1em' }}>READY</span>
                  <div style={{ width: 28, height: 2, background: 'rgba(6,182,212,0.3)', borderRadius: 2 }} />
                </>
              ) : (
                <span style={{ fontSize: 7, color: '#334155', fontWeight: 600 }}>OFF</span>
              )}
            </div>
            {/* Scan slot */}
            <div style={{ width: 48, height: 6, marginTop: 8, borderRadius: 3, background: glowing ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.05)', boxShadow: glowing ? '0 0 8px rgba(6,182,212,0.6)' : 'none', transition: 'all 0.4s' }} />
            {/* Power LED */}
            <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: glowing ? '#06b6d4' : '#1e293b', boxShadow: glowing ? '0 0 8px #06b6d4' : 'none', transition: 'all 0.4s' }} />
            {/* Grip ridges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8, width: '80%' }}>
              {[1,2,3].map(i => <div key={i} style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }} />)}
            </div>
          </div>
          {/* Handle */}
          <div style={{ width: 40, height: 32, marginLeft: 16, background: 'linear-gradient(160deg,#1a2540,#0d1525)', borderRadius: '0 0 14px 14px', border: '2px solid rgba(255,255,255,0.07)', borderTop: 'none' }} />
        </div>

        {/* Cart dock */}
        <div style={{ width: 90, height: 56, background: 'linear-gradient(160deg,#1e293b,#0f172a)', borderRadius: '10px 10px 16px 16px', border: '2px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
          <div style={{ width: 54, height: 28, background: '#080812', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)' }} />
          <span style={{ position: 'absolute', bottom: 6, fontSize: 7, color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>DOCK</span>
        </div>

        {/* Cart rail */}
        <div style={{ width: 180, height: 12, background: 'linear-gradient(90deg,#1e293b,#0f172a)', borderRadius: 8, marginTop: 4, border: '1px solid rgba(255,255,255,0.06)' }} />

        {/* Up arrow hint */}
        {!lifted && (
          <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', fontSize: 20, color: 'rgba(6,182,212,0.6)', animation: 'arrowBob 0.8s ease-in-out infinite alternate' }}>↑</div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#06b6d4', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{lifted && glowing ? '✓ Handheld Active' : 'Lift from Cart Dock'}</p>
        <p style={{ color: '#64748b', fontSize: 12 }}>Powers on automatically when lifted — no setup needed</p>
      </div>
      <style>{`@keyframes arrowBob { from { transform: translateX(-50%) translateY(0); } to { transform: translateX(-50%) translateY(-6px); } }`}</style>
    </div>
  );
}

/** DIAGRAM 2 — SCAN (gun-grip handheld fires laser at product barcode) */
function ScanDiagram() {
  const [beamY, setBeamY] = useState(0);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let raf, start = null;
    const DURATION = 1600;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = ((ts - start) % DURATION) / DURATION;
      setBeamY(Math.sin(t * Math.PI * 2) * 28);
      if (t > 0.48 && t < 0.52) { setScanned(true); setTimeout(() => setScanned(false), 350); }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div style={{ position: 'relative', width: 280, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>

        {/* Handheld — gun-grip shape pointing right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ width: 60, height: 88, background: 'linear-gradient(160deg,#1e293b,#0f172a)', borderRadius: '10px 10px 4px 4px', border: '2px solid rgba(139,92,246,0.5)', boxShadow: '0 0 20px rgba(139,92,246,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ width: 40, height: 30, background: '#0c1525', borderRadius: 6, border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 7, color: '#a78bfa', fontWeight: 800 }}>SCAN</span>
            </div>
            {/* Laser emitter */}
            <div style={{ width: 38, height: 5, borderRadius: 3, background: 'rgba(139,92,246,0.7)', boxShadow: '0 0 10px rgba(139,92,246,0.9)' }} />
          </div>
          {/* Pistol grip */}
          <div style={{ width: 32, height: 30, marginRight: 6, background: 'linear-gradient(160deg,#1a2540,#0d1525)', borderRadius: '0 0 12px 12px', border: '2px solid rgba(255,255,255,0.06)', borderTop: 'none' }} />
        </div>

        {/* Animated laser beam */}
        <div style={{ flex: 1, height: 3, margin: '0 6px', position: 'relative', top: beamY, background: 'linear-gradient(90deg,rgba(139,92,246,0.9),rgba(167,139,250,0.5),transparent)', boxShadow: '0 0 10px rgba(139,92,246,0.7)', borderRadius: 2, transition: 'top 0.04s linear' }} />

        {/* Product + barcode */}
        <div style={{ width: 84, height: 118, background: 'linear-gradient(160deg,#1e2d3d,#10192a)', borderRadius: 12, border: `2px solid ${scanned ? 'rgba(139,92,246,0.8)' : 'rgba(255,255,255,0.08)'}`, boxShadow: scanned ? '0 0 28px rgba(139,92,246,0.5)' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', padding: 8 }}>
          <div style={{ width: '100%', height: 34, background: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              {[5,3,7,2,6,4,8,3,5,7,4,6].map((h,i) => <div key={i} style={{ width: 2.5, height: h * 2.5, background: '#111' }} />)}
            </div>
          </div>
          <div style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center', fontWeight: 600 }}>Product</div>
          <div style={{ fontSize: 9, fontWeight: 800, color: scanned ? '#a78bfa' : 'transparent', transition: 'color 0.1s' }}>✓ Added</div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Aim & Scan</p>
        <p style={{ color: '#64748b', fontSize: 12 }}>Laser reads the barcode in under 300ms per item</p>
      </div>
    </div>
  );
}

/** DIAGRAM 3 — PAY (handheld screen: cart → processing → paid → gate open) */
function PayDiagram() {
  const items = [
    { name: 'Organic Apples', price: '$3.49', accent: '#06b6d4' },
    { name: 'Whole Grain Bread', price: '$2.99', accent: '#8b5cf6' },
    { name: 'Sparkling Water', price: '$1.79', accent: '#f59e0b' },
  ];
  const [phase, setPhase] = useState('cart');

  useEffect(() => {
    const cycle = () => {
      setPhase('cart');
      const t1 = setTimeout(() => setPhase('confirm'), 1800);
      const t2 = setTimeout(() => setPhase('done'), 2900);
      const t3 = setTimeout(() => setPhase('cart'), 4400);
      return [t1, t2, t3];
    };
    let timers = cycle();
    const interval = setInterval(() => { timers.forEach(clearTimeout); timers = cycle(); }, 4800);
    return () => { clearInterval(interval); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Handheld body */}
        <div style={{ width: 162, height: 222, background: 'linear-gradient(160deg,#1e293b,#0f172a)', borderRadius: '18px 18px 8px 8px', border: `2px solid ${phase === 'done' ? 'rgba(34,197,94,0.6)' : 'rgba(245,158,11,0.35)'}`, boxShadow: phase === 'done' ? '0 0 30px rgba(34,197,94,0.4)' : '0 0 20px rgba(245,158,11,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 10px 8px', transition: 'all 0.4s', position: 'relative' }}>
          {/* Screen */}
          <div style={{ width: '100%', flex: 1, background: '#060612', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em' }}>CART</span>
              <span style={{ fontSize: 8, color: '#475569' }}>3 items</span>
            </div>
            <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {phase === 'done' ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', border: '2px solid rgba(34,197,94,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✓</div>
                  <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 800 }}>PAID</span>
                  <span style={{ fontSize: 8, color: '#475569' }}>Gate unlocked ↑</span>
                </div>
              ) : (
                <>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 8, color: '#94a3b8' }}>{item.name}</span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: item.accent }}>{item.price}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '2px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 8, color: '#64748b', fontWeight: 600 }}>TOTAL</span>
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 800 }}>$8.27</span>
                  </div>
                  <div style={{ marginTop: 4, padding: '6px 0', borderRadius: 6, textAlign: 'center', background: phase === 'confirm' ? 'rgba(245,158,11,0.3)' : 'linear-gradient(135deg,#f59e0b,#d97706)', fontSize: 9, fontWeight: 800, color: phase === 'confirm' ? '#f59e0b' : '#000', transition: 'all 0.3s' }}>
                    {phase === 'confirm' ? 'Processing...' : 'PAY NOW'}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Power LED */}
          <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: phase === 'done' ? '#22c55e' : '#f59e0b', boxShadow: phase === 'done' ? '0 0 8px #22c55e' : '0 0 8px #f59e0b', transition: 'all 0.3s' }} />
        </div>
        {/* Pistol grip */}
        <div style={{ width: 80, height: 36, marginLeft: 20, background: 'linear-gradient(160deg,#1a2540,#0d1525)', borderRadius: '0 0 18px 18px', border: '2px solid rgba(255,255,255,0.06)', borderTop: 'none' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
          {phase === 'done' ? '✓ Exit Gate Unlocked' : 'Tap Pay Now on Device'}
        </p>
        <p style={{ color: '#64748b', fontSize: 12 }}>NFC payment on the handheld — gate opens in &lt;1s</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE DATA
───────────────────────────────────────────── */
const OUTCOMES = [
  { icon: Zap,         val: '< 3s',   label: 'Avg. checkout time',        accent: '#06b6d4' },
  { icon: TrendingUp,  val: '40%',    label: 'Overhead reduction',         accent: '#8b5cf6' },
  { icon: Users,       val: '3×',     label: 'Faster customer throughput', accent: '#f59e0b' },
  { icon: ShieldCheck, val: '99.99%', label: 'Platform uptime SLA',        accent: '#22c55e' },
];

const STEPS = [
  {
    id: 'dock',
    label: '① Lift Handheld',
    accent: '#06b6d4',
    diagram: <DockDiagram />,
    title: 'Lift the ScanPay Handheld',
    desc: 'The ScanPay Handheld sits docked in the shopping cart. The moment a customer lifts it, the device powers on automatically via motion detection and connects to the store\'s live inventory grid over Wi-Fi 6 — no login, no pairing, no setup required.',
  },
  {
    id: 'scan',
    label: '② Scan Products',
    accent: '#8b5cf6',
    diagram: <ScanDiagram />,
    title: 'Scan Every Product',
    desc: 'Point the handheld\'s laser at any product barcode while shopping the aisle. It reads in under 300ms, instantly adds the item to the live digital cart on the device screen, and syncs stock levels back to the store\'s inventory in real-time.',
  },
  {
    id: 'pay',
    label: '③ Pay & Walk Out',
    accent: '#f59e0b',
    diagram: <PayDiagram />,
    title: 'Confirm & Pay on Device',
    desc: 'When done shopping, the customer taps "Pay Now" directly on the handheld screen. Payment processes in under 1 second via the device\'s built-in NFC reader. The store exit gate unlocks automatically — no cashier, no self-checkout kiosk, zero queue.',
  },
];

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function HowItWorksPage({ setCurrentPage }) {
  const [activeStep, setActiveStep] = useState('dock');
  const active = STEPS.find(s => s.id === activeStep);
  const activeIndex = STEPS.findIndex(s => s.id === activeStep);

  return (
    <div className="pt-36 pb-24 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-cyan-400 text-xs font-bold tracking-[0.15em] uppercase mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              Handheld Powered
            </div>
            <h1 className="hero-title text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-[1.05]">
              How ScanPay<br /><span className="shimmer-text">Actually Works</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Three interactions. The ScanPay Handheld does everything — lift, scan, pay. Visualised step by step.
            </p>
          </div>
        </Reveal>

        {/* Step Tab Selector */}
        <Reveal delay={100}>
          <div className="flex justify-center mb-12">
            <div className="flex items-center bg-[#0a0a14] border border-white/10 rounded-full p-1.5 gap-1 shadow-xl">
              {STEPS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className="px-6 py-3 rounded-full text-sm font-bold transition-all duration-300"
                  style={{
                    background: activeStep === s.id ? s.accent : 'transparent',
                    color: activeStep === s.id ? '#000' : '#94a3b8',
                    boxShadow: activeStep === s.id ? `0 0 20px ${s.accent}50` : 'none',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Interactive Diagram + Explanation */}
        <Reveal delay={150}>
          <div className="rounded-3xl overflow-hidden mb-16" style={{ background: '#0a0a12', border: `1px solid ${active.accent}20`, boxShadow: `0 0 60px ${active.accent}10, 0 30px 60px rgba(0,0,0,0.5)` }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left — diagram */}
              <div className="flex items-center justify-center p-12 min-h-[380px]" style={{ background: `radial-gradient(ellipse at center, ${active.accent}08 0%, transparent 70%)`, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                {active.diagram}
              </div>

              {/* Right — text */}
              <div className="p-10 flex flex-col justify-center">
                <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4 block" style={{ color: active.accent }}>
                  Step {activeIndex + 1} of {STEPS.length}
                </span>
                <h2 className="hero-title text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{active.title}</h2>
                <p className="text-slate-400 leading-relaxed mb-8">{active.desc}</p>

                {/* Dot indicators */}
                <div className="flex items-center gap-3 mb-8">
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <button
                        onClick={() => setActiveStep(s.id)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: activeStep === s.id ? 24 : 10, height: 10, background: activeStep === s.id ? s.accent : 'rgba(255,255,255,0.15)', boxShadow: activeStep === s.id ? `0 0 10px ${s.accent}` : 'none' }}
                      />
                      {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex gap-3">
                  {activeIndex > 0 && (
                    <button onClick={() => setActiveStep(STEPS[activeIndex - 1].id)} className="px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold transition-all text-sm">
                      ← Back
                    </button>
                  )}
                  {activeIndex < STEPS.length - 1 ? (
                    <button
                      onClick={() => setActiveStep(STEPS[activeIndex + 1].id)}
                      className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${active.accent}, ${active.accent}bb)`, color: '#000' }}
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setCurrentPage?.('products'); window.scrollTo(0, 0); }}
                      className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', color: '#000', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                    >
                      Explore Products <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Flow Overview Row */}
        <Reveal delay={200}>
          <div className="mb-16">
            <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-8">Full Flow at a Glance</p>
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div
                    onClick={() => setActiveStep(s.id)}
                    className="flex-1 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{ background: activeStep === s.id ? `${s.accent}12` : '#0a0a12', border: `1px solid ${activeStep === s.id ? `${s.accent}40` : 'rgba(255,255,255,0.05)'}`, boxShadow: activeStep === s.id ? `0 0 30px ${s.accent}15` : 'none' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-base font-black" style={{ background: `${s.accent}20`, color: s.accent, border: `1px solid ${s.accent}30` }}>{i + 1}</div>
                    <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{s.desc.slice(0, 80)}...</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:flex items-center flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Outcomes Stats */}
        <Reveal delay={250}>
          <div className="rounded-3xl p-10 mb-12" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-cyan-400 mb-8">Real-World Outcomes</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {OUTCOMES.map(({ icon: Icon, val, label, accent }) => (
                <div key={label} className="text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
                    <Icon style={{ width: 22, height: 22, color: accent }} />
                  </div>
                  <div className="text-3xl font-black mb-1 shimmer-text hero-title">{val}</div>
                  <div className="text-xs text-slate-400 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTA Buttons — both working */}
        <Reveal delay={300}>
          <div className="text-center">
            <p className="text-slate-400 mb-6">Ready to transform your store?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setCurrentPage?.('products'); window.scrollTo(0, 0); }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105"
              >
                <Store className="w-4 h-4" /> Explore Products <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setCurrentPage?.('services'); window.scrollTo(0, 0); }}
                className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm border border-white/10 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <BarChart3 className="w-4 h-4" /> View Full Specs <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
