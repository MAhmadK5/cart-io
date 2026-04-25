"use client";

import { useState, useEffect } from 'react';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for the custom event from the Header to open the cart
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }, []);

  return (
    <>
      {/* Dark Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Slide-out Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-zinc-950/90 backdrop-blur-2xl border-l border-white/10 z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
            Your Bag <span className="text-orange-500 text-sm">(2)</span>
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-transform hover:rotate-90 duration-300 p-2"
          >
            &#10005; {/* X Icon */}
          </button>
        </div>

        {/* Cart Items (Dummy Data for now) */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          
          {/* Item 1 */}
          <div className="flex gap-4 group">
            <div className="w-20 h-24 bg-zinc-900 border border-white/5 rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Image</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col justify-between w-full">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">Cyber-Chic Neural Headset</h3>
                <p className="text-xs text-zinc-500 mt-1">Matte Black / One Size</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-zinc-300">$350</span>
                <button className="text-xs text-zinc-600 hover:text-red-500 uppercase font-bold tracking-wider transition-colors">Remove</button>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 group">
            <div className="w-20 h-24 bg-zinc-900 border border-white/5 rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Image</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col justify-between w-full">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">Premium White Denim</h3>
                <p className="text-xs text-zinc-500 mt-1">White / 32x32</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-zinc-300">$90</span>
                <button className="text-xs text-zinc-600 hover:text-red-500 uppercase font-bold tracking-wider transition-colors">Remove</button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Checkout Footer */}
        <div className="p-6 border-t border-white/10 bg-black/50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-zinc-400 uppercase tracking-widest">Subtotal</span>
            <span className="text-xl font-black text-white">$440</span>
          </div>
          <button className="w-full py-4 bg-blue-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:scale-[1.02] duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}