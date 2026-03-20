import React from 'react';
import { PackageOpen, ArrowLeft } from 'lucide-react';
import { Reveal } from '../components/Shared';

export default function OrderHistoryPage({ setCurrentPage, orders = [] }) {
  return (
    <div className="pt-40 pb-20 px-4 min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-12 hero-title">Order History</h1>
          
          {orders.length === 0 ? (
            <div className="glass-card rounded-[2rem] p-16 border border-white/5 flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/20">
                <PackageOpen className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No Orders Yet</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-sm">You haven't placed any hardware or software orders on your ThinkStack account yet.</p>
              <button 
                onClick={() => setCurrentPage('products')}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="glass-card rounded-[2rem] p-8 border border-white/5 relative group">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-white text-lg">{order.id}</span>
                        <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{order.status}</span>
                      </div>
                      <p className="text-sm text-slate-400">Placed on {order.date}</p>
                    </div>
                    <div className="text-right border-t border-white/5 md:border-none pt-4 md:pt-0">
                      <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                      <p className="text-2xl font-black text-white">${order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Items Ordered</h4>
                    {order.items.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.accent}15`, border: `1px solid ${item.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {Icon ? <Icon style={{ width: 18, height: 18, color: item.accent }} /> : <PackageOpen style={{ width: 18, height: 18, color: item.accent }} />}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-white text-sm">{item.name}</h5>
                            <p className="text-xs text-slate-400">{item.billing}</p>
                          </div>
                          <span className="font-bold text-white text-lg sm:text-base">${item.price.toLocaleString()}</span>
                        </div>
                      )
                    })}
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
