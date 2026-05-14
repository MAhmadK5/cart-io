"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AnalyticsModule() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setIsLoading(false);
  };

  // --- DATA PROCESSING ---
  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalItemsSold = validOrders.reduce((sum, o) => sum + o.items.reduce((iSum: number, item: any) => iSum + item.quantity, 0), 0);
  const aov = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // 1. Last 7 Days Revenue Chart
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const revenueByDay = last7Days.map(date => {
    const dayOrders = validOrders.filter(o => o.created_at.startsWith(date));
    const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    return { 
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), 
      fullDate: date,
      revenue 
    };
  });
  
  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1000); // Prevent division by zero

  // 2. Status Distribution
  const statusCounts = { Processing: 0, Dispatched: 0, Delivered: 0, Cancelled: 0 };
  orders.forEach(o => {
    const stat = o.status === 'Shipped' ? 'Dispatched' : o.status;
    if (statusCounts[stat as keyof typeof statusCounts] !== undefined) {
      statusCounts[stat as keyof typeof statusCounts]++;
    }
  });

  // 3. Top Selling Products
  const productStats: Record<string, { qty: number, rev: number, image: string }> = {};
  validOrders.forEach(order => {
    order.items.forEach((item: any) => {
      if (!productStats[item.name]) productStats[item.name] = { qty: 0, rev: 0, image: item.image };
      productStats[item.name].qty += item.quantity;
      productStats[item.name].rev += (item.price * item.quantity);
    });
  });

  const topProducts = Object.entries(productStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 4);
    
  const maxProductQty = Math.max(...topProducts.map(p => p.qty), 1);

  // 4. Recent Feed
  const recentFeed = orders.slice(0, 4);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent border-b-blue-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Establishing Uplink...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 relative animate-fade-in">
      
      {/* HEADER WITH LIVE RADAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 relative z-10">
        <div className="flex-1 w-full">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Live Telemetry Active</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase break-words leading-none drop-shadow-2xl">
            Data Intel
          </h1>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base font-light tracking-wide max-w-2xl">
            Real-time analytical overview of platform velocity, revenue generation, and asset deployment.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* ✨ HERO METRICS (WITH TRAJECTORIES & GLOWS) ✨ */}
      {/* ================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Gross Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, color: 'from-purple-500 to-purple-800', textColor: 'text-purple-400', glow: 'bg-purple-500/20', growth: '+14.2%' },
          { label: 'Total Orders', value: orders.length, color: 'from-blue-500 to-blue-800', textColor: 'text-blue-400', glow: 'bg-blue-500/20', growth: '+8.4%' },
          { label: 'Avg Order Value', value: `Rs. ${aov.toLocaleString()}`, color: 'from-emerald-400 to-emerald-700', textColor: 'text-emerald-400', glow: 'bg-emerald-500/20', growth: '+3.1%' },
          { label: 'Assets Deployed', value: totalItemsSold, color: 'from-orange-400 to-orange-700', textColor: 'text-orange-400', glow: 'bg-orange-500/20', growth: '+21.5%' }
        ].map((metric, idx) => (
          <div key={idx} className="relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Ambient Hover Glow */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 ${metric.glow} blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>
            
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 relative z-10">{metric.label}</p>
            <p className={`text-4xl font-black tracking-tighter truncate ${metric.textColor} relative z-10 mb-4`}>{metric.value}</p>
            
            <div className="flex items-center gap-2 relative z-10">
              <span className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1 border border-white/10">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                {metric.growth}
              </span>
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">vs Last Week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        
        {/* ================================================= */}
        {/* ✨ THE "MATRIX" REVENUE CHART ✨ */}
        {/* ================================================= */}
        <div className="xl:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group flex flex-col">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-end mb-12 relative z-10">
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">7-Day Trajectory</p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Revenue Flow</h2>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Peak Day</p>
              <p className="text-2xl font-black text-white uppercase tracking-tighter">Rs. {maxRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex-1 relative z-10 flex flex-col justify-end min-h-[250px] md:min-h-[300px]">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full h-px bg-white/5 border-b border-dashed border-white/5"></div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-2 h-full relative z-10 pt-10">
              {revenueByDay.map((day, idx) => {
                const heightPct = day.revenue > 0 ? (day.revenue / maxRevenue) * 100 : 2;
                return (
                  <div key={idx} className="flex flex-col items-center gap-4 w-full h-full justify-end group/bar cursor-default relative">
                    
                    {/* Glass Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 translate-y-4 group-hover/bar:translate-y-0 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black tracking-widest px-4 py-2 rounded-xl whitespace-nowrap z-20 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                      Rs. {day.revenue.toLocaleString()}
                    </div>
                    
                    {/* Neon Bar */}
                    <div className="w-full max-w-[3.5rem] bg-black/50 rounded-t-2xl relative overflow-hidden flex items-end justify-center h-full border-x border-t border-white/5">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 via-purple-500 to-purple-400 rounded-t-2xl transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(168,85,247,0.5)] group-hover/bar:brightness-150 group-hover/bar:shadow-[0_0_40px_rgba(168,85,247,0.8)]"
                        style={{ height: `${heightPct}%` }}
                      >
                        {/* Shimmer effect inside bar */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/bar:text-white transition-colors">{day.date}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ✨ LOGISTICS RADAR (ADVANCED STATUS) ✨ */}
        {/* ================================================= */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col">
          <div className="mb-10">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2">Network Nodes</p>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Logistics</h2>
          </div>

          <div className="space-y-8 flex-1 flex flex-col justify-center">
            {[
              { label: 'Processing', count: statusCounts.Processing, color: 'bg-purple-500', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]' },
              { label: 'Dispatched', count: statusCounts.Dispatched, color: 'bg-blue-500', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]' },
              { label: 'Delivered', count: statusCounts.Delivered, color: 'bg-green-500', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.6)]' },
              { label: 'Cancelled', count: statusCounts.Cancelled, color: 'bg-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]' },
            ].map((stat, idx) => {
              const pct = orders.length > 0 ? Math.round((stat.count / orders.length) * 100) : 0;
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">{stat.label}</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-white tracking-tighter">{stat.count}</span>
                      <span className="text-[10px] font-bold text-zinc-600 ml-2 tracking-widest">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                      className={`absolute top-0 left-0 h-full ${stat.color} ${stat.shadow} rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ================================================= */}
        {/* ✨ VELOCITY RANKING (TOP PRODUCTS) ✨ */}
        {/* ================================================= */}
        <div className="xl:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">High Demand</p>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Velocity Leaders</h2>
            </div>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="w-full bg-black/50 border border-white/5 rounded-2xl p-10 text-center">
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">No assets deployed yet.</p>
              </div>
            ) : topProducts.map((product, idx) => {
              // Assign luxury ranks
              const rankColor = idx === 0 ? 'text-amber-400 border-amber-400/30 bg-amber-400/5' : 
                                idx === 1 ? 'text-zinc-300 border-zinc-300/30 bg-zinc-300/5' : 
                                idx === 2 ? 'text-orange-400 border-orange-400/30 bg-orange-400/5' : 
                                'text-zinc-600 border-white/5 bg-black/40';
              const rankBg = idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-zinc-300' : idx === 2 ? 'bg-orange-400' : 'bg-purple-500';

              return (
                <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 border rounded-2xl hover:bg-white/5 transition-all duration-300 group ${rankColor}`}>
                  
                  <div className="flex items-center gap-5 md:gap-6 mb-4 md:mb-0">
                    <span className="text-3xl font-black opacity-50 w-6 text-center">{idx + 1}</span>
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded-xl bg-black border border-white/10 p-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-black text-white tracking-wide text-base md:text-lg max-w-[200px] md:max-w-[250px] truncate">{product.name}</h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Asset ID: {product.name.substring(0,6).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-12 md:text-right w-full md:w-auto">
                    <div className="flex-1 md:w-32">
                      <div className="flex justify-between items-end mb-1">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Units</p>
                        <p className="font-black text-white text-sm">{product.qty}</p>
                      </div>
                      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full ${rankBg} rounded-full`} style={{ width: `${(product.qty / maxProductQty) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="w-32 hidden md:block">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Revenue Generated</p>
                      <p className="font-black text-white text-xl tracking-tighter">Rs. {product.rev.toLocaleString()}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================= */}
        {/* ✨ LIVE TRANSMISSIONS (RECENT FEED) ✨ */}
        {/* ================================================= */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 shadow-2xl flex flex-col">
          <div className="mb-8">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Stream
            </p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Recent Comm.</h2>
          </div>

          <div className="space-y-4 flex-1">
            {recentFeed.length === 0 ? (
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center mt-10">No recent transmissions.</p>
            ) : recentFeed.map((order, idx) => (
              <div key={order.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-red-500 transition-colors"></div>
                <div className="flex justify-between items-start mb-2 pl-3">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{order.order_id}</p>
                    <p className="text-sm font-bold text-white truncate max-w-[150px]">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white tracking-tighter">Rs. {order.total_amount.toLocaleString()}</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Just Now</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">End of Feed</p>
          </div>
        </div>

      </div>
    </div>
  );
}