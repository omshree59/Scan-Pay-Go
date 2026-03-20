import React from 'react';
import { Server, Smartphone, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { Reveal, InteractiveHeroModel, HandheldSVG, KioskSVG } from '../components/Shared';

export default function ProductsPage({ addToCart, addedId }) {
  const products = [
    { 
      id: 1, name: "ScanPay Kiosk Pro", type: "Hardware Base Station", price: 1299, billing: "One-time", 
      description: "Freestanding self-checkout terminal with an edge-to-edge 15\" display, AI weight-verification scale, and lightning-fast payment gateway.", 
      features: ["Sub-second processing", "Apple Pay / Google Pay", "Anti-theft CV vision", "Integrated Receipt Printer"], 
      icon: Server, 
      customGraphic: <KioskSVG />, 
      accent: "#06b6d4", accentDark: "#0e7490", glow: "rgba(6,182,212,0.15)", badge: "Most Popular", 
    },
    { 
      id: 2, name: "ScanPay Handheld", type: "Mobile Scanner (5-Pack)", price: 899, billing: "One-time", 
      description: "Military-grade mobile scanners that dock directly into shopping carts for the ultimate in-aisle customer experience.", 
      features: ["14-hour battery life", "Real-time cart sync", "Drop-resistant shell", "Magnetic Snap Dock"], 
      icon: Smartphone, 
      customGraphic: <HandheldSVG />, 
      accent: "#8b5cf6", accentDark: "#7c3aed", glow: "rgba(139,92,246,0.15)", badge: null, 
    }
  ];

  return (
    <div className="pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-cyan-400 text-xs font-bold tracking-[0.15em] uppercase mb-6">
              <Zap className="w-4 h-4" /> Hardware Ecosystem
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 hero-title">Next-Gen<br/>Retail Touchpoints.</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Physical hardware designed to integrate silently into your store environment, with 3D-accelerated interfaces and robust durability.</p>
          </div>
        </Reveal>

        <div className="space-y-32">
          {products.map((product, idx) => {
            const isAdded = addedId === product.id;
            const isEven = idx % 2 === 0;
            return (
              <Reveal delay={100} key={product.id}>
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                  
                  {/* Interactive 3D Model Side */}
                  <div className="w-full lg:w-1/2">
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5 relative bg-[#06060c] overflow-visible">
                       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', borderRadius: '50%', background: product.glow, filter: 'blur(100px)', pointerEvents: 'none', opacity: 0.8 }} />
                       <InteractiveHeroModel rotateLimit={20}>
                         {product.customGraphic}
                       </InteractiveHeroModel>
                    </div>
                  </div>

                  {/* Details Side */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: product.accent, mb: 4, display: 'block' }}>{product.type}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 hero-title leading-tight">{product.name}</h2>
                    <div className="flex items-end gap-3 mb-6">
                      <span className="text-3xl font-black text-white">${product.price.toLocaleString()}</span>
                      <span className="text-sm font-semibold text-slate-500 mb-1">{product.billing}</span>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10">{product.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                      {product.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
                          <CheckCircle style={{ width: 18, height: 18, color: product.accent, flexShrink: 0 }} />
                          <span className="text-sm font-medium text-slate-300">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => addToCart(product)} 
                      className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 text-sm ${isAdded ? 'added-flash' : 'hover:-translate-y-1 hover:shadow-lg'}`}
                      style={{ 
                        background: isAdded ? `${product.accent}33` : `linear-gradient(135deg, ${product.accent}, ${product.accentDark})`, 
                        color: isAdded ? product.accent : '#000', 
                        border: isAdded ? `1px solid ${product.accent}50` : 'none',
                        boxShadow: isAdded ? 'none' : `0 10px 30px ${product.glow}` 
                      }}
                    >
                      {isAdded ? '✓ Added to Order' : <>Add {product.name} to Configurator <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
