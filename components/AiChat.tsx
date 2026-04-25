"use client";

import { useState } from 'react';

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* The Chat Window (Appears when isOpen is true) */}
      <div 
        className={`mb-4 w-[90vw] sm:w-80 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 visible' : 'scale-90 opacity-0 invisible absolute bottom-16 right-0'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-orange-500/20 p-4 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest">GoBAZAAR AI</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            &#10005; {/* X close icon */}
          </button>
        </div>

        {/* Chat Body */}
        <div className="h-64 p-4 overflow-y-auto flex flex-col gap-3">
          <div className="bg-zinc-800/50 rounded-xl rounded-tl-sm p-3 text-sm text-zinc-300 border border-zinc-700/50 w-[85%]">
            Hello! I'm your GoBAZAAR smart assistant. Looking for a specific product or need help with sizing?
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-3 border-t border-white/5 bg-black/40">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              className="w-full bg-zinc-900/50 border border-zinc-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
            />
            <button className="bg-blue-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md">
              &uarr;
            </button>
          </div>
        </div>
      </div>

      {/* The Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-zinc-900 border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-blue-500/50 transition-all hover:scale-105 duration-300 z-50"
      >
        {/* Glowing aura behind button */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
        
        {/* Inner button surface */}
        <div className="absolute inset-[1px] bg-zinc-950 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
}