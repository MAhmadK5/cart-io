"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; // Import the brain!

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Pull live data straight from the brain!
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  useEffect(() => {
    const handleOpenCart = (e: Event) => {
      e.stopPropagation(); 
      setIsOpen(true);
    };
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[9999] ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      
      <div 
        className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out pointer-events-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            Your Cart
            <span className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-[10px] rounded-full">
              {cartItems.length}
            </span>
          </h2>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-500 transition-colors relative z-50"
          >
            <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Your cart is empty.</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                className="text-blue-400 text-sm hover:text-white transition-colors relative z-50"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-zinc-900 p-3 rounded-2xl border border-zinc-800">
                
                <div className="w-20 h-20 bg-black rounded-xl overflow-hidden relative border border-zinc-800 shrink-0">
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                </div>
                
                <div className="flex flex-col justify-between flex-1 py-1 relative z-10">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">{item.category}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} 
                        className="text-zinc-500 hover:text-red-500 transition-colors p-1 relative z-50"
                      >
                        <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight mt-1 pr-4 line-clamp-1">{item.name}</h3>
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
                    <div className="flex items-center bg-black border border-zinc-800 rounded-lg px-2 py-1 relative z-50">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }} 
                        className="text-zinc-400 hover:text-white px-2 transition-colors"
                      >-</button>
                      <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }} 
                        className="text-zinc-400 hover:text-white px-2 transition-colors"
                      >+</button>
                    </div>
                    <p className="text-sm font-black text-white">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-950 shrink-0 relative z-50">
            <div className="space-y-3 mb-6 relative z-10">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Shipping</span>
                <span className="text-orange-400 font-medium text-xs tracking-wider uppercase">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <span className="text-sm font-black text-white uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); window.location.href = '/checkout'; }}
              className="w-full block py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-500 hover:text-white transition-all relative z-[100] cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              <div className="flex items-center justify-center gap-3 w-full h-full pointer-events-none">
                <span>Proceed to Checkout</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}