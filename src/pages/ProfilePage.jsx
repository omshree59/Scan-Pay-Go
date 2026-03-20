import React from 'react';
import { User, Mail, LogOut, ShieldAlert } from 'lucide-react';
import { Reveal } from '../components/Shared';

export default function ProfilePage({ user, onLogin, onLogout }) {
  if (!user) {
    return (
      <div className="pt-40 pb-20 px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <Reveal>
          <div className="glass-card rounded-[2rem] p-12 max-w-md w-full text-center border border-white/10">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 hero-title">Sign In Required</h2>
            <p className="text-slate-400 mb-8">Please log in to your ThinkStack account to view your profile and manage credentials.</p>
            <button 
              onClick={onLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Log in with Google
            </button>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <h1 className="text-5xl font-black text-white tracking-tight mb-12 hero-title">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="glass-card rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center">
                <img src={user.photoURL} alt={user.displayName} className="w-32 h-32 rounded-full border-4 border-cyan-500/30 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]" />
                <h2 className="text-2xl font-bold text-white mb-1">{user.displayName}</h2>
                <p className="text-slate-400 text-sm mb-6 flex items-center gap-2 justify-center"><Mail className="w-4 h-4"/> {user.email}</p>
                <button 
                  onClick={onLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm w-full justify-center"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="glass-card rounded-3xl p-8 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-4 text-white text-sm">{user.displayName}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-4 text-white text-sm">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Account ID</label>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-4 text-slate-400 font-mono text-xs">{user.uid}</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-500 mb-1">Developer Sandbox</h4>
                  <p className="text-sm text-slate-400">Your account is currently running in the ThinkStack Sandbox environment. Billing and live deployments are simulated.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
