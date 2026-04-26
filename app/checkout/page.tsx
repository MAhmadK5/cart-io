"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext'; // ✨ Import the Brain!

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shipping = 250; // Standard PKR delivery fee
  const total = subtotal + (cartItems.length > 0 ? shipping : 0);

  // If the cart is empty (and they haven't just placed an order), show an empty state
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

  // Handle the Order Submission
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page refresh
    
    setIsProcessing(true);

    // Simulate a secure network request (2 seconds)
    setTimeout(() => {
      // 1. Generate a fake order ID
      const newOrderId = "GBZ-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setOrderId(newOrderId);
      
      // 2. Clear the cart (The brain resets!)
      clearCart();
      
      // 3. Show the success screen
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 2000);
  };

  // --- SUCCESS SCREEN ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center animate-fade-in">
        <div className="max-w-xl w-full bg-zinc-900/40 backdrop-blur-md border border-green-500/30 p-10 rounded-[2rem] text-center shadow-[0_0_50px_rgba(34,197,94,0.1)]">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-widest">Order Confirmed</h1>
          <p className="text-zinc-400 mb-8">Your premium assets are being prepared for deployment.</p>
          
          <div className="bg-black/50 border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Order Identifier</p>
            <p className="text-xl font-mono text-white mb-4">{orderId}</p>
            
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Payment Method</p>
            <p className="text-sm font-bold text-white uppercase tracking-wider">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
          </div>

          <Link href="/" className="inline-block w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
            Return to Dashboard
          </Link>
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

        {/* Note the <form> wrapper here so hitting 'Enter' submits it! */}
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
          
          {/* --- LEFT COLUMN: FORMS --- */}
          <div className="w-full lg:w-3/5 space-y-10">
            
            {/* Contact Info */}
            <section className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input required type="email" placeholder="you@example.com" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className="flex">
                    <span className="bg-zinc-800 border-y border-l border-zinc-800 text-zinc-400 rounded-l-xl py-3 px-4 flex items-center text-sm">+92</span>
                    <input required type="tel" placeholder="300 1234567" className="w-full bg-black/50 border border-zinc-800 text-white rounded-r-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">First Name</label>
                  <input required type="text" placeholder="Ali" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input required type="text" placeholder="Khan" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Address</label>
                  <input required type="text" placeholder="House 123, Street 4, Sector F-8" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">City</label>
                  <input required type="text" placeholder="Islamabad" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Postal Code</label>
                  <input type="text" placeholder="44000" className="w-full bg-black/50 border border-zinc-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
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
                  {/* Hidden radio button to link state */}
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

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-32 bg-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Order Summary</h2>
              
              {/* REAL Items List from CartContext */}
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

              {/* Totals */}
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

              {/* Submit Button with Processing State */}
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