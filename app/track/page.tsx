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
      // Fetch the exact order from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('order_id', orderId.trim()) // ilike makes it case-insensitive!
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

  // Helper to determine step status
  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    
    const statuses = ['Processing', 'Dispatched', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen pb-24 pt-12 relative overflow-hidden flex flex-col items-center">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-3xl px-6 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Live Tracker Uplink</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight text-center mb-4 uppercase">
          Locate Asset
        </h1>
        <p className="text-zinc-400 text-center max-w-lg mb-12">
          Enter your unique order designation (e.g., ORD-12345) to establish a real-time connection with our dispatch node.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleTrackOrder} className="w-full relative mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative flex items-center bg-black border border-white/10 rounded-xl p-2 shadow-2xl">
            <svg className="w-6 h-6 text-zinc-500 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="ORD-XXXXXX"
              className="w-full bg-transparent border-none text-white text-lg px-4 py-4 focus:outline-none placeholder:text-zinc-700 font-mono uppercase tracking-widest"
              required
            />
            <button 
              type="submit" 
              disabled={loading || !orderId.trim()}
              className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center animate-fade-in">
            <p className="text-red-400 font-bold tracking-wide">{error}</p>
          </div>
        )}

        {/* Real Order Data Result */}
        {orderData && (
          <div className="w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl animate-fade-in mt-4">
            
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12 border-b border-white/5 pb-8">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Confirmed Manifest</p>
                <h2 className="text-3xl font-black text-white tracking-tight">{orderData.order_id}</h2>
                <p className="text-zinc-400 mt-2 text-sm">Placed on {new Date(orderData.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Current Status</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  orderData.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  orderData.status === 'Delivered' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  orderData.status === 'Dispatched' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-orange-500/10 border-orange-500/30 text-orange-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    orderData.status === 'Cancelled' ? 'bg-red-500' :
                    orderData.status === 'Delivered' ? 'bg-green-500' :
                    orderData.status === 'Dispatched' ? 'bg-blue-500' :
                    'bg-orange-500'
                  }`}></span>
                  <span className="text-xs font-black uppercase tracking-widest">{orderData.status}</span>
                </div>
              </div>
            </div>

            {/* If Cancelled, show a specific warning, otherwise show timeline */}
            {orderData.status === 'Cancelled' ? (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center mb-12">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h3 className="text-xl font-bold text-red-400 mb-2">Asset Acquisition Terminated</h3>
                <p className="text-zinc-400">This order has been cancelled by the administration network. Please contact support if you require further assistance.</p>
              </div>
            ) : (
              <div className="mb-12 relative">
                {/* Connecting Line */}
                <div className="absolute top-5 left-8 right-8 h-1 bg-zinc-900 rounded-full z-0 hidden sm:block"></div>
                <div className="absolute top-5 left-8 h-1 bg-blue-500 rounded-full z-0 hidden sm:block transition-all duration-1000" style={{ 
                  width: getStepStatus(2, orderData.status) === 'completed' || orderData.status === 'Delivered' ? '100%' : 
                         getStepStatus(1, orderData.status) === 'completed' || orderData.status === 'Dispatched' ? '50%' : '0%' 
                }}></div>

                <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                  
                  {/* Step 1: Processing */}
                  <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 text-left sm:text-center w-full sm:w-1/3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      getStepStatus(0, orderData.status) === 'completed' || orderData.status === 'Processing'
                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${getStepStatus(0, orderData.status) === 'completed' || orderData.status === 'Processing' ? 'text-white' : 'text-zinc-500'}`}>Processing</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Order received</p>
                    </div>
                  </div>

                  {/* Step 2: Dispatched */}
                  <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 text-left sm:text-center w-full sm:w-1/3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      orderData.status === 'Dispatched' || orderData.status === 'Delivered'
                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${orderData.status === 'Dispatched' || orderData.status === 'Delivered' ? 'text-white' : 'text-zinc-500'}`}>Dispatched</p>
                      <p className="text-[10px] text-zinc-500 mt-1">In transit</p>
                    </div>
                  </div>

                  {/* Step 3: Delivered */}
                  <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 text-left sm:text-center w-full sm:w-1/3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      orderData.status === 'Delivered'
                        ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${orderData.status === 'Delivered' ? 'text-green-400' : 'text-zinc-500'}`}>Delivered</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Asset secured</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Order Details Breakdown */}
            <div className="bg-black border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Manifest Details</h3>
              <div className="space-y-4 mb-6">
                {orderData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-zinc-900 border border-zinc-800" />
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{item.name}</h4>
                      <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Total Paid</span>
                <span className="text-2xl font-black text-white tracking-tight">Rs. {orderData.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Details Block */}
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-black border border-white/5 rounded-2xl p-6">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Shipping Destination</p>
                <p className="text-sm text-zinc-300 font-mono">{orderData.shipping_address}<br/>{orderData.city}, {orderData.postal_code}</p>
              </div>
              <div className="flex-1 bg-black border border-white/5 rounded-2xl p-6">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Recipient Log</p>
                <p className="text-sm text-zinc-300 font-mono">{orderData.customer_name}<br/>{orderData.customer_phone}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}