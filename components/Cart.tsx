"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; 

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleNuclearCheckout = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.assign('/checkout');
  };

  return (
    <div className={`fixed inset-0 z-[99999] ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
      
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`absolute top-0 right-0 h-full w-full sm:w-[450px] md:w-[500px] bg-zinc-950/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        {/* HEADER */}
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-white/10 shrink-0 relative z-10">
          <div>
            <p className="text-[10px] text-purple-500 font-bold uppercase tracking-[0.4em] mb-1.5">CARTIO's CART</p>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-3">
              Your Collection
              <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-purple-500 text-white text-xs md:text-sm rounded-full">
                {cartItems.length}
              </span>
            </h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-black hover:bg-white transition-all z-50 group"
          >
            <svg className="w-5 h-5 pointer-events-none group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar relative z-10">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-2">
                <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Cart is Empty</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="mt-4 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-none hover:bg-purple-600 hover:text-white transition-all"
              >
                Return to SHOP
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              // We grab the unique ID so the +/- and Trash buttons target the exact variation
              const uniqueId = item.cartItemId || item.id;
              
              return (
                <div key={uniqueId} className="flex flex-row gap-4 bg-black/40 p-4 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black overflow-hidden relative border border-white/10 shrink-0 flex items-center justify-center rounded-lg">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[8px] sm:text-[9px] text-purple-400 font-bold uppercase tracking-[0.3em]">{item.category}</p>
                        <button 
                          onClick={() => removeFromCart(uniqueId)} 
                          className="text-zinc-500 hover:text-red-500 transition-colors p-1 z-50 -mt-1 -mr-1"
                        >
                          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight pr-4 line-clamp-2 leading-snug mb-1">{item.name}</h3>
                      
                      {(item.color || item.customText || item.note) && (
                        <div className="flex flex-col gap-0.5 mt-1">
                          {item.color && (
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                              Finish: <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: item.color }}></span>
                            </span>
                          )}
                          {(item.customText || item.note) && (
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                              Name/Note: <span className="text-purple-400 font-bold tracking-tight">"{item.customText || item.note}"</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center bg-transparent border border-white/20 rounded-md px-1.5 py-0.5 z-50">
                        <button 
                          onClick={() => updateQuantity(uniqueId, item.quantity - 1)} 
                          className="text-zinc-400 hover:text-white px-2 py-0.5 text-lg transition-colors leading-none"
                        >-</button>
                        <span className="text-xs sm:text-sm font-black text-white px-2">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(uniqueId, item.quantity + 1)} 
                          className="text-zinc-400 hover:text-white px-2 py-0.5 text-lg transition-colors leading-none"
                        >+</button>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-white tracking-widest">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div 
            className="p-6 md:p-8 border-t border-white/10 bg-black/90 shrink-0 relative z-[1000]"
            style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
          >
            <div className="space-y-3 mb-6 relative z-10 pointer-events-none">
              <div className="flex justify-between text-sm md:text-base text-zinc-400 font-light tracking-wide">
                <span>Subtotal</span>
                <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base text-zinc-400 font-light tracking-wide">
                <span>Shipping</span>
                <span className="text-purple-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-1">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/10">
                <span className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Total Value</span>
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div 
              onTouchEnd={handleNuclearCheckout}
              onClick={handleNuclearCheckout}
              className="w-full flex items-center justify-center gap-3 py-6 bg-white text-black font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-none hover:bg-purple-600 hover:text-white transition-colors duration-300 relative z-[99999] cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              style={{ pointerEvents: 'auto', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              Secure Checkout
              <span className="text-lg leading-none">→</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}