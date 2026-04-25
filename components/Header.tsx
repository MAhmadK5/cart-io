"use client"; // Required for interactivity (toggling the menu)

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
      {/* Main Glass Bar */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 md:px-8 py-4 flex justify-between items-center relative z-50">
        
        {/* Logo Area */}
        <Link 
          href="/" 
          className="text-xl md:text-2xl font-black tracking-tighter uppercase flex items-center gap-3"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
          <div>
            <span className="text-blue-500">Go</span>
            <span className="text-orange-500">BAZAAR</span>
          </div>
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex gap-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-blue-500 transition-colors">About</Link>
          <Link href="/market" className="hover:text-blue-500 transition-colors">Market</Link>
          <Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
        </nav>
{/* ✨ NEW: Cart Button */}
          <button 
            onClick={() => window.dispatchEvent(new Event('openCart'))}
            className="relative p-2 text-zinc-300 hover:text-orange-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {/* Notification Dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]"></span>
          </button>
        
        {/* Mobile Hamburger Toggle (Hidden on Desktop) */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-[2px] bg-zinc-300 rounded-full transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-[2px] bg-zinc-300 rounded-full transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-[2px] bg-zinc-300 rounded-full transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full mt-2 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-95 opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 gap-6 text-sm font-bold text-zinc-300 uppercase tracking-widest shadow-2xl">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">About</Link>
          <Link href="/market" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">Market</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}