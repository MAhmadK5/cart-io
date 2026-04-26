"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic frosted glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative z-50">
        
        {/* --- EXACT COLOR LOGO --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/gobaazaar.png" 
            alt="GOBAAZAAR" 
            /* Filter removed! Added a subtle white glass background so the dark blue is perfectly readable against the black website */
            className="h-8 sm:h-10 w-auto  hover:scale-105 duration-300  backdrop-blur-md px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </Link>

        {/* --- DESKTOP NAVIGATION (Easy, Customer-Friendly Words) --- */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="relative text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
            Home
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/market" className="relative text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
            Shop
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/market" className="relative text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
            Categories
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* --- RIGHT ACTIONS (Cart & Mobile Menu Toggle) --- */}
        <div className="flex items-center gap-4">
          
          {/* Cart Button */}
          <button 
            onClick={() => window.dispatchEvent(new Event('openCart'))}
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white hover:bg-orange-500 hover:border-orange-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border border-zinc-950 rounded-full"></span>
          </button>

          {/* Mobile Hamburger Button (Only visible on phones) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            {/* Animated Hamburger Lines */}
            <span className={`w-4 h-0.5 bg-white transition-all duration-300 rounded-full ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`w-4 h-0.5 bg-white transition-all duration-300 rounded-full ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-4 h-0.5 bg-white transition-all duration-300 rounded-full ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
          </button>
        </div>

      </div>

      {/* --- MOBILE NAVIGATION DROPDOWN --- */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-64 border-opacity-100' : 'max-h-0 border-opacity-0'}`}>
        <nav className="flex flex-col px-8 py-6 space-y-6">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
          >
            <span>Home</span>
            <span className="text-blue-500">→</span>
          </Link>
          <div className="w-full h-px bg-white/5"></div>
          <Link 
            href="/market" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
          >
            <span>Shop</span>
            <span className="text-orange-500">→</span>
          </Link>
          <div className="w-full h-px bg-white/5"></div>
          <Link 
            href="/market" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
          >
            <span>Categories</span>
            <span className="text-blue-500">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}