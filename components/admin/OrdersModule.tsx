"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function OrdersModule() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [metrics, setMetrics] = useState({ revenue: 0, pending: 0, total: 0, aov: 0 });
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

  // ✨ MODAL STATES ✨
  const [infoModalOrder, setInfoModalOrder] = useState<any | null>(null);
  
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean; orderId: number; newStatus: string; oldStatus: string;
  } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // ✨ NEW: TRACKING INPUT STATE ✨
  const [trackingInput, setTrackingInput] = useState("");

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

  const handleStatusChangeRequest = (orderId: number, newStatus: string, oldStatus: string) => {
    if (newStatus === oldStatus) return;
    setTrackingInput(""); // Reset tracking input on open
    setStatusModal({ isOpen: true, orderId, newStatus, oldStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusModal) return;
    
    // ✨ REQUIRE TRACKING IF DISPATCHED ✨
    if (statusModal.newStatus === 'Dispatched' && !trackingInput.trim()) {
      alert("Please provide the M&P Tracking Number to dispatch this order.");
      return;
    }

    setIsUpdatingStatus(true);
    
    const { orderId, newStatus } = statusModal;
    const targetOrder = orders.find(o => o.id === orderId);
    const trackingNo = newStatus === 'Dispatched' ? trackingInput.trim() : targetOrder.tracking_number;

    // 1. Update local UI state
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, tracking_number: trackingNo } : o));
    setMetrics(prev => ({ ...prev, pending: newStatus === 'Processing' ? prev.pending + 1 : prev.pending - 1 }));
    
    // 2. Update Supabase
    const updatePayload: any = { status: newStatus };
    if (newStatus === 'Dispatched') updatePayload.tracking_number = trackingNo;
    await supabase.from('orders').update(updatePayload).eq('id', orderId);

    // 3. Trigger Email API with Tracking Payload
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
            trackingNumber: newStatus === 'Dispatched' ? trackingNo : null
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

  // ✨ UPDATED WHATSAPP MESSAGE WITH TRACKING ✨
  const getOrderMessage = (order: any) => {
    let text = "";
    switch(order.status) {
      case 'Processing':
        text = `Hello ${order.customer_name}! 🚀\n\nThank you for choosing CARTIO. Your order (${order.order_id}) is currently being prepared by our team. We will notify you the moment it dispatches!`;
        break;
      case 'Dispatched':
        text = `Hello ${order.customer_name}! 📦\n\nGreat news! Your CARTIO order (${order.order_id}) has been successfully dispatched via M&P Courier.\n\n*Tracking Number:* ${order.tracking_number || 'N/A'}\n*Track Here:* https://mulphilog.com/tracking/`;
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
              ${order.tracking_number ? `<strong>M&P Tracking</strong><p>${order.tracking_number}</p>` : ''}
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
    <div className="w-full max-w-full overflow-hidden pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="flex-1 w-full overflow-hidden">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase break-words w-full">Order Records</h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base md:text-lg font-light tracking-wide">{activeTab === 'All' ? 'Showing all incoming orders.' : `Currently viewing: ${activeTab}`}</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-xs md:text-sm font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl w-full md:w-auto shrink-0">
          Refresh Data
        </button>
      </div>

      {/* UNIVERSAL TABS */}
      <div className="w-full overflow-x-auto custom-scrollbar mb-8 pb-4">
        <div className="flex gap-2 min-w-max">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 px-5 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-zinc-900/50 text-zinc-500 hover:text-white border border-transparent'}`}>
              {tab}
              <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <p className="text-[10px] sm:text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-2 sm:mb-3 relative z-10">Total Revenue</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter truncate">Rs. {metrics.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden">
          <p className="text-[10px] sm:text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-2 sm:mb-3">Avg Order Value</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter truncate">Rs. {metrics.aov.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden">
          <p className="text-[10px] sm:text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-2 sm:mb-3">Total Orders</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter truncate">{metrics.total}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-red-500/20 p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden">
          <p className="text-[10px] sm:text-xs md:text-sm font-black text-red-400 uppercase tracking-widest mb-2 sm:mb-3">Action Required</p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
            {metrics.pending}
            {metrics.pending > 0 && <span className="relative flex h-3 w-3 sm:h-4 sm:w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span></span>}
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      {loadingOrders ? (
        <div className="space-y-6 w-full">{[1, 2, 3].map(i => <div key={i} className="h-40 w-full bg-zinc-900/40 backdrop-blur-md rounded-3xl animate-pulse border border-white/5"></div>)}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="w-full bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 sm:p-16 text-center">
          <p className="text-zinc-500 text-xs sm:text-sm font-light tracking-widest uppercase">No orders found in this category.</p>
        </div>
      ) : filteredOrders.map((order) => (
        <div key={order.id} className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 flex flex-col xl:flex-row gap-8 lg:gap-10 shadow-2xl relative overflow-hidden transition-all duration-300 mb-8 group">
          <div className={`absolute left-0 top-0 bottom-0 w-2 sm:w-3 transition-colors ${order.status === 'Processing' ? 'bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.8)]' : order.status === 'Dispatched' ? 'bg-blue-500' : order.status === 'Delivered' ? 'bg-white' : 'bg-red-500'}`}></div>
          
          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-[10px] sm:text-xs font-black text-black bg-white px-3 sm:px-4 py-1.5 rounded-lg tracking-widest uppercase">ID: {order.order_id}</span>
                <span className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-wide">{new Date(order.created_at).toLocaleString()}</span>
                {/* ✨ SHOW TRACKING NUMBER ON CARD ✨ */}
                {order.tracking_number && (
                  <span className="text-[10px] sm:text-xs font-black text-[#F4AA41] bg-[#F4AA41]/10 border border-[#F4AA41]/20 px-3 sm:px-4 py-1.5 rounded-lg tracking-widest uppercase flex items-center gap-1.5">
                    <svg viewBox="0 0 72 72" className="w-4 h-4"><path fill="currentColor" stroke="none" d="M10.921,22.5547l-4.0185,2.0136l-2.5423,1.7802l-0.8686,2.7256l-1.4696,4.1912l1.8157,2.3282l5.8333-1.5797 l1.6224,1.5797l3.6707,1.9249l1.2487,4.3261l-4.0418,3.9438l-1.4167,4.3797l0.539,2.6654l2.8043,2.3565l3.0014-2.8463 c0,0-0.5245-3.0007,0.9404-4.3388c1.4649-1.3381,3.3757-3.7385,3.3757-3.7385v8.4005l0.6012,2.5443l2.2353,0.4577l1.3519-1.8344 l1.4614-12.9224l2.2658,0.2907l5.9944,0.5474l4.2084-2.0965l1.1374,4.6127l3.6984,3.7385l-0.79,4.7548l1.175,2.2688l2.5399-1.4963 l2.3975-4.1153v-3.6284l-4.1458-4.0474l7.6544,5.3456l2.7721,1.7794l0.7162,5.8899l1.9164,0.9706l1.8163-1.4347l-0.7805-9.0342 L57.9183,43.88l-3.4836-5.7002l0.2779-4.3048l-0.5946-5.3399c-3.7098-1.924-7.58-2.9066-11.6334-2.8146l-8.4753-0.0539 l-7.4206,0.5278l-4.8427-1.3913l-6.8252-0.2347l-1.6817-1.3828L10.921,22.5547z"/></svg>
                    M&P: {order.tracking_number}
                  </span>
                )}
              </div>
              <button 
                onClick={() => handleDeleteRequest(order.id)} 
                className="lg:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                title="Nuke Order"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            
            <div className="w-full">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 w-full">
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase break-words overflow-hidden ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>{order.customer_name}</h3>
                {/* ✨ "i" INFO BUTTON ✨ */}
                <button 
                  onClick={() => setInfoModalOrder(order)} 
                  className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full border border-white/20 text-zinc-400 hover:text-white hover:border-white hover:bg-white/10 flex items-center justify-center transition-all mt-1 sm:mt-0"
                  title="View Client Dossier"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-light break-words">{order.shipping_address}, {order.city} {order.postal_code}</p>
            </div>
            
            {/* ✨ RESPONSIVE ACTION BUTTONS ✨ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 sm:pt-4 w-full">
              <button onClick={() => printReceipt(order)} className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white hover:bg-zinc-300 text-black rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                <span className="truncate">Print Receipt</span>
              </button>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${order.customer_email}&su=${encodeURIComponent(`Update on your CARTIO Order ${order.order_id}`)}&body=${getOrderMessage(order)}`} target="_blank" rel="noopener noreferrer" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black border border-white/10 hover:border-white/30 hover:bg-white hover:text-black rounded-xl text-[10px] sm:text-xs font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span className="truncate">Email</span>
              </a>
              <a href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${getOrderMessage(order)}`} target="_blank" rel="noopener noreferrer" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#0b141a] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black rounded-xl text-[10px] sm:text-xs font-black text-[#25D366] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                <span className="truncate">WhatsApp</span>
              </a>
            </div>
          </div>
          
          <div className="w-full xl:w-2/5 bg-black rounded-[1.5rem] p-5 sm:p-6 md:p-8 border border-white/5 overflow-hidden">
            <p className="text-[10px] sm:text-xs font-black text-purple-400 uppercase tracking-widest mb-4 sm:mb-6">Order Items</p>
            <div className="space-y-4 sm:space-y-5 max-h-48 sm:max-h-56 overflow-y-auto custom-scrollbar pr-2 sm:pr-4 w-full">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className={`flex gap-3 sm:gap-4 items-start w-full ${order.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                  <img src={item.image} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-contain bg-zinc-900 border border-white/5 p-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base text-zinc-300 leading-tight mb-1 truncate"><span className="font-black text-white mr-1.5 sm:mr-2">{item.quantity}x</span> {item.name}</p>
                    {(item.color || item.customText || item.note) && (
                      <div className="flex flex-col gap-1 border-l-2 border-purple-500/30 pl-2 mt-1 w-full overflow-hidden">
                        {item.color && (
                          <span className="text-[8px] sm:text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            Finish: <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: item.color }}></span>
                          </span>
                        )}
                        {(item.customText || item.note) && (
                          <span className="text-[8px] sm:text-[9px] text-zinc-500 uppercase tracking-widest truncate block w-full">
                            Note: <span className="text-purple-400 font-bold">"{item.customText || item.note}"</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* ✨ DISCOUNT DISPLAY ON ADMIN PANEL ✨ */}
            {(order.discount_amount && order.discount_amount > 0) && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">Promo ({order.discount_code})</span>
                <span className="text-sm font-bold text-purple-400">- Rs. {order.discount_amount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="w-full xl:w-64 flex flex-col sm:flex-row xl:flex-col justify-between items-start sm:items-center xl:items-stretch border-t xl:border-t-0 xl:border-l border-white/10 pt-6 xl:pt-0 xl:pl-10 mt-2 xl:mt-0 gap-6 xl:gap-0">
            <div>
              <p className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest mb-1 sm:mb-2">Total</p>
              <p className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>Rs. {order.total_amount.toLocaleString()}</p>
            </div>
            <div className="w-full sm:w-1/2 xl:w-full xl:mt-8">
              <select 
                value={order.status} 
                onChange={(e) => handleStatusChangeRequest(order.id, e.target.value, order.status)} 
                className={`w-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl py-4 sm:py-5 px-3 sm:px-4 outline-none cursor-pointer appearance-none text-center transition-all ${
                  order.status === 'Processing' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                  order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                  order.status === 'Delivered' ? 'bg-white/20 text-white border border-white/50' :
                  'bg-red-500/20 text-red-400 border border-red-500/50'
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

      {/* ========================================= */}
      {/* ✨ 1. CUSTOMER INFO DOSSIER MODAL ✨ */}
      {/* ========================================= */}
      {infoModalOrder && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setInfoModalOrder(null)}></div>
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-lg p-6 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setInfoModalOrder(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            
            <div className="mb-8 sm:mb-10 pr-10">
              <p className="text-[9px] sm:text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-1 sm:mb-2">Client Dossier</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none break-words">{infoModalOrder.customer_name}</h2>
            </div>

            <div className="space-y-6 sm:space-y-8 border-t border-white/10 pt-6 sm:pt-8">
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Encrypted Email</p>
                <p className="text-base sm:text-lg text-white font-medium break-all">{infoModalOrder.customer_email}</p>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Direct Line</p>
                <p className="text-base sm:text-lg text-white font-medium">{infoModalOrder.customer_phone}</p>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Destination Coordinates</p>
                <p className="text-base sm:text-lg text-white font-medium leading-snug break-words">{infoModalOrder.shipping_address}<br/>{infoModalOrder.city} {infoModalOrder.postal_code}</p>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Payment Protocol</p>
                <p className="text-base sm:text-lg text-purple-400 font-black uppercase tracking-widest">{infoModalOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Digital/Card'}</p>
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
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-md p-6 sm:p-10 shadow-2xl text-center">
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 border border-blue-500/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-4">Confirm Status Change</h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mb-6">
              You are moving this order from <span className="font-bold text-white">{statusModal.oldStatus}</span> to <span className="font-bold text-purple-400">{statusModal.newStatus}</span>. 
            </p>

            {/* ✨ NEW: M&P TRACKING INPUT REQUIRED FOR DISPATCH ✨ */}
            {statusModal.newStatus === 'Dispatched' && (
              <div className="mb-6 text-left">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2 block">M&P Tracking Number <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. 1234567890" 
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono tracking-widest text-sm"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
              <button onClick={() => setStatusModal(null)} className="w-full sm:flex-1 py-3 sm:py-4 bg-zinc-900 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={confirmStatusChange} disabled={isUpdatingStatus} className="w-full sm:flex-1 py-3 sm:py-4 bg-purple-600 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-purple-500 transition-colors disabled:opacity-50 flex justify-center items-center">
                {isUpdatingStatus ? <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Dispatch Update'}
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
          <div className="relative bg-zinc-950 border border-red-500/30 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-md p-6 sm:p-10 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center">
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20"></span>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-red-500 uppercase tracking-tighter mb-4">CRITICAL WARNING</h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mb-6 sm:mb-8">
              You are about to permanently eradicate Order #{deleteModal.orderId} from the ledger. This action is irreversible.
              <br/><br/>
              To proceed, please type <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded text-white font-bold tracking-widest">delete</span> below.
            </p>

            <div className="flex items-center gap-2 mb-6 sm:mb-8 bg-black/50 p-2 rounded-xl border border-red-500/20 focus-within:border-red-500 transition-colors">
              <input 
                type="text" 
                placeholder="Type here..." 
                value={deleteInput} 
                onChange={(e) => setDeleteInput(e.target.value)}
                className="flex-1 w-full bg-transparent text-white px-2 sm:px-4 py-2 outline-none font-mono text-center tracking-widest text-sm"
              />
              <button 
                onClick={() => { copyToClipboard('delete'); alert('Copied to clipboard'); }}
                className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 shrink-0"
                title="Copy the word 'delete'"
              >
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Copy
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => setDeleteModal(null)} className="w-full sm:flex-1 py-3 sm:py-4 bg-zinc-900 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">Abort</button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting || deleteInput !== 'delete'} 
                className="w-full sm:flex-1 py-3 sm:py-4 bg-red-600 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isDeleting ? <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'NUKE ORDER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}