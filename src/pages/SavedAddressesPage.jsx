import React, { useState } from 'react';
import { MapPin, ArrowLeft, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { Reveal } from '../components/Shared';

export default function SavedAddressesPage({ setCurrentPage, savedAddresses = [], setSavedAddresses }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', address: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address) return;
    setSavedAddresses(prev => [...prev, { id: Date.now(), name: newAddress.name, address: newAddress.address, isDefault: prev.length === 0 }]);
    setNewAddress({ name: '', address: '' });
    setIsAdding(false);
  };

  const removeAddress = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefault = (id) => {
    setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="pt-40 pb-20 px-4 min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group text-sm font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        
        <Reveal>
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-12 gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight hero-title">Saved Addresses</h1>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)} 
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm z-50 relative pointer-events-auto w-full sm:w-auto shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:scale-105"
              >
                <Plus className="w-4 h-4 text-black" /> Add New
              </button>
            )}
          </div>
          
          {isAdding ? (
            <div className="glass-card rounded-[2rem] p-8 border border-white/5 relative mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Add New Address</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <input required type="text" placeholder="Location Name (e.g. Headquarters)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                <textarea required placeholder="Full Street Address" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold transition-all text-sm w-full sm:w-auto">Cancel</button>
                  <button type="submit" className="flex-1 bg-cyan-500 text-black font-bold py-3 rounded-xl transition-all text-sm hover:bg-cyan-400">Save Address</button>
                </div>
              </form>
            </div>
          ) : savedAddresses.length === 0 ? (
            <div className="glass-card rounded-[2rem] p-16 border border-white/5 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                <MapPin className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No Addresses Found</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-sm">Add a shipping or billing address to speed up your hardware provisioning checkout.</p>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2" onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50 pointer-events-auto">
              {savedAddresses.map(addr => (
                <div key={addr.id} className="glass-card rounded-2xl p-6 border border-white/5 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-cyan-500/10"><MapPin className="w-5 h-5 text-cyan-400" /></div>
                      <h4 className="font-bold text-white">{addr.name}</h4>
                    </div>
                    {addr.isDefault && <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Default</span>}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{addr.address}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
                    {!addr.isDefault ? (
                      <button onClick={() => setDefault(addr.id)} className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors">Set as Default</button>
                    ) : <span className="text-xs font-bold text-slate-600">Primary</span>}
                    <button onClick={() => removeAddress(addr.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
