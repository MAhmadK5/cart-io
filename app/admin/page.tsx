"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

// ✨ IMPORT YOUR NEW MODULES ✨
import OrdersModule from '../../components/admin/OrdersModule';
import InventoryModule from '../../components/admin/InventoryModule';
import ReviewsModule from '../../components/admin/ReviewsModule';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeModule, setActiveModule] = useState<'Orders' | 'Inventory' | 'Reviews'>('Orders');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Invalid Admin Credentials.");
    else setIsAuthenticated(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 animate-fade-in bg-zinc-950">
        <div className="w-full max-w-lg bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-12 shadow-[0_0_50px_rgba(147,51,234,0.15)]">
          <div className="flex justify-center mb-8">
             <img src="/cart-io-logo.png" alt="CART IO" className="h-16 w-auto object-contain brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-black text-white text-center tracking-[0.2em] uppercase mb-4">Admin Portal</h1>
          <form onSubmit={handleLogin} className="space-y-8 mt-8">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email" className="w-full bg-black/50 border-b border-white/20 text-white text-lg py-4 focus:outline-none focus:border-purple-500 transition-all rounded-none" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/50 border-b border-white/20 text-white text-lg py-4 focus:outline-none focus:border-purple-500 transition-all rounded-none" />
            {authError && <p className="text-red-500 text-xs text-center font-bold uppercase tracking-[0.2em]">{authError}</p>}
            <button type="submit" className="w-full py-6 bg-white text-black font-black text-sm uppercase tracking-[0.3em] rounded-none hover:bg-purple-600 hover:text-white transition-all">Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="flex pt-24 md:pt-32 max-w-[1600px] mx-auto">
        
        {/* ✨ SIDEBAR ✨ */}
        <div className="w-80 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 hidden lg:flex flex-col h-[calc(100vh-8rem)] sticky top-24 shadow-2xl rounded-3xl ml-6 z-20 overflow-hidden">
          <div className="p-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Portal Status</p>
                <p className="text-sm text-white font-black uppercase tracking-wider">Online & Secure</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            <button onClick={() => setActiveModule('Orders')} className={`w-full text-left px-6 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${activeModule === 'Orders' ? 'bg-purple-600/10 border border-purple-500/30 text-purple-400' : 'text-zinc-500 hover:text-white border border-transparent'}`}>Orders</button>
            <button onClick={() => setActiveModule('Inventory')} className={`w-full text-left px-6 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${activeModule === 'Inventory' ? 'bg-purple-600/10 border border-purple-500/30 text-purple-400' : 'text-zinc-500 hover:text-white border border-transparent'}`}>Inventory</button>
            <button onClick={() => setActiveModule('Reviews')} className={`w-full text-left px-6 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${activeModule === 'Reviews' ? 'bg-purple-600/10 border border-purple-500/30 text-purple-400' : 'text-zinc-500 hover:text-white border border-transparent'}`}>Reviews</button>
            <Link href="/admin/chat" className="block w-full px-6 py-5 text-zinc-500 hover:text-white font-bold text-sm uppercase tracking-widest transition-all">Customer Chat</Link>
          </div>

          <div className="p-8 pt-4 border-t border-white/5 mt-auto">
            <button onClick={handleSignOut} className="w-full py-5 text-zinc-400 text-xs font-black uppercase tracking-[0.2em] border border-zinc-700 rounded-2xl hover:bg-white hover:text-black transition-all">Sign Out</button>
          </div>
        </div>

        {/* ✨ DYNAMIC MODULE LOADER ✨ */}
{/* ✨ DYNAMIC MODULE LOADER ✨ */}
<div className="flex-1 p-6 md:p-8 lg:p-12">
          {activeModule === 'Orders' && <OrdersModule />}
          {activeModule === 'Inventory' && <InventoryModule />}
          {activeModule === 'Reviews' && <ReviewsModule />}
        </div>

      </div>
    </div>
  );
}