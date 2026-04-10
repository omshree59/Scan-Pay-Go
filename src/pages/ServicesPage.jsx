import React from 'react';
import { Layers, BarChart3, Shield, Zap, CheckCircle, Smartphone } from 'lucide-react';
import { Reveal, TiltCard } from '../components/Shared';
import { ROICalculator, TestimonialsSection } from '../components/BusinessFeatures';

export default function ServicesPage() {
  const services = [
    {
      title: "ThinkStack OS",
      subtitle: "Enterprise Software Intelligence",
      icon: Layers,
      color: "#f59e0b",
      description: "The centralized intelligence layer behind your hardware. Sync inventory, run analytics, and manage deployed terminals globally from a single dashboard.",
      pricing: {
        baseMonthly: 2499,
        baseAnnual: 25550,
        bundleKiosk: 23000,
        bundleHandset: 24000
      },
      benefits: ["Live store analytics", "Targeted ad engine", "Over-the-air updates", "99.99% SLA Uptime"]
    },
    {
      title: "Data Insights",
      subtitle: "Buyer Heatmaps & Trends",
      icon: BarChart3,
      color: "#06b6d4",
      description: "Unlock premium analytics for retailers. Gain granular data insights on customer buying behavior to optimize store layouts and featured product promotions.",
      benefits: ["Daily transaction tracking", "Loyalty loop recognition", "Early adopter identification", "Custom reporting"]
    },
    {
      title: "Zero Waiting Time",
      subtitle: "Autonomous Checkout",
      icon: Zap,
      color: "#8b5cf6",
      description: "Customers scan products using a mobile app while shopping. Items are added to a digital cart in real-time, completely bypassing the checkout queue.",
      benefits: ["Faster shopping experience", "Real-time bill transparency", "Reduces store crowding", "Increases throughput"]
    }
  ];

  return (
    <div className="pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-20 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/25 bg-amber-500/8 text-amber-400 text-xs font-bold tracking-[0.15em] uppercase mb-6">
              <Shield className="w-4 h-4" /> Cloud Services
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 hero-title">ThinkStack OS<br/>& Services.</h1>
            <p className="text-slate-400 text-lg max-w-2xl text-center">Uniting your physical retail environment with cloud intelligence to create frictionless, data-rich experiences.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal delay={i * 150} key={i}>
                <TiltCard className="glass-card rounded-[2.5rem] p-10 h-full border border-white/[0.05] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 filter blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-40" style={{ background: service.color, transform: 'translate(30%, -30%)' }} />
                  
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: `${service.color}15`, border: `1px solid ${service.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }} className="group-hover:scale-110 transition-transform duration-300">
                    <Icon style={{ width: 32, height: 32, color: service.color }} />
                  </div>
                  
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: service.color, marginBottom: 8, display: 'block' }}>{service.subtitle}</span>
                  <h3 className="hero-title text-3xl font-black text-white mb-4">{service.title}</h3>
                  <p className={`text-slate-400 text-sm leading-relaxed ${service.pricing ? 'mb-6' : 'mb-10'}`}>{service.description}</p>
                  
                  <div className={`space-y-3 ${service.pricing ? 'mb-8' : 'mt-auto'}`}>
                    {service.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle style={{ width: 16, height: 16, color: service.color }} />
                        <span className="text-sm font-medium text-slate-300">{b}</span>
                      </div>
                    ))}
                  </div>

                  {service.pricing && (
                    <div className="mt-auto p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                      <div className="flex flex-col gap-2 pb-4 border-b border-white/5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Standalone Software</span>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-black text-amber-400">${service.pricing.baseMonthly}<span className="text-xs text-amber-500/60 font-medium">/mo</span></span>
                          <span className="text-xs font-bold text-slate-600">OR</span>
                          <span className="text-lg font-black text-amber-400">${service.pricing.baseAnnual}<span className="text-xs text-amber-500/60 font-medium">/yr</span></span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-amber-500/80 tracking-wider mb-2">Hardware Bundle (Annual)</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 flex flex-col justify-center">
                            <span className="block text-[10px] uppercase tracking-wider text-amber-500/60 font-bold mb-1">+ Kiosk Pro</span>
                            <span className="font-black text-amber-400 text-base">${service.pricing.bundleKiosk}<span className="text-[10px] font-medium text-amber-500/50">/yr</span></span>
                          </div>
                          <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 flex flex-col justify-center">
                            <span className="block text-[10px] uppercase tracking-wider text-amber-500/60 font-bold mb-1">+ Handset</span>
                            <span className="font-black text-amber-400 text-base">${service.pricing.bundleHandset}<span className="text-[10px] font-medium text-amber-500/50">/yr</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* ROI CALCULATOR */}
      <ROICalculator />

      {/* TESTIMONIALS */}
      <TestimonialsSection />
    </div>
  );
}
