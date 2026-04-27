"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext'; 
import { supabase } from '../../lib/supabase'; 

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const shipping = 250; 
  const total = subtotal + (cartItems.length > 0 ? shipping : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-6">
          <svg className="w-12 h-12 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-widest">Cart is Empty</h1>
        <p className="text-zinc-400 mb-8 max-w-md">You need to add items to your cart before you can proceed to secure checkout.</p>
        <Link href="/market" className="px-8 py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Return to Market
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsProcessing(true);

    try {
      const newOrderId = "GBZ-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const customerName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            order_id: newOrderId,
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_name: customerName,
            shipping_address: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            payment_method: paymentMethod,
            subtotal: subtotal,
            shipping_fee: shipping,
            total_amount: total,
            items: cartItems,
            status: 'Processing'
          }
        ]);

      if (error) throw error;

      setCompletedOrder({
        id: newOrderId,
        name: customerName,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        items: [...cartItems],
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        payment: paymentMethod
      });

      clearCart();
      setOrderSuccess(true);

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to securely process your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SUCCESS SCREEN WITH RECEIPT ---
  if (orderSuccess && completedOrder) {
    const waNumber = "923196514249";
    const waMessage = encodeURIComponent(`Hello GOBAAZAAR! 🚀\n\nI just placed an order on your website.\n\n*Order ID:* ${completedOrder.id}\n*Name:* ${completedOrder.name}\n*Total:* Rs. ${completedOrder.total.toLocaleString()}\n\nPlease confirm my order!`);
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center animate-fade-in print:pt-0 print:bg-black">
        <div className="max-w-2xl w-full">
          
          {/* Header (Hidden in Print) */}
          <div className="text-center mb-10 print:hidden">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-widest">Order Confirmed</h1>
            <p className="text-zinc-400">Your premium assets are being prepared for deployment.</p>
          </div>

          {/* Digital Receipt (This is what prints) */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl mb-8 print:border-none print:shadow-none print:bg-black print:text-white">
            
            {/* GOBAAZAAR Logo for Print only */}
            <div className="hidden print:flex items-center justify-center py-6 border-b border-white/10">
              <h2 className="text-2xl font-black tracking-widest uppercase">GOBAAZAAR</h2>
            </div>

            <div className="bg-black/50 p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Order Identifier</p>
                <p className="text-2xl font-mono font-bold text-white tracking-wider">{completedOrder.id}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse print:hidden"></span>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Processing</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Items Ledger WITH IMAGES */}
              <div>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 pb-3 mb-6">Asset Ledger</h3>
                <div className="space-y-6">
                  {completedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        {/* 🖼️ Product Image Thumbnail */}
                        <div className="w-14 h-14 bg-black rounded-xl overflow-hidden relative border border-zinc-800 shrink-0">
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-mono text-white">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-dashed border-zinc-700 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">Rs. {completedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Shipping</span>
                  <span className="font-mono">Rs. {completedOrder.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                  <span className="text-sm font-black text-white uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-black text-orange-400 font-mono">Rs. {completedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Logistics Summary */}
              <div className="bg-black/50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-white/5">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Delivery Protocol</p>
                  <p className="text-sm text-zinc-300 font-medium">{completedOrder.name}</p>
                  <p className="text-sm text-zinc-500 mt-1">{completedOrder.phone}</p>
                  <p className="text-sm text-zinc-500 mt-1">{completedOrder.address}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Payment Method</p>
                  <p className="text-sm text-white font-medium uppercase tracking-wider">{completedOrder.payment === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden when generating PDF) */}
          <div className="flex flex-col sm:flex-row gap-4 print:hidden">
            
            {/* Download Receipt Button */}
            <button 
              onClick={() => window.print()}
              className="flex-1 py-4 bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-zinc-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Save Receipt
            </button>

            {/* WhatsApp Notify */}
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 bg-[#25D366] text-zinc-950 font-black text-xs uppercase tracking-[0.1em] rounded-2xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.2)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              WhatsApp Us
            </a>
          </div>
          
          <div className="mt-4 print:hidden">
            <Link 
              href="/market" 
              className="w-full py-4 bg-transparent border border-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center text-center"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // --- CHECKOUT SCREEN ---
  return (
    <div className="min-h-screen pb-24 pt-12 md:pt-20 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Secure Checkout</h1>
            <p className="text-zinc-400">Complete your order to receive your premium assets.</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full w-fit mx-auto md:mx-0">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
          
          <div className="w-full lg:w-3/5 space-y-10">
            
            <section className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="you@example.com" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className="flex">
                    <span className="bg-zinc-800 border-y border-l border-zinc-800 text-zinc-400 rounded-l-xl py-3 px-4 flex items-center text-sm">+92</span>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="300 1234567" className="w-full bg-black/50 border border-zinc-800 text-white rounded-r-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="Ali" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Khan" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Address</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="House 123, Street 4, Sector F-8" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Islamabad" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Postal Code</label>
                  <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" placeholder="44000" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
            </section>

            <section className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">3</span>
                Payment Options
              </h2>
              <div className="space-y-4">
                
                <label className={`block cursor-pointer border rounded-xl p-4 transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-black/50 border-zinc-800 hover:border-zinc-600'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-orange-500' : 'border-zinc-600'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Cash on Delivery (COD)</h4>
                      <p className="text-xs text-zinc-500 mt-1">Pay when you receive your order at your doorstep.</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="cod" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                </label>

                <label className={`block cursor-pointer border rounded-xl p-4 transition-all duration-300 ${paymentMethod === 'card' ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-black/50 border-zinc-800 hover:border-zinc-600'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-500' : 'border-zinc-600'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-bold">Credit / Debit Card</h4>
                        <div className="flex gap-2">
                          <div className="w-8 h-5 bg-zinc-800 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                          <div className="w-8 h-5 bg-zinc-800 rounded flex items-center justify-center text-[8px] font-bold text-white">MC</div>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Secure payment via PayFast / Stripe.</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="card" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                </label>

              </div>
            </section>
          </div>

          <div className="w-full lg:w-2/5">
            <div className="sticky top-32 bg-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-900 rounded-xl overflow-hidden relative border border-zinc-800 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-zinc-700 z-10">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-white">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/5 pt-6 mb-6">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Shipping (Nationwide)</span>
                  <span className="text-white">Rs. {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                  <span className="text-lg font-black text-white uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black text-orange-400">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group ${isProcessing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-orange-500 hover:text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]'}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-zinc-500 text-center mt-4 uppercase tracking-widest leading-relaxed">
                By placing this order, you agree to GOBAAZAAR's <br/> Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}