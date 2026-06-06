"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; 

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  // ✨ FLAT SHIPPING LOGIC ✨
  const shippingFee = cartItems.length > 0 ? 300 : 0;
  const totalValue = subtotal + shippingFee;

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
      
      {/* ✨ TAPPABLE DARK BLUR BACKDROP ✨ */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* ✨ TRUE SIDE DRAWER ✨ */}
      <div className={`absolute top-0 right-0 w-[75vw] sm:w-[400px] lg:w-[450px] h-full bg-zinc-950/95 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        {/* HEADER */}
        <div className="flex flex-col p-4 sm:p-6 md:p-8 pt-6 md:pt-8 border-b border-white/10 shrink-0 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] text-purple-500 font-bold uppercase tracking-[0.4em] mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                CARTIO's CART
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none flex items-center gap-2 sm:gap-3">
                Your Arsenal
                <span className="flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 bg-purple-500 text-white text-[10px] sm:text-xs rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  {cartItems.length}
                </span>
              </h2>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-black hover:bg-white transition-all z-50 group shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 custom-scrollbar relative z-10">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-2 relative">
                <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-ping opacity-20"></div>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Your cart is empty</h3>
              <p className="text-zinc-500 text-[10px] sm:text-xs tracking-widest uppercase font-light -mt-2">Deploy assets to begin checkout.</p>
              <button 
                onClick={() => setIsOpen(false)} 
                className="mt-2 sm:mt-4 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] rounded-xl sm:rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Return to Shop
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const uniqueId = item.cartItemId || item.id;
              
              return (
                <div key={uniqueId} className="flex flex-row gap-3 bg-black/40 p-3 rounded-xl sm:rounded-2xl border border-white/5 group hover:border-white/20 hover:bg-white/5 transition-all">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-zinc-950 overflow-hidden relative border border-white/10 shrink-0 flex items-center justify-center rounded-lg sm:rounded-xl shadow-inner">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-0.5 sm:py-1 pr-1">
                    <div>
                      <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                        <p className="text-[7px] sm:text-[9px] text-purple-400 font-bold uppercase tracking-[0.3em] truncate pr-2">{item.category}</p>
                        <button 
                          onClick={() => removeFromCart(uniqueId)} 
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shrink-0"
                        >
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-tight line-clamp-2 leading-tight mb-1">{item.name}</h3>
                      
                      {(item.color || item.customText || item.note) && (
                        <div className="flex flex-col gap-1 mt-1 sm:mt-1.5 border-l-2 border-purple-500/30 pl-2">
                          {item.color && (
                            <span className="text-[7px] sm:text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                              Finish: <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/20" style={{ backgroundColor: item.color }}></span>
                            </span>
                          )}
                          {(item.customText || item.note) && (
                            <span className="text-[7px] sm:text-[9px] text-zinc-400 uppercase tracking-widest truncate max-w-[120px] sm:max-w-[180px]">
                              Note: <span className="text-white font-bold tracking-tight">"{item.customText || item.note}"</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-between mt-2 sm:mt-3">
                      <div className="flex items-center bg-black border border-white/10 rounded-md sm:rounded-lg overflow-hidden shadow-inner">
                        <button 
                          onClick={() => updateQuantity(uniqueId, item.quantity - 1)} 
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                        >-</button>
                        <span className="w-5 sm:w-8 text-center text-[10px] sm:text-sm font-black text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(uniqueId, item.quantity + 1)} 
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                        >+</button>
                      </div>
                      <p className="text-[11px] sm:text-sm md:text-base font-black text-white tracking-widest">Rs. {(item.price * item.quantity).toLocaleString()}</p>
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
            className="p-4 sm:p-5 md:p-8 border-t border-white/10 bg-black/95 backdrop-blur-2xl shrink-0 relative z-[1000] pb-6 sm:pb-8 md:pb-8"
          >
            <div className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-6 relative z-10 pointer-events-none">
              <div className="flex justify-between text-[10px] sm:text-xs md:text-sm text-zinc-400 font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs md:text-sm text-zinc-400 font-bold uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-purple-400 font-black">Rs. {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-2 sm:pt-4 border-t border-white/10 mt-2 sm:mt-4">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Total Value</span>
                <span className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tighter">Rs. {totalValue.toLocaleString()}</span>
              </div>
            </div>

            <div 
              onTouchEnd={handleNuclearCheckout}
              onClick={handleNuclearCheckout}
              className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 md:py-5 bg-white text-black font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] rounded-xl sm:rounded-2xl hover:bg-purple-600 hover:text-white transition-all duration-300 relative z-[99999] cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              style={{ pointerEvents: 'auto', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Secure Checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}