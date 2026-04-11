import React, { useState, useEffect } from 'react';
import { Building2, Server, Smartphone, LineChart, ChevronRight, CheckCircle, Download, ArrowLeft, Zap, MapPin, User, Mail, Phone, Loader2 } from 'lucide-react';
import { Reveal } from '../components/Shared';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PRODUCTS = [
  { id: 'kiosk', name: 'ScanPay Kiosk Pro', price: 1299, icon: Server, color: '#06b6d4', desc: 'Freestanding self-checkout terminal' },
  { id: 'handheld', name: 'ScanPay Handheld (5-Pack)', price: 899, icon: Smartphone, color: '#8b5cf6', desc: 'Cart-mounted mobile scanners' },
  { id: 'os', name: 'ThinkStack OS (Annual)', price: 25550, icon: LineChart, color: '#f59e0b', desc: 'AI analytics + management layer' },
];

function StepIndicator({ step }) {
  const steps = ['Locations', 'Products', 'Contact', 'Your Quote'];
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
              i < step ? 'bg-cyan-500 text-black' :
              i === step ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' :
              'bg-white/5 border border-white/10 text-slate-500'
            }`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] font-bold tracking-wider uppercase ${i <= step ? 'text-cyan-400' : 'text-slate-600'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-[2px] w-12 mb-4 rounded-full transition-all duration-500 ${i < step ? 'bg-cyan-500' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function QuotePage({ setCurrentPage }) {
  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState(['kiosk', 'os']);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' });
  const [generating, setGenerating] = useState(false);
  const [quoteRef, setQuoteRef] = useState('');

  // Generate a random stable quote reference once we hit the final step
  useEffect(() => {
    if (step === 3 && !quoteRef) {
      setQuoteRef(`QT-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  }, [step, quoteRef]);

  const toggleProduct = (id) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const selectedDetails = PRODUCTS.filter(p => selectedProducts.includes(p.id));
  const hardwareTotal = selectedDetails.filter(p => p.id !== 'os').reduce((t, p) => t + p.price * locations, 0);
  const softwareTotal = selectedDetails.find(p => p.id === 'os') ? 25550 : 0;
  const grandTotal = hardwareTotal + softwareTotal;

  const handleNext = () => {
    if (step === 2) {
      setGenerating(true);
      setTimeout(() => { setGenerating(false); setStep(3); }, 2200);
    } else {
      setStep(s => s + 1);
    }
  };

  const canNext = () => {
    if (step === 0) return locations >= 1;
    if (step === 1) return selectedProducts.length > 0;
    if (step === 2) return form.name && form.company && form.email;
    return true;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(28);
    doc.setTextColor(6, 182, 212); // ScanPay cyan
    doc.setFont("helvetica", "bold");
    doc.text('ScanPay', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.text('ThinkStack OS & Retail Automation', 14, 30);
    
    // Quote Ref Panel
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.text('OFFICIAL QUOTE', 140, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Reference: ${quoteRef || 'QT-DRAFT'}`, 140, 28);
    doc.text(`Date: ${dateStr}`, 140, 34);
    
    // Billed To Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text('BILLED TO:', 14, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(form.name, 14, 56);
    doc.text(`${form.company} (${locations} location${locations !== 1 ? 's' : ''})`, 14, 62);
    doc.text(form.email, 14, 68);
    if (form.phone) doc.text(form.phone, 14, 74);
    
    // Table 
    const tableBody = selectedDetails.map(p => {
      const qty = p.id === 'os' ? 1 : locations;
      const total = p.price * qty;
      const desc = p.id === 'os' ? 'Annual enterprise license' : `Cart-equipped / freestanding units`;
      return [
        p.name,
        desc,
        `$${p.price.toLocaleString()}`,
        qty.toString(),
        `$${total.toLocaleString()}`
      ];
    });

    // Draw Table
    autoTable(doc, {
      startY: 85,
      head: [['Product / Service', 'Description', 'Unit Price', 'Qty', 'Row Total']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'center' },
        4: { halign: 'right', fontStyle: 'bold' },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    
    // Grand Total
    const finalY = doc.lastAutoTable?.finalY || 85;
    
    // Total Box
    doc.setFillColor(240, 249, 255); // VERY light cyan
    doc.setDrawColor(6, 182, 212);
    doc.roundedRect(120, finalY + 10, 75, 20, 2, 2, 'FD');
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text('Estimated Total:', 125, finalY + 23);
    
    doc.setFontSize(14);
    doc.setTextColor(6, 182, 212);
    doc.text(`$${grandTotal.toLocaleString()}`, 190, finalY + 23, { align: 'right' });
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text('Thank you for choosing ScanPay.', 14, finalY + 45);
    doc.text('This quote is valid for 30 days. For questions, contact enterprise@scanpay.io', 14, finalY + 50);
    
    // Save
    doc.save(`ScanPay_Quote_${form.company.replace(/[^a-zA-Z0-9]/g, '_')}_${quoteRef}.pdf`);
  };

  return (
    <div className="pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-cyan-400 text-xs font-bold tracking-[0.15em] uppercase mb-6">
              <Zap className="w-3 h-3" /> Enterprise Sales
            </div>
            <h1 className="hero-title text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
              Request a<br /><span className="shimmer-text">Custom Quote</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Tell us about your operation and we'll generate a tailored pricing plan in seconds.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/[0.06] mt-10">
            <StepIndicator step={step} />

            {/* STEP 0: Locations */}
            {step === 0 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="hero-title text-2xl font-black text-white mb-2">How many store locations?</h2>
                <p className="text-slate-400 text-sm mb-10">Hardware pricing scales per-location.</p>
                <div className="flex items-center justify-center gap-6">
                  <button onClick={() => setLocations(l => Math.max(1, l - 1))}
                    className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-2xl font-black transition-all hover:scale-105">−</button>
                  <div className="flex flex-col items-center">
                    <span className="hero-title text-7xl font-black text-white" style={{ minWidth: 80, display: 'inline-block', textAlign: 'center' }}>{locations}</span>
                    <span className="text-slate-500 text-sm mt-1">location{locations !== 1 ? 's' : ''}</span>
                  </div>
                  <button onClick={() => setLocations(l => l + 1)}
                    className="w-14 h-14 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-2xl font-black transition-all hover:scale-105">+</button>
                </div>
                <div className="flex gap-3 justify-center mt-8">
                  {[1, 5, 10, 25, 50].map(n => (
                    <button key={n} onClick={() => setLocations(n)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${locations === n ? 'bg-cyan-500 text-black' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'}`}>
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Products */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="hero-title text-2xl font-black text-white mb-2">Which products do you need?</h2>
                  <p className="text-slate-400 text-sm">Select all that apply. Mix and match freely.</p>
                </div>
                <div className="space-y-4">
                  {PRODUCTS.map(product => {
                    const Icon = product.icon;
                    const selected = selectedProducts.includes(product.id);
                    return (
                      <button key={product.id} onClick={() => toggleProduct(product.id)}
                        className={`w-full flex items-center gap-5 p-5 rounded-2xl border transition-all duration-200 text-left ${
                          selected ? 'border-opacity-60 bg-opacity-10' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                        style={{
                          borderColor: selected ? product.color + '60' : undefined,
                          background: selected ? product.color + '10' : undefined,
                          boxShadow: selected ? `0 0 20px ${product.color}15` : undefined,
                        }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: product.color + '15', border: `1px solid ${product.color}30` }}>
                          <Icon className="w-6 h-6" style={{ color: product.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{product.name}</div>
                          <div className="text-sm text-slate-400">{product.desc}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-white">${product.price.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">{product.id === 'os' ? 'per year' : 'per unit'}</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selected ? 'bg-green-500 border-green-500' : 'border-white/20'
                        }`}>
                          {selected && <CheckCircle className="w-4 h-4 text-black" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Contact */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="hero-title text-2xl font-black text-white mb-2">Where should we send the quote?</h2>
                  <p className="text-slate-400 text-sm">No spam. Just your personalised pricing breakdown.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'name', label: 'Full Name *', placeholder: 'Alex Johnson', icon: User },
                    { key: 'company', label: 'Company / Chain Name *', placeholder: 'Retail Corp Ltd.', icon: Building2 },
                    { key: 'email', label: 'Work Email *', placeholder: 'alex@retailcorp.com', icon: Mail },
                    { key: 'phone', label: 'Phone (optional)', placeholder: '+1 (555) 000-0000', icon: Phone },
                  ].map(({ key, label, placeholder, icon: Icon }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Quote Generated */}
            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4" style={{ boxShadow: '0 0 30px rgba(34,197,94,0.2)' }}>
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="hero-title text-2xl font-black text-white mb-1">Your quote is ready, {form.name.split(' ')[0]}!</h2>
                  <p className="text-slate-400 text-sm">Sent to {form.email} · Reference <span className="text-cyan-400 font-mono">{quoteRef}</span></p>
                </div>

                <div className="bg-[#080c18] border border-white/[0.06] rounded-2xl overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">Quote Summary — {locations} Location{locations !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-slate-500">{form.company}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedDetails.map(p => {
                      const qty = p.id === 'os' ? 1 : locations;
                      const total = p.price * qty;
                      return (
                        <div key={p.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.color + '15' }}>
                            <p.icon className="w-4 h-4" style={{ color: p.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-white">{p.name}</div>
                            <div className="text-xs text-slate-500">{qty > 1 ? `${qty} × $${p.price.toLocaleString()}` : p.id === 'os' ? 'Annual / all locations' : ''}</div>
                          </div>
                          <div className="font-black text-white">${total.toLocaleString()}</div>
                        </div>
                      );
                    })}
                    <div className="border-t border-white/[0.06] pt-4 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Estimated Total</span>
                      <span className="hero-title text-3xl font-black text-white">${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button onClick={() => setCurrentPage('home')}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                    Back to Home <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            {step < 3 && (
              <div className="flex gap-3 mt-10 pt-8 border-t border-white/[0.06]">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button onClick={handleNext} disabled={!canNext() || generating}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: canNext() ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.05)' }}>
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating Quote...</>
                  ) : step === 2 ? (
                    <>Generate My Quote <Zap className="w-4 h-4" /></>
                  ) : (
                    <>Continue <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
