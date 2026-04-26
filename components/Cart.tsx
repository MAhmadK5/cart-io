"use client";

import { useState, useEffect } from 'react';

// Mock Cart Item Type
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  
  // We'll start with one item inside so you can see how it looks immediately!
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 3, name: "Matte Black Stanley 40oz", price: 55, quantity: 1, category: "Stanley tumblers" }
  ]);

  // Listen for the 'openCart' event from anywhere in the app
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const processingFee = 4.99; // Standard "Network Fee"
  const total = subtotal + processingFee;

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <>
      {/* --- BACKDROP --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* --- CART SIDEBAR --- */}
      <aside className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-zinc-950/90 backdrop-blur-2xl z-[1000] border-l border-white/10 transition-transform duration-700 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">Procurement Terminal</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Status: Ready for Sync</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-16 h-16 border-2 border-dashed border-zinc-700 rounded-full mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Manifest Empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="group relative bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-4 transition-all hover:border-blue-500/30">
                <div className="w-20 h-20 bg-zinc-900 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/5">
                  <span className="text-[8px] text-zinc-600 font-bold uppercase text-center">{item.category}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                  <p className="text-[10px] text-zinc-500 mb-2 uppercase font-bold tracking-widest">Qty: {item.quantity}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-light text-white">${item.price}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-black text-zinc-500 hover:text-orange-500 uppercase tracking-widest transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-8 bg-zinc-900/50 border-t border-white/10 space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span>Subtotal</span>
              <span className="text-white font-light">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span>Network Fee</span>
              <span className="text-white font-light">${processingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-white/5">
              <span className="text-lg font-black text-white uppercase tracking-tighter">Total Due</span>
              <span className="text-lg font-black text-orange-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Sync</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </button>
          
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Secure Node: Encrypted</span>
          </div>
        </div>

      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  );
}