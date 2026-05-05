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

  // ✨ UPDATED: Complimentary shipping threshold raised to Rs. 3000 ✨
  const shipping = cartItems.length > 0 ? (subtotal >= 3000 ? 0 : 250) : 0; 
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950 -z-20"></div>
        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Your Cart is Empty</h1>
          <p className="text-2xl md:text-3xl text-zinc-400 mb-12 font-light tracking-wide">Please add some items to your collection before proceeding to checkout.</p>
          <Link href="/market" className="px-12 py-6 bg-white text-black rounded-none font-black uppercase tracking-[0.3em] text-base hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-2xl">
            Return to Shop
          </Link>
        </div>
      </>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsProcessing(true);

    try {
      const newOrderId = "CIO-" + Math.random().toString(36).substring(2, 8).toUpperCase();
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
            items: cartItems, // Automatically includes color, customText, note
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

  // --- SUCCESS SCREEN WITH DIGITAL RECEIPT ---
  if (orderSuccess && completedOrder) {
    const waNumber = "923196514249";
    const waMessage = encodeURIComponent(`Hello CARTIO! 🚀\n\nI just placed an order on your website.\n\n*Order ID:* ${completedOrder.id}\n*Name:* ${completedOrder.name}\n*Total:* Rs. ${completedOrder.total.toLocaleString()}\n\nPlease confirm my order!`);
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    return (
      <>
        <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30 print:hidden"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20 print:hidden"></div>
        
        <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center animate-fade-in relative z-10 print:pt-0 print:bg-white print:text-black">
          <div className="max-w-3xl w-full">
            
            <div className="text-center mb-16 print:hidden">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-4 uppercase tracking-tighter">Order Confirmed</h1>
              <p className="text-2xl text-zinc-400 font-light tracking-wide">Your assets are being prepared for dispatch.</p>
            </div>

            <div className="bg-zinc-950/60 backdrop-blur-2xl border border-white/10 p-8 md:p-16 shadow-2xl mb-12 print:border-none print:shadow-none print:bg-white print:text-black">
              
              <div className="hidden print:flex items-center justify-center pb-10 border-b border-black">
                <h2 className="text-5xl font-black tracking-tighter uppercase">CARTIO</h2>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/10 print:border-black pb-8 mb-8">
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] mb-2 print:text-gray-500 font-bold">Order ID</p>
                  <p className="text-4xl md:text-5xl font-black text-white tracking-tighter print:text-black">{completedOrder.id}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] mb-2 print:text-gray-500 font-bold">Status</p>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse print:hidden"></span>
                    <span className="text-lg font-black text-purple-400 uppercase tracking-widest print:text-black">Processing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-lg font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 print:text-gray-500">Product Details</h3>
                  <div className="space-y-8">
                    {completedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-black flex items-center justify-center shrink-0 print:hidden border border-white/5">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                          </div>
                          <div>
                            <p className="text-xl md:text-2xl font-bold text-white print:text-black line-clamp-1 leading-none mb-1.5">{item.name}</p>
                            
                            {/* ✨ NEW: ROBUST DISPLAY COLORS & NOTES/ENGRAVING ON RECEIPT ✨ */}
                            {(item.color || item.customText || item.note) && (
                              <div className="flex flex-col gap-0.5 mb-1.5">
                                {item.color && (
                                  <p className="text-[10px] text-zinc-400 print:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    Finish: <span className="w-2.5 h-2.5 rounded-full border border-white/20 print:border-gray-300" style={{ backgroundColor: item.color }}></span>
                                  </p>
                                )}
                                {(item.customText || item.note) && (
                                  <p className="text-[10px] text-zinc-400 print:text-gray-500 uppercase tracking-widest">
                                    Name/Note: <span className="text-purple-400 print:text-black font-bold tracking-tight">"{item.customText || item.note}"</span>
                                  </p>
                                )}
                              </div>
                            )}

                            <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] print:text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white print:text-black">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 print:border-black pt-8 space-y-4">
                  <div className="flex justify-between text-xl text-zinc-400 print:text-gray-600 font-light tracking-wide">
                    <span>Subtotal</span>
                    <span>Rs. {completedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl text-zinc-400 print:text-gray-600 font-light tracking-wide">
                    <span>Logistics Fee</span>
                    <span className={completedOrder.shipping === 0 ? "text-purple-400 font-bold uppercase tracking-widest text-sm" : "text-white print:text-black"}>
                      {completedOrder.shipping === 0 ? 'Complimentary' : `Rs. ${completedOrder.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-6 mt-4 border-t border-white/5 print:border-black/10">
                    <span className="text-lg font-black text-zinc-500 uppercase tracking-[0.3em] print:text-gray-500">Total Valuation</span>
                    <span className="text-5xl md:text-6xl font-black text-white print:text-black tracking-tighter">Rs. {completedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white/5 print:bg-gray-50 p-8 grid grid-cols-1 md:grid-cols-2 gap-10 border border-white/5">
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] mb-4 font-black print:text-gray-500">Client Details</p>
                    <p className="text-xl text-white print:text-black font-bold uppercase tracking-widest mb-1">{completedOrder.name}</p>
                    <p className="text-lg text-zinc-400 print:text-gray-600 font-light tracking-wide mb-1">{completedOrder.phone}</p>
                    <p className="text-lg text-zinc-400 print:text-gray-600 font-light tracking-wide">{completedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] mb-4 font-black print:text-gray-500">Payment Protocol</p>
                    <p className="text-xl text-purple-400 print:text-black font-bold uppercase tracking-widest">{completedOrder.payment === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 print:hidden">
              <button onClick={() => window.print()} className="flex-1 py-6 md:py-8 bg-transparent text-white font-black text-sm uppercase tracking-[0.3em] rounded-none hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 border border-white group">
                <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export PDF Receipt
              </button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-6 md:py-8 bg-purple-600 text-white font-black text-sm uppercase tracking-[0.3em] rounded-none hover:bg-purple-500 transition-all flex items-center justify-center gap-4 group">
                Verify on WhatsApp
                <span className="text-xl leading-none group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- MAIN CHECKOUT SCREEN ---
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>

      <div className="min-h-screen pb-32 pt-24 md:pt-32 px-4 sm:px-8 relative z-10 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-16 md:mb-24 flex flex-col items-start gap-4">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">Secure Checkout</h1>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-base md:text-lg font-bold text-purple-400 uppercase tracking-[0.3em]">256-Bit SSL Encrypted</span>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            <div className="w-full lg:w-3/5 space-y-20">
              <section>
                <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-6">
                  <span className="text-sm font-black text-purple-500 uppercase tracking-[0.4em]">Step 01</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Client Contact</h2>
                </div>
                <div className="space-y-10">
                  <div>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                  <div className="flex items-end">
                    <span className="text-zinc-500 text-xl md:text-2xl py-5 pr-6 border-b border-white/20 font-light">+92</span>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Mobile Number" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-6">
                  <span className="text-sm font-black text-purple-500 uppercase tracking-[0.4em]">Step 02</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Delivery Coordinates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <div className="md:col-span-1">
                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="First Name" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                  <div className="md:col-span-1">
                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                  <div className="md:col-span-2">
                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Full Street Address" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                  <div className="md:col-span-1">
                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="City" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                  <div className="md:col-span-1">
                    <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" placeholder="Postal Code (Optional)" className="w-full bg-transparent border-b border-white/20 text-white text-xl md:text-2xl py-5 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light tracking-wide rounded-none" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-6">
                  <span className="text-sm font-black text-purple-500 uppercase tracking-[0.4em]">Step 03</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Payment Protocol</h2>
                </div>
                <div className="space-y-8">
                  
                  <label className={`block cursor-pointer border p-8 transition-all duration-300 rounded-none ${paymentMethod === 'cod' ? 'bg-purple-500/10 border-purple-500' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                    <div className="flex items-center gap-8">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'cod' ? 'border-purple-500' : 'border-zinc-600'}`}>
                        {paymentMethod === 'cod' && <div className="w-4 h-4 bg-purple-500 rounded-full"></div>}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white uppercase tracking-widest">Cash on Delivery</h4>
                        <p className="text-lg text-zinc-500 font-light tracking-wide mt-2">Settle your balance upon physical receipt of goods.</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" value="cod" className="hidden" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  </label>

                  <label className={`block cursor-pointer border p-8 transition-all duration-300 rounded-none ${paymentMethod === 'card' ? 'bg-white/10 border-white' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                    <div className="flex items-center gap-8">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'card' ? 'border-white' : 'border-zinc-600'}`}>
                        {paymentMethod === 'card' && <div className="w-4 h-4 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-2xl font-bold text-white uppercase tracking-widest">Credit / Debit</h4>
                          <div className="flex gap-4">
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Visa</span>
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Mastercard</span>
                          </div>
                        </div>
                        <p className="text-lg text-zinc-500 font-light tracking-wide mt-2">Secure digital payment via external gateway.</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" value="card" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  </label>

                </div>
              </section>
            </div>

            <div className="w-full lg:w-2/5">
              <div className="sticky top-32 bg-zinc-950/60 backdrop-blur-2xl border border-white/10 p-10 md:p-14 shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tighter border-b border-white/10 pb-8">Ledger Summary</h2>
                
                <div className="space-y-8 mb-12 max-h-96 overflow-y-auto custom-scrollbar pr-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-8">
                      <div className="w-24 h-24 bg-black flex items-center justify-center flex-shrink-0 relative border border-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-3 opacity-90" />
                        <span className="absolute -top-3 -right-3 w-8 h-8 bg-white text-black text-xs font-black rounded-full flex items-center justify-center z-10 shadow-lg">{item.quantity}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight line-clamp-2 mb-1.5 leading-tight">{item.name}</h4>
                        
                        {/* ✨ NEW: ROBUST DISPLAY COLORS & NOTES IN SUMMARY ✨ */}
                        {(item.color || item.customText || item.note) && (
                          <div className="flex flex-col gap-1 mb-3 border-l-2 border-purple-500/30 pl-3">
                            {item.color && (
                              <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                Finish: <span className="w-3 h-3 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: item.color }}></span>
                              </span>
                            )}
                            {(item.customText || item.note) && (
                              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                                Name/Note: <span className="text-purple-400 font-bold tracking-tight">"{item.customText || item.note}"</span>
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-xl font-light text-zinc-300">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-white/10 pt-10 mb-12">
                  <div className="flex justify-between text-xl text-zinc-400 font-light tracking-wide">
                    <span>Subtotal</span>
                    <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl text-zinc-400 font-light tracking-wide items-center">
                    <span>Logistics Fee</span>
                    <span className={shipping === 0 ? "text-purple-400 font-bold uppercase tracking-[0.2em] text-[10px]" : "text-white"}>
                      {shipping === 0 ? "Complimentary" : `Rs. ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-8 mt-4">
                    <span className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em]">Total Valuation</span>
                    <span className="text-5xl font-black text-white tracking-tighter">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-8 font-black text-sm md:text-base uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-6 group rounded-none ${isProcessing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-purple-600 hover:text-white'}`}
                >
                  {isProcessing ? (
                    <>
                      <span className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Assets</span>
                      <span className="group-hover:translate-x-3 transition-transform text-2xl leading-none">→</span>
                    </>
                  )}
                </button>
                
                <p className="text-[10px] text-zinc-500 text-center mt-8 uppercase tracking-[0.3em] leading-loose">
                  By confirming this transaction, you accept <br/> CARTIO's Terms of Service and Privacy Protocol.
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}