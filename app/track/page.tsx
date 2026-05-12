"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function TrackPage() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('order_id', orderId.trim())
        .single();

      if (error || !data) {
        setError("We couldn't find an active asset with that tracking ID. Please verify your order number.");
      } else {
        setOrderData(data);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    
    const statuses = ['Processing', 'Dispatched', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen pb-32 pt-24 md:pt-32 relative overflow-hidden flex flex-col items-center">
      
      {/* ✨ HIGH-TECH AMBIENT BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-20"></div>
      <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent pointer-events-none -z-20"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-zinc-900/80 border border-white/10 mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Live Tracker Uplink</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter text-center mb-6 uppercase leading-none">
          Locate Asset
        </h1>
        <p className="text-zinc-400 text-center max-w-lg mb-14 text-sm md:text-base font-light tracking-wide leading-relaxed">
          Enter your unique order designation to establish a real-time connection with our dispatch node.
        </p>

        {/* ✨ SEXY GLOWING SEARCH INPUT ✨ */}
        <form onSubmit={handleTrackOrder} className="w-full max-w-2xl relative mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-focus-within:opacity-60 transition duration-500 animate-gradient-x"></div>
          <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-purple-500/50 transition-all">
            <div className="pl-6 pr-4 text-zinc-500 hidden sm:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. CIO-XXXXXX"
              className="w-full bg-transparent border-none text-white text-lg md:text-xl px-4 py-4 focus:outline-none placeholder:text-zinc-700 font-mono uppercase tracking-widest"
              required
            />
            <button 
              type="submit" 
              disabled={loading || !orderId.trim()}
              className="px-8 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] shrink-0 flex items-center gap-3"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Scanning</>
              ) : 'Track'}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center animate-fade-in shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <p className="text-red-400 font-bold tracking-widest uppercase text-xs">{error}</p>
          </div>
        )}

        {/* Real Order Data Result */}
        {orderData && (
          <div className="w-full bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-fade-in mt-4 relative overflow-hidden">
            
            {/* Ambient Card Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full pointer-events-none ${orderData.status === 'Delivered' ? 'bg-green-500/10' : orderData.status === 'Dispatched' ? 'bg-blue-500/10' : orderData.status === 'Cancelled' ? 'bg-red-500/10' : 'bg-purple-500/10'}`}></div>

            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">Confirmed Manifest</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-mono">{orderData.order_id}</h2>
                <p className="text-zinc-400 mt-3 text-sm font-light tracking-wide">Placed on <span className="text-white font-bold">{new Date(orderData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">Current Status</p>
                <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
                  orderData.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  orderData.status === 'Delivered' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  orderData.status === 'Dispatched' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-purple-500/10 border-purple-500/30 text-purple-400'
                }`}>
                  <span className={`relative flex h-2.5 w-2.5`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${orderData.status === 'Cancelled' ? 'bg-red-400' : orderData.status === 'Delivered' ? 'bg-green-400' : orderData.status === 'Dispatched' ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${orderData.status === 'Cancelled' ? 'bg-red-500' : orderData.status === 'Delivered' ? 'bg-green-500' : orderData.status === 'Dispatched' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest">{orderData.status}</span>
                </div>
              </div>
            </div>

            {/* ✨ DYNAMIC TIMELINE ✨ */}
            {orderData.status === 'Cancelled' ? (
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-10 text-center mb-16 relative z-10">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h3 className="text-2xl font-black text-red-400 mb-3 uppercase tracking-widest">Asset Acquisition Terminated</h3>
                <p className="text-zinc-400 font-light">This order has been cancelled by the administration network. Please contact our concierge desk if you require further assistance.</p>
              </div>
            ) : (
              <div className="mb-16 relative z-10 pt-4">
                
                {/* Desktop Connecting Line */}
                <div className="absolute top-6 left-12 right-12 h-1.5 bg-black rounded-full z-0 hidden sm:block border border-white/5"></div>
                <div className="absolute top-6 left-12 h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full z-0 hidden sm:block transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ 
                  width: getStepStatus(2, orderData.status) === 'completed' || orderData.status === 'Delivered' ? '100%' : 
                         getStepStatus(1, orderData.status) === 'completed' || orderData.status === 'Dispatched' ? '50%' : '0%' 
                }}></div>

                <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-10 sm:gap-0">
                  
                  {/* Step 1: Processing */}
                  <div className="flex flex-row sm:flex-col items-center gap-6 sm:gap-4 text-left sm:text-center w-full sm:w-1/3">
                    <div className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl sm:rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                      getStepStatus(0, orderData.status) === 'completed' || orderData.status === 'Processing'
                        ? 'bg-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-110'
                        : 'bg-black border border-white/10 text-zinc-600'
                    }`}>
                      <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div>
                      <p className={`text-sm sm:text-xs font-black uppercase tracking-widest ${getStepStatus(0, orderData.status) === 'completed' || orderData.status === 'Processing' ? 'text-white' : 'text-zinc-500'}`}>Processing</p>
                      <p className="text-xs sm:text-[10px] text-zinc-500 mt-1.5 sm:mt-1 font-light tracking-wide">Order secured in ledger</p>
                    </div>
                  </div>

                  {/* Step 2: Dispatched */}
                  <div className="flex flex-row sm:flex-col items-center gap-6 sm:gap-4 text-left sm:text-center w-full sm:w-1/3">
                    <div className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl sm:rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                      orderData.status === 'Dispatched' || orderData.status === 'Delivered'
                        ? 'bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-110'
                        : 'bg-black border border-white/10 text-zinc-600'
                    }`}>
                      <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <div>
                      <p className={`text-sm sm:text-xs font-black uppercase tracking-widest ${orderData.status === 'Dispatched' || orderData.status === 'Delivered' ? 'text-white' : 'text-zinc-500'}`}>Dispatched</p>
                      <p className="text-xs sm:text-[10px] text-zinc-500 mt-1.5 sm:mt-1 font-light tracking-wide">Asset in transit</p>
                    </div>
                  </div>

                  {/* Step 3: Delivered */}
                  <div className="flex flex-row sm:flex-col items-center gap-6 sm:gap-4 text-left sm:text-center w-full sm:w-1/3">
                    <div className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl sm:rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                      orderData.status === 'Delivered'
                        ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] scale-110'
                        : 'bg-black border border-white/10 text-zinc-600'
                    }`}>
                      <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <p className={`text-sm sm:text-xs font-black uppercase tracking-widest ${orderData.status === 'Delivered' ? 'text-green-400' : 'text-zinc-500'}`}>Delivered</p>
                      <p className="text-xs sm:text-[10px] text-zinc-500 mt-1.5 sm:mt-1 font-light tracking-wide">Destination reached</p>
                    </div>
                  </div>

                </div>

                {/* ✨ SEXY M&P COURIER TRACKING LINK ✨ */}
                {(orderData.status === 'Dispatched' || orderData.status === 'Delivered') && (
                  <div className="mt-14 flex justify-center animate-fade-in relative z-10">
                    <a 
                      href="https://mulphilog.com/tracking/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-4 px-8 py-5 bg-[#F4AA41]/10 border border-[#F4AA41]/30 hover:bg-[#F4AA41] hover:text-black text-[#F4AA41] rounded-2xl transition-all duration-300 group shadow-[0_0_30px_rgba(244,170,65,0.15)] hover:shadow-[0_0_40px_rgba(244,170,65,0.4)]"
                    >
                      <svg viewBox="0 0 72 72" className="w-8 h-8 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                        <path fill="currentColor" stroke="none" d="M10.921,22.5547l-4.0185,2.0136l-2.5423,1.7802l-0.8686,2.7256l-1.4696,4.1912l1.8157,2.3282l5.8333-1.5797 l1.6224,1.5797l3.6707,1.9249l1.2487,4.3261l-4.0418,3.9438l-1.4167,4.3797l0.539,2.6654l2.8043,2.3565l3.0014-2.8463 c0,0-0.5245-3.0007,0.9404-4.3388c1.4649-1.3381,3.3757-3.7385,3.3757-3.7385v8.4005l0.6012,2.5443l2.2353,0.4577l1.3519-1.8344 l1.4614-12.9224l2.2658,0.2907l5.9944,0.5474l4.2084-2.0965l1.1374,4.6127l3.6984,3.7385l-0.79,4.7548l1.175,2.2688l2.5399-1.4963 l2.3975-4.1153v-3.6284l-4.1458-4.0474l7.6544,5.3456l2.7721,1.7794l0.7162,5.8899l1.9164,0.9706l1.8163-1.4347l-0.7805-9.0342 L57.9183,43.88l-3.4836-5.7002l0.2779-4.3048l-0.5946-5.3399c-3.7098-1.924-7.58-2.9066-11.6334-2.8146l-8.4753-0.0539 l-7.4206,0.5278l-4.8427-1.3913l-6.8252-0.2347l-1.6817-1.3828L10.921,22.5547z"/>
                      </svg>
                      <div className="flex flex-col text-left border-l border-current/20 pl-4">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Track Direct via</span>
                        <span className="text-base font-bold uppercase tracking-widest leading-none mt-1.5">M&P Courier</span>
                      </div>
                      <svg className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                  </div>
                )}

              </div>
            )}

            {/* Order Details Breakdown */}
            <div className="bg-black/60 border border-white/5 rounded-3xl p-6 md:p-10 relative z-10 shadow-inner">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Manifest Details
              </h3>
              <div className="space-y-4 mb-8">
                {orderData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-5 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-xl bg-black border border-white/10 p-1 group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                      <h4 className="text-white font-bold tracking-wide text-lg line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono tracking-widest mt-1">QTY: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* ✨ SHOW DISCOUNT ON TRACKING MANIFEST IF APPLIED ✨ */}
              {(orderData.discount_amount && orderData.discount_amount > 0) && (
                <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                  <span className="text-purple-400 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    Promo ({orderData.discount_code})
                  </span>
                  <span className="text-base font-black text-purple-400 tracking-widest">- Rs. {orderData.discount_amount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-zinc-400 uppercase tracking-[0.3em] text-xs font-black">Total Valuation</span>
                <span className="text-3xl font-black text-white tracking-tighter">Rs. {orderData.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Details Block */}
            <div className="mt-6 flex flex-col md:flex-row gap-6 relative z-10">
              <div className="flex-1 bg-black/60 border border-white/5 rounded-3xl p-6 md:p-8 shadow-inner">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Shipping Destination
                </p>
                <p className="text-sm text-zinc-300 font-mono leading-relaxed">{orderData.shipping_address}<br/>{orderData.city}, {orderData.postal_code}</p>
              </div>
              <div className="flex-1 bg-black/60 border border-white/5 rounded-3xl p-6 md:p-8 shadow-inner">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Recipient Log
                </p>
                <p className="text-sm text-zinc-300 font-mono leading-relaxed">{orderData.customer_name}<br/>{orderData.customer_phone}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}