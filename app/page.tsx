"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Updated: New Category Inventory
const trendingProducts = [
  { id: 1, name: "Aero-Blade MiNi Fan", price: "$35", category: "MiNi Fan" },
  { id: 2, name: "Matte Black Stanley 40oz", price: "$55", category: "Stanley tumblers" },
  { id: 3, name: "Velvet Smart-Weave Prayer Mat", price: "$85", category: "Prayer Mat" },
  { id: 4, name: "Luminous AI-Formulated Serum", price: "$120", category: "Beauty products" },
];

const reviews = [
  { id: 1, name: "Zack T.", tag: "Verified Buyer", text: "The Matte Black Stanley is unreal. Keeps ice frozen for 48 hours and the checkout was entirely frictionless.", rating: 5 },
  { id: 2, name: "Sarah M.", tag: "Aesthetic Lover", text: "Got a minimalist table and some decor. The AI recommendation engine perfectly matched my room's vibe.", rating: 5 },
  { id: 3, name: "Omar K.", tag: "Verified Buyer", text: "The plush quality of the Prayer Mat is unmatched. Delivery was tracked flawlessly via the dashboard.", rating: 5 },
];

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            hours = hours > 0 ? hours - 1 : 0;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg"></div>
      <div 
        className={`fixed top-0 left-0 w-full h-screen -z-20 overflow-hidden bg-black transition-opacity duration-2000 ease-in-out ${
          videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <video
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-40"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-6 md:space-y-8 relative z-10 pb-10 w-full overflow-hidden px-2 md:px-0 mt-10 md:mt-0">
        
        {/* ✨ UPDATED: GRAPHIC LOGO NO CONTAINER ✨ */}
        {/* We use brightness-0 invert to make the dark logo white so it pops on the dark bg */}
        <img 
          src="/gobaazaar.png" 
          alt="GOBAAZAAR" 
          className="h-10 sm:h-14 md:h-20 w-auto object-contain transition-transform hover:scale-105 duration-500 brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        />
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-zinc-100 font-black tracking-tighter drop-shadow-lg mt-4">
          Smart Lifestyle.
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-light tracking-wide drop-shadow-md px-4 md:px-0">
          Elevate your everyday essentials. From premium tumblers to modern decor, experience seamless checkout powered by intelligent AI support.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto px-6 sm:px-0">
          <Link href="/market" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 transition-all hover:scale-105 duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
              Start Shopping
            </button>
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-black/30 backdrop-blur-md border border-zinc-500/50 text-zinc-200 text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 hover:border-zinc-300 transition-all duration-300">
            Ask Our AI
          </button>
        </div>
      </div>

      {/* --- MARQUEE SECTION --- */}
      <div className="relative z-10 w-full overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-md py-4 mb-24">
        <div className="animate-scroll flex gap-8 items-center">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 items-center shrink-0">
              <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-4">
                CURATED LIFESTYLE <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-4">
                24/7 AI SUPPORT <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              </span>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-4">
                SEAMLESS CHECKOUT <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-4">
                PREMIUM HOME GOODS <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- AI PRODUCT DROP SPOTLIGHT --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-zinc-950 relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-orange-500/10"></div>
            <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse group-hover:scale-150 transition-transform duration-700"></div>
            <span className="text-zinc-700 text-2xl font-black uppercase tracking-widest relative z-10 group-hover:scale-105 transition-transform duration-500 text-center px-4">
              [ Stealth Stanley 40oz ]
            </span>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full">Limited Drop</span>
              <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">1 of 100</span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
            <h2 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span> Live Now
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Obsidian Stealth <br /> Quencher.
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-8 font-light">
              The iconic Stanley tumbler, engineered with military-grade matte black coating and aerospace-level thermal retention. Exclusive to GOBAAZAAR.
            </p>

            <div className="mb-8">
              <h4 className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">Drop Closes In:</h4>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Hours</span>
                </div>
                <span className="text-3xl font-black text-zinc-700">:</span>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Mins</span>
                </div>
                <span className="text-3xl font-black text-zinc-700">:</span>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-orange-400 animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Secs</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.dispatchEvent(new Event('openCart'))}
                className="px-8 py-4 bg-white text-black hover:bg-orange-500 hover:text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                Secure Now - $65
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- TRENDING PRODUCTS SECTION --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Trending Now</h2>
            <p className="text-zinc-400 mt-2">Curated essentials powered by our AI engine.</p>
          </div>
          <Link href="/market" className="text-sm font-bold text-blue-400 hover:text-orange-400 uppercase tracking-widest transition-colors">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="w-full h-64 bg-zinc-800/50 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                <span className="text-zinc-600 text-sm font-medium uppercase tracking-widest group-hover:scale-110 transition-transform duration-500">Image</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">{product.category}</p>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                <p className="text-zinc-400 font-medium">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- AI VERIFIED REVIEWS --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
            Network Feedback
          </h2>
          <p className="text-zinc-400 mt-2">Real reviews verified by our secure ledger.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900/40 backdrop-blur-lg border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/0 via-blue-600/0 to-orange-500/0 group-hover:from-blue-600/10 group-hover:to-orange-500/10 transition-all duration-500 z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-black text-zinc-400 border border-white/10">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{review.name}</h4>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest">{review.tag}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-orange-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 font-light leading-relaxed text-sm">
                  "{review.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- UPDATED: 6-ITEM BENTO CATEGORY GRID --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Shop by Category</h2>
          <p className="text-zinc-400 mt-2">Explore our six premium collections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          
          {/* 1. Stanley Tumblers (Large Header) */}
          <Link href="/market" className="md:col-span-2 group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:border-blue-500/50">
            <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center">
               <span className="text-zinc-600 text-lg font-black uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">Thermal Quenchers</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Stanley Tumblers</h3>
              <p className="text-zinc-400 font-medium tracking-wide flex items-center gap-2">
                Hydration, mastered. <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
              </p>
            </div>
          </Link>

          {/* 2. Beauty Products */}
          <Link href="/market" className="group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:border-orange-500/50">
            <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center">
               <span className="text-zinc-600 text-lg font-black uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">Skincare</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">Beauty</h3>
              <p className="text-zinc-400 font-medium tracking-wide flex items-center gap-2">
                Shop Glow <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
              </p>
            </div>
          </Link>

          {/* 3. Prayer Mats */}
          <Link href="/market" className="group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:border-blue-500/50">
            <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center">
               <span className="text-zinc-600 text-lg font-black uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">Spiritual</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Prayer Mats</h3>
              <p className="text-zinc-400 font-medium tracking-wide flex items-center gap-2">
                Premium Weaves <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
              </p>
            </div>
          </Link>

          {/* 4. MiNi Fan */}
          <Link href="/market" className="group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:border-orange-500/50">
            <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center">
               <span className="text-zinc-600 text-lg font-black uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">Cooling</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">MiNi Fans</h3>
              <p className="text-zinc-400 font-medium tracking-wide flex items-center gap-2">
                Aero-Dynamic <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
              </p>
            </div>
          </Link>

          {/* 5 & 6. Tables and Decoration (Combined Large Footer Box) */}
          <Link href="/market" className="md:col-span-2 group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:border-blue-500/50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-500/10 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute inset-0 bg-zinc-800/30 flex items-center justify-center">
               <span className="text-zinc-600 text-lg font-black uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">Interior Spaces</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="relative z-10">
              <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">Curated Furniture</span>
              <h3 className="text-3xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Tables & Decoration</h3>
              <p className="text-zinc-300 font-medium tracking-wide flex items-center gap-2">
                Redefine your living space with our modern collection <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
              </p>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}