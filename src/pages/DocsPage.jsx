import React from 'react';
import { Terminal, Shield, FileJson, Code } from 'lucide-react';
import { Reveal } from '../components/Shared';

export default function DocsPage() {
  return (
    <div className="pt-40 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-bold tracking-wider uppercase mb-6 drop-shadow-md">
              <Code className="w-4 h-4 text-blue-400" /> Developer First
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 hero-title">Integration & APIs</h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              We provide full retail integration support. Whether you use traditional POS systems or modern cloud databases, the ThinkStack OS API syncs your entire inventory in minutes.
            </p>
            
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl flex gap-4 items-start border border-white/5">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                  <Terminal className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">RESTful & GraphQL APIs</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Connect your existing ERP instantly with our thoroughly documented endpoints. Webhooks supported for real-time inventory updates.</p>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl flex gap-4 items-start border border-white/5">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure Payment Gateways</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">PCI-DSS compliant routing. We handle the payment gateway complexity so you can focus on building the retail experience.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        
        <div className="lg:w-1/2 w-full pt-4">
          <Reveal delay={200}>
            <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-[#0d1117] shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
              <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <FileJson className="w-3 h-3" /> sync_inventory.js
                </div>
              </div>
              <div className="p-8 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                <pre><code>
<span className="text-purple-400">import</span> {'{ ThinkStack }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@thinkstack/os-sdk'</span>;{'\n\n'}
<span className="text-slate-500">// Initialize client with store credentials</span>{'\n'}
<span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> <span className="text-amber-300">ThinkStack</span>({'{'}{'\n'}
{'  '}apiKey: process.env.<span className="text-blue-300">THINKSTACK_API_KEY</span>,{'\n'}
{'  '}storeId: <span className="text-green-400">'STR_9841_NYC'</span>{'\n'}
{'}'});{'\n\n'}
<span className="text-slate-500">// Real-time inventory sync hook</span>{'\n'}
client.inventory.<span className="text-blue-300">onUpdate</span>(<span className="text-purple-400">async</span> (payload) =&gt; {'{'}{'\n'}
{'  '}<span className="text-purple-400">try</span> {'{'}{'\n'}
{'    '}<span className="text-purple-400">await</span> database.<span className="text-blue-300">sync</span>(payload.items);{'\n'}
{'    '}console.<span className="text-blue-300">log</span>(<span className="text-green-400">`Synced ${'{payload.items.length}'} products`</span>);{'\n'}
{'  '}{'}'} <span className="text-purple-400">catch</span> (err) {'{'}{'\n'}
{'    '}console.<span className="text-blue-300">error</span>(<span className="text-green-400">'Sync failed:'</span>, err);{'\n'}
{'  '}{'}'}{'\n'}
{'}'});<span className="cursor-blink bg-cyan-400 text-transparent">_</span>
                </code></pre>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
