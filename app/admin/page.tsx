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
  
  const [isOrdersMenuOpen, setIsOrdersMenuOpen] = useState(true);

  const MASTER_PIN = "2026"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === MASTER_PIN) {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setError("Invalid Authorization PIN");
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

  // ✨ AUTOMATED MESSAGE GENERATOR ✨
  const generateMessageLink = (order: any, isEmail: boolean) => {
    const name = order.customer_name;
    const id = order.order_id;
    const total = order.total_amount.toLocaleString();
    const payment = order.payment_method === 'cod' ? 'Cash on Delivery' : 'Pre-paid Card';

    let subject = "";
    let text = "";

    switch (order.status) {
      case 'Processing':
        subject = `Order Received - CART IO (${id})`;
        text = `Hello ${name}!\n\nThis is CART IO. We have received your order ${id} for Rs. ${total}. It is currently being processed and will be prepared for dispatch shortly.\n\nThank you for choosing ultimate luxury!`;
        break;
      case 'Dispatched':
        subject = `Order Dispatched - CART IO (${id})`;
        text = `Hello ${name}!\n\nGreat news from CART IO! Your order ${id} has been dispatched and is on its way to you.\n\nTotal Amount: Rs. ${total}\nPayment Method: ${payment}\n\nGet ready to elevate your lifestyle!`;
        break;
      case 'Delivered':
        subject = `Order Delivered - CART IO (${id})`;
        text = `Hello ${name}!\n\nYour CART IO order ${id} has been successfully delivered.\n\nWe hope you enjoy your premium assets. We would love to hear your feedback!\n\nBest regards,\nThe CART IO Team`;
        break;
      case 'Cancelled':
        subject = `Order Cancelled - CART IO (${id})`;
        text = `Hello ${name}.\n\nWe regret to inform you that your CART IO order ${id} has been cancelled.\n\nIf you have any questions or believe this was an error, please reply to this message to speak with our support team.\n\nRegards,\nCART IO`;
        break;
      default:
        subject = `Order Update - CART IO (${id})`;
        text = `Hello ${name}!\n\nWe are reaching out regarding your CART IO order ${id}.\n\nPlease let us know if you need any assistance.`;
    }

    if (isEmail) {
      return `mailto:${order.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    } else {
      // Clean phone number to ensure WhatsApp link works properly
      const cleanPhone = order.customer_phone.replace(/\D/g, '');
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    }
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-40"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>
        
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-12 md:p-16 shadow-[0_0_50px_rgba(147,51,234,0.15)]">
            
            <div className="flex justify-center mb-10">
              <img src="/cart-io-logo.png" alt="CART IO" className="h-16 md:h-20 w-auto object-contain brightness-0 invert" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white text-center tracking-[0.2em] uppercase mb-4">Admin Portal</h1>
            <p className="text-purple-400 text-center text-xs md:text-sm font-bold uppercase tracking-widest mb-10 flex items-center justify-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.8)]"></span>
              Secure Authorization Required
            </p>
            
            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <input 
                  type="password" 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="ENTER PIN"
                  className="w-full bg-black/50 border-b-2 border-white/20 text-center text-3xl md:text-4xl tracking-[0.5em] text-white placeholder:text-zinc-700 py-6 focus:outline-none focus:border-purple-500 transition-all font-mono rounded-none"
                  maxLength={4}
                />
              </div>
              {error && <p className="text-red-500 text-xs md:text-sm text-center font-bold uppercase tracking-[0.2em] animate-pulse">{error}</p>}
              <button type="submit" className="w-full py-6 bg-white text-black font-black text-sm md:text-base uppercase tracking-[0.3em] rounded-none hover:bg-purple-600 hover:text-white transition-all duration-300">
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      <div className="min-h-screen flex pt-24 md:pt-32 relative z-10 max-w-[1600px] mx-auto">
        
        {/* --- MASTER SIDEBAR --- */}
        <div className="w-80 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 flex flex-col hidden lg:flex h-[calc(100vh-8rem)] sticky top-24 shadow-2xl rounded-3xl ml-6 z-20">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-8">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Portal Status</p>
                <p className="text-sm text-white font-black uppercase tracking-wider">Online & Secure</p>
              </div>
            </div>
            
            <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Navigation</h2>
            <nav className="space-y-4">
              
              <div>
                <button 
                  onClick={() => setIsOrdersMenuOpen(!isOrdersMenuOpen)} 
                  className="w-full flex items-center justify-between px-6 py-5 bg-purple-600/10 border border-purple-500/30 text-purple-400 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(147,51,234,0.1)] group"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    Orders
                  </div>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${isOrdersMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${isOrdersMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col gap-2 pl-12 pr-2 border-l border-white/10 ml-8 space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-left w-full px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                          activeTab === tab
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                        }`}
                      >
                        {tab}
                        <span className={`px-2.5 py-1 rounded-md text-[10px] ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-white'}`}>
                          {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/admin/chat" className="flex items-center gap-4 px-6 py-5 bg-transparent border border-transparent text-zinc-500 hover:bg-white/5 hover:border-white/10 hover:text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group mt-2">
                <svg className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                Customer Chat
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-8 pt-0">
            <button onClick={() => setIsAuthenticated(false)} className="w-full py-5 bg-transparent border border-zinc-700 text-zinc-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* --- MAIN DASHBOARD CONTENT --- */}
        <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Order Overview</h1>
              <p className="text-zinc-400 mt-2 text-base md:text-lg font-light tracking-wide">
                {activeTab === 'All' ? 'Showing all incoming orders.' : `Currently viewing: ${activeTab}`}
              </p>
            </div>
            <button onClick={fetchOrders} className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-xs md:text-sm font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl w-fit">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Refresh Data
            </button>
          </div>

          {/* ULTRA FINANCIAL METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
              <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Total Revenue</p>
              <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">Rs. {metrics.revenue.toLocaleString()}</p>
            </div>
            
            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Average Order Value</p>
              <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">Rs. {metrics.aov.toLocaleString()}</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:border-white/30 transition-colors">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Total Orders</p>
              <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">{metrics.total}</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-md border border-red-500/20 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
              <p className="text-xs md:text-sm font-black text-red-400 uppercase tracking-widest mb-3 relative z-10">Action Required</p>
              <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter flex items-center gap-4">
                {metrics.pending}
                {metrics.pending > 0 && <span className="relative flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span></span>}
              </p>
            </div>
          </div>

          {/* MOBILE ONLY TABS */}
          <div className="lg:hidden flex overflow-x-auto gap-3 mb-10 pb-4 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-zinc-900/50 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                {tab} 
                <span className="ml-3 text-[10px] opacity-70">
                  ({tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length})
                </span>
              </button>
            ))}
          </div>

          {/* ULTRA ORDERS LIST */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-900/40 backdrop-blur-md rounded-3xl animate-pulse border border-white/5"></div>)}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-[3rem] p-24 text-center shadow-2xl">
              <svg className="w-16 h-16 text-zinc-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <p className="text-zinc-400 text-xl font-light tracking-wide">No {activeTab !== 'All' ? activeTab : ''} orders currently found in the system.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 lg:p-10 flex flex-col xl:flex-row gap-10 shadow-2xl relative overflow-hidden transition-all duration-300">
                  
                  {/* Dynamic Status Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-3 transition-colors ${
                    order.status === 'Processing' ? 'bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.8)]' : 
                    order.status === 'Dispatched' ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)]' :
                    order.status === 'Delivered' ? 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)]' :
                    'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]'
                  }`}></div>

                  {/* Left Col: Customer Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <span className="text-xs font-black text-black bg-white px-4 py-1.5 rounded-lg tracking-widest uppercase shadow-md">ID: {order.order_id}</span>
                      <span className="text-xs text-zinc-400 font-medium tracking-wide">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    
                    <div>
                      <h3 className={`text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>{order.customer_name}</h3>
                      <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-light tracking-wide">{order.shipping_address}, {order.city} {order.postal_code}</p>
                    </div>

                    {/* ✨ AUTOMATED COMMUNICATION BUTTONS ✨ */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                      <a href={generateMessageLink(order, true)} className="px-6 py-4 bg-black border border-white/10 hover:border-white/30 hover:bg-white hover:text-black rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Email Status
                      </a>
                      <a href={generateMessageLink(order, false)} target="_blank" rel="noopener noreferrer" className="px-6 py-4 bg-[#0b141a] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black rounded-xl text-xs font-black text-[#25D366] uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        WhatsApp Status
                      </a>
                    </div>
                  </div>

                  {/* Middle Col: Items */}
                  <div className="xl:w-2/5 bg-black rounded-[1.5rem] p-6 md:p-8 border border-white/5">
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-6">Order Items</p>
                    <div className="space-y-5 max-h-48 overflow-y-auto custom-scrollbar pr-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className={`flex gap-4 items-center ${order.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                          <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-white/10">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" />
                          </div>
                          <p className="text-base text-zinc-300 leading-tight">
                            <span className="font-black text-white mr-3">{item.quantity}x</span> {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Col: Financials & Dynamic Status Dropdown */}
                  <div className="xl:w-64 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-10">
                    <div>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Order Total</p>
                      <p className={`text-4xl font-black mb-3 tracking-tighter ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>
                        Rs. {order.total_amount.toLocaleString()}
                      </p>
                      <p className="inline-block px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-[10px] md:text-xs text-white uppercase tracking-widest font-bold">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                      </p>
                    </div>
                    
                    <div className="mt-8">
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Order Status</p>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`w-full text-xs font-black uppercase tracking-[0.2em] rounded-xl py-5 px-4 outline-none cursor-pointer appearance-none text-center transition-all ${
                          order.status === 'Processing' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.2)]' :
                          order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]' :
                          order.status === 'Delivered' ? 'bg-white/20 text-white border border-white/50 hover:bg-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]' :
                          'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
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
    </>
  );
}