"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function OrdersModule() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [metrics, setMetrics] = useState({ revenue: 0, pending: 0, total: 0, aov: 0 });
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map(o => ({ ...o, status: o.status === 'Shipped' ? 'Dispatched' : (o.status || 'Processing') }));
      setOrders(formatted);
      const valid = formatted.filter(o => o.status !== 'Cancelled');
      const rev = valid.reduce((sum, o) => sum + Number(o.total_amount), 0);
      setMetrics({ 
        revenue: rev, 
        pending: formatted.filter(o => o.status === 'Processing').length, 
        total: formatted.length, 
        aov: valid.length > 0 ? Math.round(rev / valid.length) : 0 
      });
    }
    setLoadingOrders(false);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setMetrics(prev => ({ ...prev, pending: newStatus === 'Processing' ? prev.pending + 1 : prev.pending - 1 }));
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  const handleDeleteOrder = async (id: number) => {
    if (confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) {
      await supabase.from('orders').delete().eq('id', id);
      fetchOrders();
    }
  };

  const getOrderMessage = (order: any) => {
    let text = "";
    switch(order.status) {
      case 'Processing':
        text = `Hello ${order.customer_name}! 🚀\n\nThank you for choosing CARTIO. Your order (${order.order_id}) is currently being prepared by our team. We will notify you the moment it dispatches!`;
        break;
      case 'Dispatched':
        text = `Hello ${order.customer_name}! 📦\n\nGreat news! Your CARTIO order (${order.order_id}) has been successfully dispatched and is on its way to your location.`;
        break;
      case 'Delivered':
        text = `Hello ${order.customer_name}! 🎉\n\nYour CARTIO order (${order.order_id}) has been marked as delivered. We hope you love your new assets! We would love to hear your feedback on our website.`;
        break;
      case 'Cancelled':
        text = `Hello ${order.customer_name}.\n\nYour CARTIO order (${order.order_id}) has been cancelled. If you have any questions or need to place a new order, we are here to help!`;
        break;
      default:
        text = `Hello ${order.customer_name}! Regarding your CARTIO order (${order.order_id})...`;
    }
    return encodeURIComponent(text);
  };

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Order Ledger</h1>
          <p className="text-zinc-400 mt-2 text-base md:text-lg font-light tracking-wide">{activeTab === 'All' ? 'Showing all incoming orders.' : `Currently viewing: ${activeTab}`}</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-xs md:text-sm font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
          Refresh Data
        </button>
      </div>

      {/* TABS (Mobile optimized) */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-4 custom-scrollbar lg:hidden">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-zinc-900/50 text-zinc-500 hover:text-white border border-transparent'}`}>
            {tab}
            <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
              {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Total Revenue</p>
          <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">Rs. {metrics.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl">
          <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3">Average Order Value</p>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">Rs. {metrics.aov.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl">
          <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3">Total Orders</p>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">{metrics.total}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-red-500/20 p-8 rounded-3xl shadow-xl">
          <p className="text-xs md:text-sm font-black text-red-400 uppercase tracking-widest mb-3">Action Required</p>
          <p className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
            {metrics.pending}
            {metrics.pending > 0 && <span className="relative flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span></span>}
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      {loadingOrders ? (
        <div className="space-y-6">{[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-900/40 backdrop-blur-md rounded-3xl animate-pulse border border-white/5"></div>)}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-16 text-center">
          <p className="text-zinc-500 font-light tracking-widest uppercase">No orders found in this category.</p>
        </div>
      ) : filteredOrders.map((order) => (
        <div key={order.id} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 lg:p-10 flex flex-col xl:flex-row gap-10 shadow-2xl relative overflow-hidden transition-all duration-300 mb-8 group">
          <div className={`absolute left-0 top-0 bottom-0 w-3 transition-colors ${order.status === 'Processing' ? 'bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.8)]' : order.status === 'Dispatched' ? 'bg-blue-500' : order.status === 'Delivered' ? 'bg-white' : 'bg-red-500'}`}></div>
          
          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs font-black text-black bg-white px-4 py-1.5 rounded-lg tracking-widest uppercase">ID: {order.order_id}</span>
                <span className="text-xs text-zinc-400 font-medium tracking-wide">{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => handleDeleteOrder(order.id)} 
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                title="Delete Order"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            
            <div>
              <h3 className={`text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>{order.customer_name}</h3>
              <p className="text-base md:text-lg text-zinc-400 font-light">{order.shipping_address}, {order.city} {order.postal_code}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a 
                href={`mailto:${order.customer_email}?subject=Update on your CARTIO Order ${order.order_id}&body=${getOrderMessage(order)}`} 
                className="px-6 py-4 bg-black border border-white/10 hover:border-white/30 hover:bg-white hover:text-black rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all flex items-center gap-3"
              >
                Email Status
              </a>
              <a 
                href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${getOrderMessage(order)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-4 bg-[#0b141a] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black rounded-xl text-xs font-black text-[#25D366] uppercase tracking-widest transition-all flex items-center gap-3"
              >
                WhatsApp Status
              </a>
            </div>
          </div>
          
          <div className="xl:w-2/5 bg-black rounded-[1.5rem] p-6 md:p-8 border border-white/5">
            <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-6">Order Items</p>
            <div className="space-y-5 max-h-56 overflow-y-auto custom-scrollbar pr-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className={`flex gap-4 items-start ${order.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-zinc-900 border border-white/5 p-1" />
                  <div>
                    <p className="text-base text-zinc-300 leading-tight mb-1"><span className="font-black text-white mr-2">{item.quantity}x</span> {item.name}</p>
                    {(item.color || item.customText || item.note) && (
                      <div className="flex flex-col gap-1 border-l-2 border-purple-500/30 pl-2 mt-1">
                        {item.color && (
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            Finish: <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: item.color }}></span>
                          </span>
                        )}
                        {(item.customText || item.note) && (
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                            Note: <span className="text-purple-400 font-bold">"{item.customText || item.note}"</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:w-64 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-10">
            <div>
              <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Total</p>
              <p className={`text-4xl font-black mb-3 tracking-tighter ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>Rs. {order.total_amount.toLocaleString()}</p>
            </div>
            <div className="mt-8">
              <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`w-full text-xs font-black uppercase tracking-[0.2em] rounded-xl py-5 px-4 outline-none cursor-pointer appearance-none text-center transition-all ${
                  order.status === 'Processing' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                  order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                  order.status === 'Delivered' ? 'bg-white/20 text-white border border-white/50' :
                  'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                <option value="Processing" className="bg-zinc-900 text-white">Processing</option>
                <option value="Dispatched" className="bg-zinc-900 text-white">Dispatched</option>
                <option value="Delivered" className="bg-zinc-900 text-white">Delivered</option>
                <option value="Cancelled" className="bg-zinc-900 text-white">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}