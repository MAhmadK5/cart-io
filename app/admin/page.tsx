"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ revenue: 0, pending: 0, total: 0, aov: 0 });
  
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];
  
  // ✨ NEW: State for the Sidebar Dropdown ✨
  const [isOrdersMenuOpen, setIsOrdersMenuOpen] = useState(true);

  const MASTER_PIN = "2026"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === MASTER_PIN) {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setError("CRITICAL: INVALID AUTHORIZATION");
      setPinCode('');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const formattedData = data.map(o => ({
        ...o,
        status: o.status === 'Shipped' ? 'Dispatched' : (o.status || 'Processing')
      }));
      
      setOrders(formattedData);
      
      const validOrders = formattedData.filter(o => o.status !== 'Cancelled');
      const totalRev = validOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const pendingCount = formattedData.filter(o => o.status === 'Processing').length;
      const avgOrderVal = validOrders.length > 0 ? Math.round(totalRev / validOrders.length) : 0;
      
      setMetrics({ revenue: totalRev, pending: pendingCount, total: formattedData.length, aov: avgOrderVal });
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    setMetrics(prev => ({
      ...prev,
      pending: newStatus === 'Processing' ? prev.pending + 1 : prev.pending - 1
    }));
    
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: "radial-gradient(#111 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-sm bg-zinc-950/90 backdrop-blur-3xl border border-blue-500/20 rounded-3xl p-10 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-950/30 border border-blue-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] relative">
              <span className="absolute inset-0 rounded-full border border-blue-500 animate-ping opacity-20"></span>
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white text-center tracking-[0.2em] uppercase mb-2">Nexus Core</h1>
          <p className="text-blue-400 text-center text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,1)]"></span>
            Encrypted Gateway
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="ACCESS CODE"
                className="w-full bg-black border border-zinc-800 text-center text-xl tracking-[0.5em] text-blue-400 placeholder:text-zinc-700 rounded-xl py-4 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all font-mono"
                maxLength={4}
              />
            </div>
            {error && <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-[0.2em] animate-pulse">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              Initialize
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex pt-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* --- MASTER SIDEBAR --- */}
      <div className="w-72 bg-black/80 backdrop-blur-2xl border-r border-white/5 flex flex-col hidden md:flex h-[calc(100vh-5rem)] sticky top-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)] animate-pulse"></div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Status</p>
              <p className="text-xs text-white font-black uppercase tracking-wider">Online & Secure</p>
            </div>
          </div>
          
          <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Core Modules</h2>
          <nav className="space-y-3">
            
            {/* ✨ NEW: SIDEBAR DROPDOWN FOR ORDERS ✨ */}
            <div>
              <button 
                onClick={() => setIsOrdersMenuOpen(!isOrdersMenuOpen)} 
                className="w-full flex items-center justify-between px-5 py-4 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] group"
              >
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  Orders Desk
                </div>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isOrdersMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* Dropdown Options */}
              <div className={`overflow-hidden transition-all duration-300 ${isOrdersMenuOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-1 pl-[3.2rem] pr-2 border-l border-white/5 ml-7 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-left w-full px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                        activeTab === tab
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent'
                      }`}
                    >
                      {tab}
                      <span className={`px-2 py-0.5 rounded text-[9px] ${activeTab === tab ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-white'}`}>
                        {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/admin/chat" className="flex items-center gap-4 px-5 py-4 bg-transparent border border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:border-zinc-800 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all group mt-2">
              <svg className="w-5 h-5 group-hover:text-green-400 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Live Comms
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-8">
          <button onClick={() => setIsAuthenticated(false)} className="w-full py-4 bg-black border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center gap-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sever Connection
          </button>
        </div>
      </div>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="flex-1 p-6 md:p-12 overflow-x-hidden relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Order Overview</h1>
            <p className="text-zinc-400 mt-2 text-sm font-mono tracking-wide">
              {activeTab === 'All' ? 'Showing complete database.' : `Filtered by: ${activeTab}`}
            </p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Sync Data
          </button>
        </div>

        {/* ULTRA FINANCIAL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 relative z-10">Gross Revenue (Net)</p>
            <p className="text-3xl font-black text-white relative z-10 tracking-tight">Rs. {metrics.revenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 relative z-10">Average Order Value</p>
            <p className="text-3xl font-black text-white relative z-10 tracking-tight">Rs. {metrics.aov.toLocaleString()}</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 relative z-10">Total Invoices</p>
            <p className="text-3xl font-black text-white relative z-10 tracking-tight">{metrics.total}</p>
          </div>

          <div className="bg-zinc-950 border border-orange-500/20 p-6 rounded-3xl shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest mb-2 relative z-10">Pending Action</p>
            <p className="text-3xl font-black text-orange-400 relative z-10 tracking-tight flex items-center gap-3">
              {metrics.pending}
              {metrics.pending > 0 && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>}
            </p>
          </div>
        </div>

        {/* ✨ MOBILE ONLY TABS (Hidden on Desktop) ✨ */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-8 pb-2 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
              }`}
            >
              {tab} 
              <span className="ml-2 text-[10px] opacity-70">
                ({tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* ULTRA ORDERS LIST */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5"></div>)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-20 text-center shadow-2xl">
            <svg className="w-12 h-12 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            <p className="text-zinc-500 font-black uppercase tracking-[0.2em]">No {activeTab !== 'All' ? activeTab : ''} Orders Found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-[2rem] p-6 lg:p-8 flex flex-col xl:flex-row gap-8 shadow-2xl relative overflow-hidden transition-colors">
                
                {/* Dynamic Status Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors ${
                  order.status === 'Processing' ? 'bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,1)]' : 
                  order.status === 'Dispatched' ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,1)]' :
                  order.status === 'Delivered' ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' :
                  'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                }`}></div>

                {/* Left Col: Customer Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono font-black text-black bg-zinc-300 px-3 py-1 rounded-md tracking-widest uppercase">ID: {order.order_id}</span>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl font-black mb-1 tracking-tight ${order.status === 'Cancelled' ? 'text-zinc-500 line-through' : 'text-white'}`}>{order.customer_name}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-mono">{order.shipping_address}, {order.city} {order.postal_code}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a href={`mailto:${order.customer_email}`} className="px-4 py-2.5 bg-black border border-zinc-800 hover:border-white/30 rounded-lg text-[10px] font-black text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                      <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      Email Target
                    </a>
                    <a href={`https://wa.me/${order.customer_phone}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 bg-[#0b141a] border border-[#25D366]/30 hover:bg-[#25D366]/20 hover:border-[#25D366] rounded-lg text-[10px] font-black text-[#25D366] uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.1)]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      Comms
                    </a>
                  </div>
                </div>

                {/* Middle Col: Items */}
                <div className="xl:w-1/3 bg-black rounded-2xl p-5 border border-zinc-800">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Manifest Ledger</p>
                  <div className="space-y-3 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className={`flex gap-3 items-center ${order.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                        <div className="w-10 h-10 rounded bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                        </div>
                        <p className="text-sm text-zinc-300 leading-tight">
                          <span className="font-bold text-white mr-2">{item.quantity}x</span> {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Financials & Dynamic Status Dropdown */}
                <div className="xl:w-56 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/5 pt-6 xl:pt-0 xl:pl-8">
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Value</p>
                    <p className={`text-3xl font-black mb-2 tracking-tight ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>
                      Rs. {order.total_amount.toLocaleString()}
                    </p>
                    <p className="inline-block px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card / Stripe'}
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Network Status</p>
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`w-full text-[10px] font-black uppercase tracking-[0.2em] rounded-xl py-4 px-3 outline-none cursor-pointer appearance-none text-center transition-all ${
                        order.status === 'Processing' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/50 hover:bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' :
                        order.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/50 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]' :
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                        'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      }`}
                    >
                      <option value="Processing" className="bg-zinc-900 text-white">Processing</option>
                      <option value="Dispatched" className="bg-zinc-900 text-white">Dispatched</option>
                      <option value="Delivered" className="bg-zinc-900 text-white">Delivered</option>
                      <option value="Cancelled" className="bg-zinc-900 text-white">Cancelled</option>
                    </select>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}