"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[90] flex flex-col">
      
      {/* ✨ MEDIUM ANNOUNCEMENT BAR ✨ */}
      <div className="w-full bg-[#050505] border-b border-white/5 py-2.5 flex items-center justify-center gap-3 relative z-[101]">
        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
          Free Nationwide Delivery on Orders Over <span className="text-white font-black">Rs. 2500</span>
        </span>
      </div>

      {/* --- MAIN HEADER CONTAINER --- */}
      <div className={`transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative z-50">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.15)] group-hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-300">
              <img 
                src="/cart-io-logo.png" 
                alt="CART IO" 
                className="h-8 sm:h-10 w-auto group-hover:scale-105 duration-300 object-contain"
              />
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION (MEDIUM TEXT) --- */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="relative text-lg lg:text-xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
              Home
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/market" className="relative text-lg lg:text-xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
              Shop
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* ✨ CONTACT US DROPDOWN (Desktop) ✨ */}
            <div className="relative group py-2">
              <button className="relative text-lg lg:text-xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5">
                Contact Us
                <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <div className="absolute top-full left-0 w-full h-4"></div>

              <div className="absolute top-full left-0 mt-2 w-56 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden translate-y-2 group-hover:translate-y-0">
                <a href="https://wa.me/923196514249" target="_blank" rel="noopener noreferrer" className="px-5 py-4 text-base font-black uppercase tracking-widest text-zinc-300 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  WhatsApp
                </a>
                <a href="mailto:gobaazaar0@gmail.com" className="px-5 py-4 text-base font-black uppercase tracking-widest text-zinc-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors flex items-center gap-3 border-t border-white/5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Email Us
                </a>
              </div>
            </div>
            
            <Link href="/track" className="relative text-lg lg:text-xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors group">
              Track Order
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/admin" className="relative flex items-center gap-1.5 text-base font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-purple-400 transition-colors group ml-2 lg:ml-4 border-l border-white/10 pl-4 lg:pl-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Admin?
              <span className="absolute -bottom-2 left-4 lg:left-6 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* --- RIGHT ACTIONS --- */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            <button 
              onClick={() => window.dispatchEvent(new Event('openAiChat'))}
              className="hidden sm:flex relative items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-purple-400 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
              title="Ask AI Assistant"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </button>

            <button 
              onClick={() => window.dispatchEvent(new Event('openCart'))}
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-purple-500 border border-zinc-950 rounded-full"></span>
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 rounded-full ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 rounded-full ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 rounded-full ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </button>
          </div>

        </div>

        {/* --- MOBILE NAVIGATION DROPDOWN (MEDIUM TEXT) --- */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-[800px] border-opacity-100' : 'max-h-0 border-opacity-0'}`}>
          <nav className="flex flex-col px-8 py-6 space-y-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between">
              <span>Home</span><span className="text-purple-500">→</span>
            </Link>
            <div className="w-full h-px bg-white/5"></div>
            
            <Link href="/market" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between">
              <span>Shop</span><span className="text-purple-400">→</span>
            </Link>
            <div className="w-full h-px bg-white/5"></div>

            {/* ✨ CONTACT US ACCORDION (Mobile) ✨ */}
            <div>
              <button 
                onClick={() => setContactMenuOpen(!contactMenuOpen)}
                className="w-full text-2xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Contact Us</span>
                <svg className={`w-6 h-6 text-zinc-500 transition-transform duration-300 ${contactMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 border-l border-white/10 ml-3 ${contactMenuOpen ? 'max-h-48 mt-4' : 'max-h-0'}`}>
                <a href="https://wa.me/923196514249" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-lg font-black uppercase tracking-widest text-zinc-400 hover:text-[#25D366] transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  WhatsApp Support
                </a>
                <a href="mailto:gobaazaar0@gmail.com" className="px-4 py-2 text-lg font-black uppercase tracking-widest text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Email Team
                </a>
              </div>
            </div>
            <div className="w-full h-px bg-white/5"></div>
            
            <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center justify-between">
              <span>Track Order</span><span className="text-purple-500">→</span>
            </Link>
            <div className="w-full h-px bg-white/5"></div>

            <button 
              onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new Event('openAiChat')); }} 
              className="text-2xl font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-between text-left"
            >
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Ask AI Assistant
              </span>
              <span className="text-purple-500">→</span>
            </button>
            <div className="w-full h-px bg-white/5"></div>
            
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors flex items-center justify-between pt-2">
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Admin Access
              </span>
              <span>→</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}