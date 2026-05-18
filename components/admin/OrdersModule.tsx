"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function OrdersModule() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [metrics, setMetrics] = useState({ revenue: 0, pending: 0, total: 0, aov: 0 });
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Processing', 'Dispatched', 'Delivered', 'Returned', 'Cancelled'];

  // ✨ MODAL STATES ✨
  const [infoModalOrder, setInfoModalOrder] = useState<any | null>(null);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean; orderId: number; newStatus: string; oldStatus: string;
  } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // ✨ TRACKING STATES ✨
  const [trackingInput, setTrackingInput] = useState("");
  const [courierPartner, setCourierPartner] = useState("M&P");

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; orderId: number } | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map(o => ({ ...o, status: o.status === 'Shipped' ? 'Dispatched' : (o.status || 'Processing') }));
      setOrders(formatted);
      
      const valid = formatted.filter(o => o.status !== 'Cancelled' && o.status !== 'Returned');
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

  const handleStatusChangeRequest = (orderId: number, newStatus: string, oldStatus: string) => {
    if (newStatus === oldStatus) return;
    setTrackingInput(""); 
    setCourierPartner("M&P"); 
    setStatusModal({ isOpen: true, orderId, newStatus, oldStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusModal) return;
    
    if (statusModal.newStatus === 'Dispatched' && !trackingInput.trim()) {
      alert(`Please provide the ${courierPartner} Tracking Number to dispatch this order.`);
      return;
    }

    setIsUpdatingStatus(true);
    
    const { orderId, newStatus } = statusModal;
    const targetOrder = orders.find(o => o.id === orderId);
    
    const trackingNo = newStatus === 'Dispatched' ? trackingInput.trim() : targetOrder.tracking_number;
    const partner = newStatus === 'Dispatched' ? courierPartner : targetOrder.courier_partner;

    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, tracking_number: trackingNo, courier_partner: partner } : o));
    setMetrics(prev => ({ ...prev, pending: newStatus === 'Processing' ? prev.pending + 1 : prev.pending - 1 }));
    
    const updatePayload: any = { status: newStatus };
    if (newStatus === 'Dispatched') {
      updatePayload.tracking_number = trackingNo;
      updatePayload.courier_partner = partner;
    }
    await supabase.from('orders').update(updatePayload).eq('id', orderId);

    if (targetOrder && targetOrder.customer_email) {
      try {
        await fetch('/api/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetOrder.customer_email,
            name: targetOrder.customer_name,
            orderId: targetOrder.order_id,
            status: newStatus,
            trackingNumber: newStatus === 'Dispatched' ? trackingNo : null,
            courierPartner: newStatus === 'Dispatched' ? partner : null
          })
        });
      } catch (err) {
        console.error("Failed to send automated status email", err);
      }
    }

    setIsUpdatingStatus(false);
    setStatusModal(null);
  };

  const handleDeleteRequest = (orderId: number) => {
    setDeleteInput("");
    setDeleteModal({ isOpen: true, orderId });
  };

  const confirmDelete = async () => {
    if (!deleteModal || deleteInput !== 'delete') return;
    setIsDeleting(true);
    
    await supabase.from('orders').delete().eq('id', deleteModal.orderId);
    fetchOrders();
    
    setIsDeleting(false);
    setDeleteModal(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getOrderMessage = (order: any) => {
    let text = "";
    
    // ✨ FIXED LEOPARDS TRACKING LINK ✨
    const trackingLink = order.courier_partner === 'Leopards' 
      ? 'https://pk.leopardscourier.com/tracking' 
      : 'https://mulphilog.com/tracking/';

    switch(order.status) {
      case 'Processing':
        text = `Hello ${order.customer_name}! 🚀\n\nThank you for choosing CARTIO. Your order (${order.order_id}) is currently being prepared by our team. We will notify you the moment it dispatches!`;
        break;
      case 'Dispatched':
        text = `Hello ${order.customer_name}! 📦\n\nGreat news! Your CARTIO order (${order.order_id}) has been successfully dispatched via ${order.courier_partner || 'Courier'}.\n\n*Tracking Number:* ${order.tracking_number || 'N/A'}\n*Track Here:* ${trackingLink}`;
        break;
      case 'Delivered':
        text = `Hello ${order.customer_name}! 🎉\n\nYour CARTIO order (${order.order_id}) has been marked as delivered. We hope you love your new assets! We would love to hear your feedback on our website.`;
        break;
      case 'Returned':
        text = `Hello ${order.customer_name}.\n\nYour CARTIO order (${order.order_id}) has been marked as returned to our facility. If you have any concerns or wish to request a reshipment, please contact our support team.`;
        break;
      case 'Cancelled':
        text = `Hello ${order.customer_name}.\n\nYour CARTIO order (${order.order_id}) has been cancelled. If you have any questions or need to place a new order, we are here to help!`;
        break;
      default:
        text = `Hello ${order.customer_name}! Regarding your CARTIO order (${order.order_id})...`;
    }
    return encodeURIComponent(text);
  };

  const printReceipt = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to generate the receipt.");
      return;
    }

    const itemsHtml = order.items.map((item: any) => `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e4e4e7; padding: 15px 0;">
        <div>
          <p style="margin: 0; font-weight: 800; font-size: 16px;">${item.quantity}x ${item.name}</p>
          ${item.color ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #52525b; text-transform: uppercase;">Finish: ${item.color}</p>` : ''}
          ${item.customText || item.note ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #52525b; text-transform: uppercase;">Note: ${item.customText || item.note}</p>` : ''}
        </div>
        <p style="margin: 0; font-weight: 800; font-size: 16px;">Rs. ${(item.price * item.quantity).toLocaleString()}</p>
      </div>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Receipt - ${order.order_id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #09090b; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #09090b; padding-bottom: 30px; margin-bottom: 40px; }
            .header h1 { margin: 0; font-size: 48px; font-weight: 900; letter-spacing: 8px; text-transform: uppercase; }
            .header p { margin: 10px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 3px; color: #71717a; text-transform: uppercase; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; background: #f4f4f5; padding: 30px; border-radius: 16px; }
            .details strong { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; display: block; margin-bottom: 5px; }
            .details p { margin: 0 0 15px 0; font-size: 16px; font-weight: 600; }
            .details p:last-child { margin-bottom: 0; }
            .items h3 { text-transform: uppercase; letter-spacing: 3px; font-size: 14px; border-bottom: 2px solid #09090b; padding-bottom: 10px; margin-bottom: 10px; }
            .totals { margin-top: 40px; text-align: right; }
            .totals p { margin: 8px 0; font-size: 16px; font-weight: 600; color: #52525b; }
            .totals h2 { margin: 20px 0 0 0; font-size: 32px; font-weight: 900; border-top: 3px solid #09090b; padding-top: 20px; color: #09090b; }
            .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #a1a1aa; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CARTIO</h1>
            <p>Official Order Receipt</p>
          </div>
          <div class="details">
            <div>
              <strong>Billed To / Dispatch Destination</strong>
              <p>${order.customer_name}</p>
              <p>${order.customer_phone}</p>
              <p>${order.shipping_address}<br/>${order.city} ${order.postal_code || ''}</p>
            </div>
            <div style="text-align: right;">
              <strong>Order ID</strong>
              <p>${order.order_id}</p>
              <strong>Date Secured</strong>
              <p>${new Date(order.created_at).toLocaleString()}</p>
              <strong>Payment Protocol</strong>
              <p>${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit'}</p>
              ${order.tracking_number ? `<strong>${order.courier_partner || 'Courier'} Tracking</strong><p>${order.tracking_number}</p>` : ''}
            </div>
          </div>
          <div class="items">
            <h3>Asset Ledger</h3>
            ${itemsHtml}
          </div>
          <div class="totals">
            <p>Subtotal: Rs. ${(order.subtotal || order.total_amount).toLocaleString()}</p>
            <p>Logistics Fee: ${order.shipping_fee === 0 ? 'Complimentary' : `Rs. ${(order.shipping_fee || 0).toLocaleString()}`}</p>
            ${order.discount_amount > 0 ? `<p>Discount (${order.discount_code}): -Rs. ${order.discount_amount.toLocaleString()}</p>` : ''}
            <h2>Total: Rs. ${order.total_amount.toLocaleString()}</h2>
          </div>
          <div class="footer">
            <p>Thank you for shopping with CARTIO.</p>
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <div className="w-full max-w-full overflow-hidden pb-20 animate-fade-in">
      
      {/* ✨ HEADER WITH LIVE RADAR ✨ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 relative z-10">
        <div className="flex-1 w-full">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400">Ledger Sync Active</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase break-words leading-none drop-shadow-2xl">
            Order Records
          </h1>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base font-light tracking-wide max-w-2xl">
            {activeTab === 'All' ? 'Complete overview of all incoming requests.' : `Currently monitoring: ${activeTab} nodes.`}
          </p>
        </div>
        <button onClick={fetchOrders} className="flex items-center justify-center gap-3 px-8 py-5 bg-white text-black rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full md:w-auto shrink-0 group">
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Sync Data
        </button>
      </div>

      {/* ✨ HERO METRICS ✨ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Gross Revenue', value: `Rs. ${metrics.revenue.toLocaleString()}`, color: 'from-purple-500 to-purple-800', textColor: 'text-purple-400', glow: 'bg-purple-500/20' },
          { label: 'Total Orders', value: metrics.total, color: 'from-blue-500 to-blue-800', textColor: 'text-blue-400', glow: 'bg-blue-500/20' },
          { label: 'Avg Order Value', value: `Rs. ${metrics.aov.toLocaleString()}`, color: 'from-emerald-400 to-emerald-700', textColor: 'text-emerald-400', glow: 'bg-emerald-500/20' },
          { label: 'Action Required', value: metrics.pending, color: 'from-red-500 to-red-800', textColor: 'text-red-400', glow: 'bg-red-500/20', alert: true }
        ].map((metric, idx) => (
          <div key={idx} className={`relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500 ${metric.alert && metric.value > 0 ? 'border-red-500/30' : ''}`}>
            <div className={`absolute -right-10 -top-10 w-40 h-40 ${metric.glow} blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 relative z-10">{metric.label}</p>
            <p className={`text-4xl font-black tracking-tighter truncate ${metric.textColor} relative z-10 flex items-center gap-3`}>
              {metric.value}
              {metric.alert && metric.value > 0 && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
            </p>
          </div>
        ))}
      </div>

      {/* ✨ CYBERPUNK TABS ✨ */}
      <div className="w-full overflow-x-auto custom-scrollbar mb-10 pb-4">
        <div className="flex gap-3 min-w-max p-1 bg-black/40 border border-white/5 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`shrink-0 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono leading-none ${activeTab === tab ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-black text-zinc-500'}`}>
                {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ✨ ADVANCED ORDER CARDS ✨ */}
      {loadingOrders ? (
        <div className="space-y-6 w-full">{[1, 2, 3].map(i => <div key={i} className="h-48 w-full bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] animate-pulse border border-white/5"></div>)}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="w-full bg-zinc-900/20 border border-white/5 rounded-[3rem] p-16 text-center shadow-inner">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-zinc-500"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg></div>
          <p className="text-zinc-400 font-light tracking-widest uppercase text-sm">No transmissions detected in this node.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => {
            const isCancelled = order.status === 'Cancelled' || order.status === 'Returned';
            const isProcessing = order.status === 'Processing';
            const isReturned = order.status === 'Returned';
            
            const glowColor = isProcessing ? 'bg-purple-500' : 
                              order.status === 'Dispatched' ? 'bg-blue-500' : 
                              order.status === 'Delivered' ? 'bg-green-500' : 
                              isReturned ? 'bg-orange-500' : 'bg-red-500';
            
            return (
              <div key={order.id} className="relative group bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-[2.5rem] p-6 md:p-8 shadow-xl transition-all duration-500 overflow-hidden">
                {/* Ambient Status Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full ${glowColor}`}></div>
                
                {/* CARD HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6 relative z-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] sm:text-xs font-black text-black bg-white px-4 py-1.5 rounded-lg tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      {order.order_id}
                    </span>
                    <span className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-widest bg-black px-4 py-1.5 rounded-lg border border-white/5">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                    {order.tracking_number && (
                      <span className="text-[10px] sm:text-xs font-black text-[#F4AA41] bg-[#F4AA41]/10 border border-[#F4AA41]/30 px-4 py-1.5 rounded-lg tracking-widest uppercase flex items-center gap-2">
                        <svg viewBox="0 0 72 72" className="w-4 h-4"><path fill="currentColor" stroke="none" d="M10.921,22.5547l-4.0185,2.0136l-2.5423,1.7802l-0.8686,2.7256l-1.4696,4.1912l1.8157,2.3282l5.8333-1.5797 l1.6224,1.5797l3.6707,1.9249l1.2487,4.3261l-4.0418,3.9438l-1.4167,4.3797l0.539,2.6654l2.8043,2.3565l3.0014-2.8463 c0,0-0.5245-3.0007,0.9404-4.3388c1.4649-1.3381,3.3757-3.7385,3.3757-3.7385v8.4005l0.6012,2.5443l2.2353,0.4577l1.3519-1.8344 l1.4614-12.9224l2.2658,0.2907l5.9944,0.5474l4.2084-2.0965l1.1374,4.6127l3.6984,3.7385l-0.79,4.7548l1.175,2.2688l2.5399-1.4963 l2.3975-4.1153v-3.6284l-4.1458-4.0474l7.6544,5.3456l2.7721,1.7794l0.7162,5.8899l1.9164,0.9706l1.8163-1.4347l-0.7805-9.0342 L57.9183,43.88l-3.4836-5.7002l0.2779-4.3048l-0.5946-5.3399c-3.7098-1.924-7.58-2.9066-11.6334-2.8146l-8.4753-0.0539 l-7.4206,0.5278l-4.8427-1.3913l-6.8252-0.2347l-1.6817-1.3828L10.921,22.5547z"/></svg>
                        {order.courier_partner}: {order.tracking_number}
                      </span>
                    )}
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="w-full sm:w-48">
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChangeRequest(order.id, e.target.value, order.status)} 
                      className={`w-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl py-3 px-4 outline-none cursor-pointer appearance-none transition-all border shadow-inner ${
                        isProcessing ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20' :
                        order.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' :
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' :
                        isReturned ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      <option value="Processing" className="bg-zinc-900 text-white">Processing</option>
                      <option value="Dispatched" className="bg-zinc-900 text-white">Dispatched</option>
                      <option value="Delivered" className="bg-zinc-900 text-white">Delivered</option>
                      <option value="Returned" className="bg-zinc-900 text-white">Returned</option>
                      <option value="Cancelled" className="bg-zinc-900 text-white">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {/* CARD BODY */}
                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                  
                  {/* Left: Customer Info */}
                  <div className="w-full lg:w-1/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-2xl font-black tracking-tighter uppercase truncate ${isCancelled ? 'text-zinc-600 line-through' : 'text-white'}`}>
                          {order.customer_name}
                        </h3>
                        <button onClick={() => setInfoModalOrder(order)} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white text-zinc-400 hover:text-black transition-colors flex items-center justify-center shrink-0 border border-white/10" title="Client Dossier">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                      </div>
                      <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">{order.shipping_address}<br/>{order.city} {order.postal_code}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Total Valuation</p>
                      <p className={`text-3xl lg:text-4xl font-black tracking-tighter ${isCancelled ? 'text-zinc-600' : 'text-white'}`}>
                        Rs. {order.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Right: Items Horizontal Scroll */}
                  <div className="w-full lg:w-2/3 bg-black/50 rounded-3xl p-6 border border-white/5 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-end mb-4">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Asset Ledger</p>
                      {(order.discount_amount > 0) && (
                        <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest border border-purple-500/30 px-2 py-1 rounded-md bg-purple-500/10">
                          Promo: -Rs. {order.discount_amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 flex-1 items-center">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className={`flex items-center gap-4 bg-zinc-900 border border-white/5 rounded-2xl p-3 shrink-0 w-[260px] ${isCancelled ? 'opacity-50 grayscale' : ''}`}>
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-black p-1 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-white font-bold truncate leading-tight mb-1"><span className="text-zinc-500 mr-1">{item.quantity}x</span>{item.name}</p>
                            {(item.color || item.customText || item.note) && (
                              <div className="flex flex-col gap-0.5">
                                {item.color && <span className="text-[8px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">Finish: <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: item.color }}></span></span>}
                                {(item.customText || item.note) && <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest truncate">{item.customText || item.note}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/5 relative z-10">
                  <button onClick={() => handleDeleteRequest(order.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center mr-auto" title="Eradicate Order">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                  
                  <button onClick={() => printReceipt(order)} className="px-5 py-2.5 bg-white/5 hover:bg-white text-zinc-300 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print
                  </button>
                  <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${order.customer_email}&su=${encodeURIComponent(`Update on your CARTIO Order ${order.order_id}`)}&body=${getOrderMessage(order)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white/5 hover:bg-white text-zinc-300 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Email
                  </a>
                  <a href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${getOrderMessage(order)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-[#25D366]/30 shadow-[0_0_15px_rgba(37,211,102,0.1)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.195 1.585 6.014L.16 23.84l5.973-1.566C7.945 23.321 9.943 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                    WhatsApp
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================= */}
      {/* ✨ 1. CUSTOMER INFO DOSSIER MODAL ✨ */}
      {/* ========================================= */}
      {infoModalOrder && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setInfoModalOrder(null)}></div>
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <button onClick={() => setInfoModalOrder(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            
            <div className="mb-10 pr-10 relative z-10">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-2">Client Dossier</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none break-words">{infoModalOrder.customer_name}</h2>
            </div>

            <div className="space-y-8 border-t border-white/10 pt-8 relative z-10">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Encrypted Email</p>
                <p className="text-lg text-white font-medium break-all">{infoModalOrder.customer_email}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Direct Line</p>
                <p className="text-lg text-white font-medium">{infoModalOrder.customer_phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Destination Coordinates</p>
                <p className="text-lg text-white font-medium leading-snug break-words">{infoModalOrder.shipping_address}<br/>{infoModalOrder.city} {infoModalOrder.postal_code}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Payment Protocol</p>
                <p className="text-lg text-purple-400 font-black uppercase tracking-widest">{infoModalOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Digital/Card'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* ✨ 2. STATUS CHANGE CONFIRMATION MODAL ✨ */}
      {/* ========================================= */}
      {statusModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setStatusModal(null)}></div>
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 sm:p-10 shadow-[0_0_50px_rgba(59,130,246,0.15)] text-center overflow-hidden">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${statusModal.newStatus === 'Returned' ? 'bg-orange-500/10' : 'bg-blue-500/10'}`}></div>

            <div className={`w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 ${statusModal.newStatus === 'Returned' ? 'bg-orange-500/20 border-orange-500/30 text-orange-500' : 'bg-blue-500/20 border-blue-500/30 text-blue-500'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">Confirm Status Update</h2>
            <p className="text-sm text-zinc-400 font-light mb-8 relative z-10">
              You are moving this order from <span className="font-bold text-white">{statusModal.oldStatus}</span> to <span className={`font-bold ${statusModal.newStatus === 'Returned' ? 'text-orange-400' : 'text-blue-400'}`}>{statusModal.newStatus}</span>. 
            </p>

            {statusModal.newStatus === 'Dispatched' && (
              <div className="mb-8 space-y-5 text-left relative z-10">
                <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 block">Courier Partner</label>
                  <select 
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    className="w-full bg-transparent text-white pb-2 border-b border-white/20 outline-none focus:border-blue-500 transition-all text-sm cursor-pointer"
                  >
                    <option value="M&P" className="bg-zinc-900">M&P Courier</option>
                    <option value="Leopards" className="bg-zinc-900">Leopards Courier</option>
                  </select>
                </div>

                <div className="p-5 bg-black/40 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-colors">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 block">Tracking Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="ENTER ID..." 
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="w-full bg-transparent text-white font-mono tracking-widest text-lg outline-none placeholder:text-zinc-700"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-2 relative z-10">
              <button onClick={() => setStatusModal(null)} className="w-full sm:flex-1 py-4 bg-white/5 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10">Cancel</button>
              <button onClick={confirmStatusChange} disabled={isUpdatingStatus} className={`w-full sm:flex-1 py-4 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors disabled:opacity-50 flex justify-center items-center ${statusModal.newStatus === 'Returned' ? 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}>
                {isUpdatingStatus ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Execute Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* ✨ 3. STRICT DELETE CONFIRMATION MODAL ✨ */}
      {/* ========================================= */}
      {deleteModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" onClick={() => setDeleteModal(null)}></div>
          <div className="relative bg-zinc-950 border border-red-500/30 rounded-[2.5rem] w-full max-w-md p-8 sm:p-10 shadow-[0_0_60px_rgba(239,68,68,0.2)] text-center overflow-hidden">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20"></span>
              <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            
            <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter mb-4 relative z-10">CRITICAL WARNING</h2>
            <p className="text-sm text-zinc-400 font-light mb-8 relative z-10">
              You are about to permanently eradicate Order #{deleteModal.orderId} from the ledger. This action is irreversible.
              <br/><br/>
              To proceed, please type <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded border border-white/10 text-white font-bold tracking-widest">delete</span> below.
            </p>

            <div className="flex items-center gap-2 mb-8 bg-black/50 p-2 rounded-xl border border-red-500/20 focus-within:border-red-500 transition-colors relative z-10">
              <input 
                type="text" 
                placeholder="Type here..." 
                value={deleteInput} 
                onChange={(e) => setDeleteInput(e.target.value)}
                className="flex-1 w-full bg-transparent text-white px-4 py-3 outline-none font-mono text-center tracking-widest text-sm"
              />
              <button 
                onClick={() => { copyToClipboard('delete'); alert('Copied to clipboard'); }}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Copy
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button onClick={() => setDeleteModal(null)} className="w-full sm:flex-1 py-4 bg-white/5 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10">Abort</button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting || deleteInput !== 'delete'} 
                className="w-full sm:flex-1 py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'NUKE ORDER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}