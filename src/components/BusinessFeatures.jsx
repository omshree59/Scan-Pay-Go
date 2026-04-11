/**
 * BusinessFeatures.jsx
 * Exports: BookDemoModal, LiveChatWidget, TestimonialsSection, ROICalculator, ComparisonTable
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  X, Calendar, Clock, CheckCircle, ChevronRight, ChevronLeft,
  MessageCircle, Send, Bot, User, Star, Quote,
  TrendingDown, DollarSign, Zap, BarChart2, Minus
} from 'lucide-react';
import { Reveal } from './Shared';

// ─────────────────────────────────────────────
// 1. BOOK A DEMO MODAL
// ─────────────────────────────────────────────
const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
const DATES = (() => {
  const arr = [];
  const d = new Date();
  for (let i = 1; i <= 14; i++) {
    const next = new Date(d);
    next.setDate(d.getDate() + i);
    if (next.getDay() !== 0 && next.getDay() !== 6) arr.push(next);
    if (arr.length >= 8) break;
  }
  return arr;
})();

export function BookDemoModal({ onClose }) {
  const [step, setStep] = useState(0); // 0=date, 1=details, 2=confirm
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', size: '' });
  const [submitted, setSubmitted] = useState(false);

  const SIZES = ['1–5 locations', '6–20 locations', '21–50 locations', '50+ locations'];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setStep(2); }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-[2rem] overflow-hidden border border-white/10"
        style={{
          background: 'linear-gradient(135deg, #0a0a18 0%, #080c1c 100%)',
          boxShadow: '0 30px 80px rgba(6,182,212,0.15), 0 0 0 1px rgba(255,255,255,0.04)',
          animation: 'fadeUp 0.3s ease forwards'
        }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/[0.06] flex items-center justify-between"
          style={{ background: 'linear-gradient(to right, rgba(6,182,212,0.08), transparent)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">Live Demo Booking</span>
            </div>
            <h2 className="hero-title text-xl font-black text-white">
              {step === 2 ? "You're all set! 🎉" : "Book a Product Demo"}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8">
          {/* Step 0: Pick date + time */}
          {step === 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-5">Choose a date and time for your 30-minute live walkthrough.</p>

              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Select Date</label>
                <div className="grid grid-cols-4 gap-2">
                  {DATES.map((d, i) => (
                    <button key={i} onClick={() => setSelectedDate(d)}
                      className={`p-3 rounded-xl text-center transition-all text-sm font-bold ${
                        selectedDate?.toDateString() === d.toDateString()
                          ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                          : 'bg-white/[0.04] border border-white/[0.06] text-slate-300 hover:bg-white/[0.08]'
                      }`}>
                      <div className="text-[10px] opacity-70 font-medium">
                        {d.toLocaleDateString('en', { weekday: 'short' })}
                      </div>
                      <div className="text-base font-black">{d.getDate()}</div>
                      <div className="text-[10px] opacity-70">{d.toLocaleDateString('en', { month: 'short' })}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                  <Clock className="w-3 h-3 inline mr-1" /> Select Time (EST)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                        selectedTime === t
                          ? 'bg-cyan-500 text-black'
                          : 'bg-white/[0.04] border border-white/[0.06] text-slate-300 hover:bg-white/[0.08]'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(1)} disabled={!selectedDate || !selectedTime}
                className="w-full py-4 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                Continue <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}

          {/* Step 1: Contact details */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-cyan-300">
                <Calendar className="w-4 h-4 shrink-0" />
                {selectedDate?.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </div>

              <div className="space-y-3">
                {[
                  { k: 'name', p: 'Your Name' },
                  { k: 'email', p: 'Work Email' },
                  { k: 'company', p: 'Company Name' },
                ].map(({ k, p }) => (
                  <input key={k}
                    type={k === 'email' ? 'email' : 'text'}
                    placeholder={p}
                    value={form[k]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                ))}
                <div>
                  <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                    style={{ backgroundImage: 'none' }}>
                    <option value="" className="bg-[#0a0a18]">Store size</option>
                    {SIZES.map(s => <option key={s} value={s} className="bg-[#0a0a18]">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)}
                  className="px-5 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm transition-all">
                  <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
                </button>
                <button onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.company || submitted}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                  {submitted ? '⏳ Confirming...' : 'Confirm Demo'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmed */}
          {step === 2 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ boxShadow: '0 0 40px rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="hero-title text-xl font-black text-white mb-2">Demo Confirmed!</h3>
              <p className="text-slate-400 text-sm mb-2">
                {selectedDate?.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
              <p className="text-slate-500 text-xs mb-6">A calendar invite and meeting link have been sent to <span className="text-cyan-400">{form.email}</span></p>
              <div className="space-y-2 text-sm text-left bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] mb-6">
                {["30-min live product walkthrough", "Dedicated solutions engineer", "Custom pricing for your chain", "Q&A + next steps discussion"].map(i => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0" /> {i}
                  </div>
                ))}
              </div>
              <button onClick={onClose}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-black transition-all"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. LIVE CHAT WIDGET
// ─────────────────────────────────────────────
const CHAT_RESPONSES = {
  'pricing': "Our pricing starts at $899 for the Handheld 5-Pack and $1,299 for Kiosk Pro (hardware). ThinkStack OS is $2,499/month or $25,550/year. Want me to generate a custom quote for your chain?",
  'demo': "Of course! I can book you a live 30-minute demo with one of our solutions engineers. Just hit the 'Book a Demo' button above — they'll walk through everything tailored to your store setup.",
  'install': "Most standard deployments take 48 hours per location. Our certified technicians handle everything — hardware installation, Wi-Fi 6 configuration, and OS activation. We work overnight to avoid disrupting your operations.",
  'security': "ScanPay is PCI-DSS Level 1 compliant and SOC 2 Type II certified. Payments are routed through encrypted PCI-compliant gateways and our Kiosk Pro includes AI computer vision anti-theft verification.",
  'integration': "ThinkStack OS integrates with over 40 major ERP and inventory systems out of the box — SAP, Oracle Retail, NetSuite, Shopify, and more. REST and GraphQL APIs are fully documented for custom integrations.",
  'default': "Great question! I'm here to help with anything about ScanPay's hardware, software, pricing, or deployment. Could you give me a bit more detail about what you're looking for?"
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('price') || m.includes('cost') || m.includes('pricing') || m.includes('how much')) return CHAT_RESPONSES.pricing;
  if (m.includes('demo') || m.includes('trial') || m.includes('see it')) return CHAT_RESPONSES.demo;
  if (m.includes('install') || m.includes('deploy') || m.includes('setup') || m.includes('how long')) return CHAT_RESPONSES.install;
  if (m.includes('secure') || m.includes('security') || m.includes('pci') || m.includes('safe')) return CHAT_RESPONSES.security;
  if (m.includes('integrat') || m.includes('erp') || m.includes('api') || m.includes('connect')) return CHAT_RESPONSES.integration;
  return CHAT_RESPONSES.default;
}

export function LiveChatWidget({ onBookDemo }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm Aria, ScanPay's AI assistant. 👋 Ask me anything about our hardware, pricing, or deployment — or I can book you a live demo right now." }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getBotReply(userMsg);
      setMessages(m => [...m, { from: 'bot', text: reply }]);
    }, 900 + Math.random() * 600);
  };

  const QUICK = ['Pricing', 'Book a demo', 'Installation time', 'Security'];

  return (
    <>
      {/* Floating Sparkle/Bot Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button onClick={() => setOpen(o => !o)}
          className="relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110"
          style={{ 
            background: open ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)', 
            boxShadow: open ? 'none' : '0 10px 40px -10px rgba(6,182,212,0.8)',
            border: open ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
          {open ? (
            <X className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
          ) : (
            <>
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-400 opacity-50 animate-ping" style={{ animationDuration: '2s' }} />
              <Bot className="w-6 h-6 text-white drop-shadow-md" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#030305]" />
            </>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[100] w-[340px] md:w-[380px] rounded-[2rem] overflow-hidden border border-white/[0.08]"
          style={{
            background: 'rgba(10, 15, 30, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset',
            animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
          
          {/* Header */}
          <div className="relative px-6 py-5 flex items-center gap-4 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
            {/* Ambient background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500 rounded-full blur-[60px] opacity-20 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600 rounded-full blur-[60px] opacity-20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="relative w-12 h-12 rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                <div className="w-full h-full bg-[#0a0f1e] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-[#0a0f1e]" />
            </div>
            
            <div className="relative z-10">
              <div className="font-black text-white tracking-wide text-base">Aria AI</div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400/80 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Solutions Expert
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[320px] overflow-y-auto p-5 space-y-4 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.from === 'user' ? 'flex-row-reverse' : ''}`} style={{ animation: 'fadeUp 0.3s ease forwards' }}>
                {m.from === 'bot' && (
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs mt-1"
                    style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}>
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                
                <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                  m.from === 'bot'
                    ? 'bg-white/[0.04] border border-white/[0.06] text-slate-200 rounded-2xl rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-[0_4px_20px_rgba(6,182,212,0.3)]'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {/* Animated Typing Indicator */}
            {typing && (
              <div className="flex gap-3" style={{ animation: 'fadeUp 0.2s ease forwards' }}>
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs mt-1"
                  style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 px-5 py-4 bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm w-fit">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500" 
                      style={{ animation: `bounce 1s infinite`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 whitespace-nowrap mask-edges">
            {QUICK.map(q => (
              <button key={q}
                onClick={() => { if (q === 'Book a demo') { onBookDemo(); } else { setInput(q); setTimeout(send, 0); setMessages(m => [...m, { from: 'user', text: q }]); setTyping(true); setTimeout(() => { setTyping(false); setMessages(m => [...m, { from: 'bot', text: getBotReply(q) }]); }, 900); } }}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all shadow-sm">
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/[0.08] bg-black/20">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Message Aria..."
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl pl-5 pr-14 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all"
              />
              <button onClick={send} disabled={!input.trim()}
                className="absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:scale-100 hover:scale-105"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.1)' }}>
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// 3. TESTIMONIALS SECTION
// ─────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "ScanPay reduced our average checkout time from 4.2 minutes to under 40 seconds. The Kiosk Pro paid for itself in customer satisfaction scores alone within the first quarter.",
    name: "Sarah Chen", title: "VP of Operations", company: "Kroger Express Chain",
    avatar: "SC", color: "#06b6d4", rating: 5,
    stat: "85% faster checkout"
  },
  {
    quote: "The ThinkStack OS dashboard is genuinely unlike anything we've used. Real-time inventory sync with our SAP system just worked, out of the box. Our IT team was shocked.",
    name: "Marcus Webb", title: "CTO", company: "ALDI UK Division",
    avatar: "MW", color: "#8b5cf6", rating: 5,
    stat: "40% overhead reduction"
  },
  {
    quote: "Our shrinkage rates dropped 31% in the first six months. The AI weight verification on the Kiosk Pro catches discrepancies that would've slipped through any human operator.",
    name: "Priya Anand", title: "Head of Loss Prevention", company: "Carrefour APAC",
    avatar: "PA", color: "#f59e0b", rating: 5,
    stat: "31% shrinkage reduction"
  },
  {
    quote: "We piloted ScanPay across 12 locations before rolling it out to our full 340-store chain. Setup time per store averaged just 36 hours. Unbelievable for enterprise hardware.",
    name: "James Kowalski", title: "SVP Retail Innovation", company: "Costco Wholesale",
    avatar: "JK", color: "#10b981", rating: 5,
    stat: "340 stores deployed"
  },
  {
    quote: "The buyer heatmaps are a game-changer for our planogram strategy. We A/B tested two layouts and the heatmap data drove a 22% uplift in impulse purchase revenue.",
    name: "Li Wei", title: "Category Director", company: "7-Eleven Asia Pacific",
    avatar: "LW", color: "#ef4444", rating: 5,
    stat: "22% impulse revenue uplift"
  }
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (dir) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
      setAnimating(false);
    }, 250);
  };

  const t = TESTIMONIALS[current];

  return (
    <section className="relative z-20 py-24 px-4 pointer-events-auto overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: `radial-gradient(circle, ${t.color}, transparent 70%)`, transition: 'background 0.5s ease' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-500 mb-3">Social Proof</p>
            <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Trusted by retail leaders
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Hear directly from the operations teams and CTOs who've deployed ScanPay at scale.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="max-w-4xl mx-auto">
            {/* Main card */}
            <div className="relative rounded-[2.5rem] p-8 md:p-12 border border-white/[0.06] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                opacity: animating ? 0 : 1,
                transform: animating ? 'translateY(8px)' : 'translateY(0)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
              }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: t.color, filter: 'blur(80px)', opacity: 0.08, transform: 'translate(30%, -30%)', transition: 'background 0.5s ease' }} />

              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-1">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <Quote className="w-10 h-10 mb-4 opacity-20" style={{ color: t.color }} />

                  <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-8 italic">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-sm text-slate-400">{t.title} · {t.company}</div>
                    </div>
                  </div>
                </div>

                {/* Stat */}
                <div className="md:w-48 shrink-0 flex items-center md:items-start justify-center md:justify-start">
                  <div className="text-center md:text-left p-6 rounded-2xl border flex flex-col gap-1"
                    style={{ borderColor: t.color + '30', background: t.color + '08' }}>
                    <TrendingDown className="w-6 h-6 mb-2" style={{ color: t.color }} />
                    <div className="hero-title text-2xl font-black text-white leading-tight">{t.stat}</div>
                    <div className="text-xs text-slate-400">outcome reported</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
              <button onClick={() => go(-1)}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 250); }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 8,
                      height: 8,
                      background: i === current ? t.color : 'rgba(255,255,255,0.15)'
                    }} />
                ))}
              </div>

              <button onClick={() => go(1)}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. ROI CALCULATOR
