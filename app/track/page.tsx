"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<boolean | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate searching the database for 1.5 seconds
    setTimeout(() => {
      setIsSearching(false);
      setTrackingResult(true);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] pt-32 pb-24 px-6 max-w-3xl mx-auto animate-fade-in flex flex-col justify-center">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Track Asset</h1>
        <p className="text-zinc-400">Enter your secure Order ID to view real-time logistics and node routing.</p>
      </div>

      {!trackingResult ? (
        <form onSubmit={handleTrack} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Order ID</label>
              <input 
                required 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g. GBZ-A1B2C3" 
                className="w-full bg-black/50 border border-zinc-800 text-white font-mono rounded-xl py-4 px-5 focus:outline-none focus:border-blue-500 transition-colors uppercase tracking-wider" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Billing Email</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used at checkout" 
                className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-4 px-5 focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isSearching}
            className={`w-full py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 ${isSearching ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]'}`}
          >
            {isSearching ? (
              <>
                <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Querying Ledger...</span>
              </>
            ) : (
              <span>Ping Logistics Node</span>
            )}
          </button>
        </form>
      ) : (
        /* --- TRACKING RESULT UI --- */
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-fade-in">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/40">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Order Identifier</p>
              <h2 className="text-2xl font-mono font-bold text-white">{orderId || "GBZ-X9Y8Z7"}</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">In Transit</span>
            </div>
          </div>

          <div className="p-8">
            <div className="relative border-l-2 border-zinc-800 ml-3 md:ml-4 space-y-12 pb-4">
              
              {/* Step 1: Placed */}
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <h3 className="text-white font-bold mb-1">Order Confirmed</h3>
                <p className="text-xs text-zinc-500">Asset secured in database ledger.</p>
              </div>

              {/* Step 2: Processing */}
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <h3 className="text-white font-bold mb-1">Quality Check Passed</h3>
                <p className="text-xs text-zinc-500">Item packed and verified by local dispatch node.</p>
              </div>

              {/* Step 3: Transit (Current) */}
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center border-2 border-zinc-950">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
                </div>
                <h3 className="text-blue-400 font-bold mb-1">Out for Delivery</h3>
                <p className="text-xs text-zinc-400">Courier is routing to your registered coordinates.</p>
              </div>

              {/* Step 4: Delivered (Pending) */}
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-950"></div>
                <h3 className="text-zinc-600 font-bold mb-1">Delivered</h3>
                <p className="text-xs text-zinc-600">Pending final handover.</p>
              </div>

            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-black/40 text-center">
             <button 
                onClick={() => setTrackingResult(null)}
                className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
             >
               Track Another Order
             </button>
          </div>
        </div>
      )}

    </div>
  );
}