// ─────────────────────────────────────────────
function formatCurrency(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function ROICalculator() {
  const [lanes, setLanes] = useState(8);
  const [avgSalary, setAvgSalary] = useState(38000);
  const [weeklySales, setWeeklySales] = useState(120000);

  // ROI model
  const staffSaved = Math.round(lanes * 0.7);
  const staffSavings = staffSaved * avgSalary;
  const throughputGain = weeklySales * 0.18 * 52; // 18% uplift from speed
  const shrinkageReduction = weeklySales * 0.003 * 52; // 0.3% of sales
  const totalAnnual = staffSavings + throughputGain + shrinkageReduction;
  const hardwareCost = lanes * 1299 + 899 + 25550;
  const paybackMonths = Math.round((hardwareCost / totalAnnual) * 12);

  const SliderRow = ({ label, value, min, max, step, onChange, format }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-slate-300">{label}</label>
        <span className="text-sm font-black text-white">{format(value)}</span>
      </div>
      <div className="relative h-2 bg-white/[0.06] rounded-full">
        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
          style={{ width: `${((value - min) / (max - min)) * 100}%`, background: 'linear-gradient(to right, #06b6d4, #3b82f6)' }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ margin: 0 }} />
        <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}>
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 bg-[#030305] shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
        </div>
      </div>
    </div>
  );

  return (
    <section id="roi" className="relative z-20 py-24 px-4 pointer-events-auto">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">ROI Calculator</p>
            <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              See your exact savings →
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Adjust the sliders to model your store's expected return on investment.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
            {/* Controls */}
            <div className="glass-card rounded-[2rem] p-8 border border-white/[0.06]">
              <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-400" /> Your Store Profile
              </h3>
              <SliderRow label="Checkout Lanes" value={lanes} min={2} max={40} step={1} onChange={setLanes} format={v => `${v} lanes`} />
              <SliderRow label="Average Cashier Salary" value={avgSalary} min={25000} max={65000} step={1000} onChange={setAvgSalary} format={v => `$${v.toLocaleString()}/yr`} />
              <SliderRow label="Weekly Sales Volume" value={weeklySales} min={20000} max={1000000} step={5000} onChange={setWeeklySales} format={v => `$${v.toLocaleString()}`} />

              <div className="mt-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-xs text-slate-500 leading-relaxed">
                Model assumes 70% cashier reduction per lane, 18% throughput uplift, and industry-average 0.3% shrinkage reduction.
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {[
                { label: 'Annual Staff Savings', value: staffSavings, detail: `${staffSaved} FTEs freed`, color: '#10b981', icon: <DollarSign className="w-5 h-5" /> },
                { label: 'Throughput Revenue Uplift', value: throughputGain, detail: '18% speed improvement', color: '#06b6d4', icon: <Zap className="w-5 h-5" /> },
                { label: 'Shrinkage Reduction', value: shrinkageReduction, detail: 'AI weight verification', color: '#8b5cf6', icon: <TrendingDown className="w-5 h-5" /> },
              ].map(({ label, value, detail, color, icon }) => (
                <div key={label} className="glass-card rounded-2xl p-5 border border-white/[0.06] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '15', border: `1px solid ${color}30`, color }}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-0.5">{label}</div>
                    <div className="text-xs text-slate-600">{detail}</div>
                  </div>
                  <div className="hero-title text-xl font-black text-white">{formatCurrency(value)}</div>
                </div>
              ))}

              {/* Total */}
              <div className="rounded-2xl p-6 border" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))', borderColor: 'rgba(6,182,212,0.25)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-sm font-bold mb-1">Total Annual Savings</div>
                    <div className="hero-title text-4xl font-black text-white">{formatCurrency(totalAnnual)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm font-bold mb-1">Payback Period</div>
                    <div className="hero-title text-4xl font-black text-cyan-400">{paybackMonths}mo</div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((12 - paybackMonths) / 12) * 100)}%`, background: 'linear-gradient(to right, #06b6d4, #10b981)' }} />
                </div>
                <div className="text-xs text-slate-500 mt-2">Return on ${hardwareCost.toLocaleString()} hardware investment</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. COMPARISON TABLE
// ─────────────────────────────────────────────
const CHECK = <CheckCircle className="w-5 h-5 text-green-400" />;
const CROSS = <X className="w-5 h-5 text-red-400 opacity-50" />;
const PARTIAL = <Minus className="w-5 h-5 text-amber-400 opacity-70" />;

const ROWS = [
  { label: 'Sub-second checkout', scanpay: CHECK, pos: CROSS, competitor: PARTIAL },
  { label: 'AI weight verification', scanpay: CHECK, pos: CROSS, competitor: CROSS },
  { label: 'Real-time inventory sync', scanpay: CHECK, pos: PARTIAL, competitor: PARTIAL },
  { label: 'Cart-mounted handhelds', scanpay: CHECK, pos: CROSS, competitor: CROSS },
  { label: 'Buyer heatmap analytics', scanpay: CHECK, pos: CROSS, competitor: PARTIAL },
  { label: 'OTA software updates', scanpay: CHECK, pos: CROSS, competitor: CHECK },
  { label: 'PCI-DSS Level 1', scanpay: CHECK, pos: CHECK, competitor: CHECK },
  { label: '40+ ERP integrations', scanpay: CHECK, pos: PARTIAL, competitor: PARTIAL },
  { label: '48hr deployment', scanpay: CHECK, pos: CROSS, competitor: CROSS },
  { label: 'On-device anti-theft CV', scanpay: CHECK, pos: CROSS, competitor: CROSS },
  { label: 'Monthly pricing available', scanpay: CHECK, pos: CHECK, competitor: PARTIAL },
  { label: '24/7 dedicated support', scanpay: CHECK, pos: CROSS, competitor: PARTIAL },
];

export function ComparisonTable() {
  const cols = [
    { label: 'ScanPay', key: 'scanpay', highlight: true, color: '#06b6d4' },
    { label: 'Traditional POS', key: 'pos', highlight: false, color: '#64748b' },
    { label: 'Competitor SCO', key: 'competitor', highlight: false, color: '#64748b' },
  ];

  return (
    <section id="compare" className="relative z-20 py-24 px-4 pointer-events-auto">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400 mb-3">The Honest Comparison</p>
            <h2 className="hero-title text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              ScanPay vs the market
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Side-by-side against traditional cashier POS systems and first-generation self-checkout competitors.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-[2rem] border border-white/[0.06] shadow-2xl relative" style={{ background: 'rgba(5,5,15,0.8)' }}>
            {/* Sticky header */}
            <div className="grid grid-cols-4 border-b border-white/[0.06] sticky top-[80px] z-20 rounded-t-[2rem] backdrop-blur-xl" style={{ background: 'rgba(8, 12, 28, 0.95)' }}>
              <div className="p-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Feature</div>
              {cols.map(col => (
                <div key={col.key} className={`p-5 text-center ${col.highlight ? 'relative' : ''}`}
                  style={{ background: col.highlight ? 'rgba(6,182,212,0.05)' : undefined }}>
                  {col.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, #06b6d4, transparent)' }} />
                  )}
                  <div className={`font-black text-sm ${col.highlight ? 'text-white' : 'text-slate-500'}`}>{col.label}</div>
                  {col.highlight && <div className="text-[10px] text-cyan-500 font-bold mt-0.5 tracking-widest uppercase">Recommended</div>}
                </div>
              ))}
            </div>

            {/* Rows */}
            {ROWS.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 relative group border-b border-white/[0.04] transition-all hover:bg-white/[0.04] ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                <div className="p-4 pl-5 text-sm font-medium transition-colors group-hover:text-cyan-400 flex items-center text-slate-300">{row.label}</div>
                {cols.map(col => (
                  <div key={col.key} className={`p-4 flex items-center justify-center transition-all duration-300 ${col.highlight ? 'bg-cyan-500/[0.03] group-hover:bg-cyan-500/10' : 'group-hover:bg-white/[0.02]'}`}>
                    <div className={`${col.highlight ? 'group-hover:scale-125 transition-transform duration-300' : ''}`}>
                      {row[col.key]}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Footer legend */}
            <div className="px-5 py-4 flex items-center gap-6 text-xs text-slate-500 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Full support</div>
              <div className="flex items-center gap-1.5"><Minus className="w-3.5 h-3.5 text-amber-400 opacity-70" /> Partial / add-on</div>
              <div className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 text-red-400 opacity-50" /> Not available</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
