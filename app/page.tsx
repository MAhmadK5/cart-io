"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  tag: string | null;
  rating: number;
  stock: number;
  description: string;
  image: string;
};

// ✨ UPDATED: Matched to your new perfect database schema ✨
type Review = {
  id: number;
  user_name: string;
  comment: string;
  rating: number;
};

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [limitedDrop, setLimitedDrop] = useState<Product | null>(null);
  
  // ✨ CAROUSEL STATE ✨
  const [featuredLandscapes, setFeaturedLandscapes] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  // ✨ NEW: SALE BANNER STATE ✨
  const [saleBanner, setSaleBanner] = useState<any>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Vault Countdown Timer
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

  // Auto-Rotate Banner Every 5 Seconds
  useEffect(() => {
    if (featuredLandscapes.length <= 1) return;
    
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % featuredLandscapes.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [featuredLandscapes.length]);

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const { data: trendingData } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false })
          .limit(10);
        if (trendingData) setTrendingProducts(trendingData);

        const { data: dropData } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0)
          .order('stock', { ascending: true })
          .limit(1);
        if (dropData && dropData.length > 0) setLimitedDrop(dropData[0]);

        const { data: featuredData } = await supabase
          .from('products')
          .select('*')
          .order('price', { ascending: false }) 
          .limit(3);
        if (featuredData && featuredData.length > 0) setFeaturedLandscapes(featuredData);

        // ✨ NEW: FETCH ACTIVE PROMOTIONAL BANNER ✨
        const { data: promoData } = await supabase
          .from('promotional_banners')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);
        if (promoData && promoData.length > 0) setSaleBanner(promoData[0]);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        if (reviewsData) setReviews(reviewsData);

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepageData();
  }, []);

  return (
    <>
      {/* ✨ CUSTOM ANIMATION FOR MARQUEE ✨ */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg"></div>
      
      <div className={`fixed top-0 left-0 w-full h-screen -z-20 overflow-hidden bg-black transition-opacity duration-2000 ease-in-out ${videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <video autoPlay muted playsInline onEnded={() => setVideoEnded(true)} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-40">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center relative z-10 pb-10 w-full overflow-hidden px-4 mt-16 md:mt-0">
        <div className="mb-6 md:mb-8 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-1.5 md:py-2 bg-black/30 backdrop-blur-md border border-white/5 rounded-full">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">Nationwide Delivery Available</span>
        </div>

        <img 
          src="/cart-io-logo.png" 
          alt="CART IO" 
          className="h-12 sm:h-20 md:h-32 w-auto object-contain transition-transform hover:scale-105 duration-1000 brightness-0 invert drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6 md:mb-10" 
        />
        
        <h1 className="text-2xl sm:text-3xl md:text-5xl text-white font-black tracking-[0.3em] mb-6 md:mb-8 uppercase">
          Ultimate Luxury
        </h1>
        
        <p className="text-sm sm:text-base md:text-2xl text-zinc-400 max-w-2xl font-semibold tracking-wide leading-relaxed mb-8 md:mb-12 px-4">
          Elevate your lifestyle with a curated collection of modern essentials. Designed for those who demand excellence. <br /> 
          -Pakistan's 1st Ai-Powered E-Commerce Website
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto px-6 sm:px-0">
          <Link href="/market" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 bg-white text-black text-xs md:text-base font-black uppercase tracking-[0.2em] rounded-none hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-3 group">
              <span>Enter SHOP</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ✨ NEW: DYNAMIC SALE BANNER (Only renders if active promotion exists) ✨ */}
      {saleBanner && (
        <div className="relative z-20 w-full px-4 sm:px-8 pb-16 max-w-[1600px] mx-auto animate-fade-in mt-8 md:mt-0">
          {/* ✨ FIXED: Increased md height to 400px and lg height to 600px ✨ */}
          <Link href={saleBanner.link || "/market"} className="block relative w-full h-[200px] md:h-[400px] lg:h-[600px] rounded-2xl md:rounded-[2.5rem] overflow-hidden group border border-purple-500 shadow-[0_0_50px_rgba(249,115,22,0.15)] bg-zinc-900">
            
            <img 
              src={saleBanner.image} 
              alt={saleBanner.title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-16">
              <span className="w-max px-3 py-1 mb-3 md:mb-6 bg-red-700 text-white font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] rounded-full shadow-[0_0_20px_rgba(249,115,22,0.5)] animate-pulse">
                Live Promotion
              </span>
              {/* ✨ Scaled up text to md:text-7xl and lg:text-8xl to match the new height ✨ */}
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none max-w-4xl drop-shadow-2xl">
                {saleBanner.title}
              </h2>
              <div className="mt-8 hidden md:flex items-center gap-3 text-purple-600 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors">
                Claim Offer <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          </Link>
        </div>
      )}
    

      {/* --- ✨ DB-DRIVEN LANDSCAPE CAROUSEL ✨ --- */}
      <div className="relative z-10 w-full px-4 sm:px-8 pb-16">
        {loading ? (
          <div className="w-full h-[300px] md:h-[600px] bg-zinc-900/50 animate-pulse rounded-2xl"></div>
        ) : featuredLandscapes.length > 0 ? (
          <div className="relative w-full h-[300px] md:h-[600px] bg-black rounded-2xl overflow-hidden group">
            
            {/* The Banners */}
            {featuredLandscapes.map((banner, index) => (
              <div 
                key={banner.id} 
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                <Link href={`/market/${banner.id}`} className="block w-full h-full">
                  <img 
                    src={banner.image} 
                    alt={banner.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 z-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-0"></div>
                  
                  <div className="absolute bottom-0 left-0 p-6 md:p-16 z-10 w-full md:w-2/3">
                    <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6 inline-block shadow-lg">
                      Featured Collection
                    </span>
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight uppercase mb-2 md:mb-4 tracking-tight line-clamp-1 drop-shadow-2xl">
                      {banner.name}
                    </h2>
                    <p className="text-sm sm:text-lg md:text-2xl text-zinc-300 font-light mb-6 md:mb-8 line-clamp-2 max-w-xl tracking-wide drop-shadow-md">
                      {banner.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="text-xl md:text-3xl text-white font-bold">Rs. {banner.price.toLocaleString()}</span>
                      <span className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                        Shop Now <span className="group-hover:translate-x-2 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* Pagination Lines */}
            {featuredLandscapes.length > 1 && (
              <div className="absolute bottom-6 right-6 md:bottom-16 md:right-16 z-20 flex gap-3">
                {featuredLandscapes.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => { e.preventDefault(); setCurrentBannerIndex(idx); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === currentBannerIndex ? 'w-12 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-4 bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* ✨ CONTINUOUS "SEXY" MARQUEE BANNER ✨ */}
      <div className="relative z-10 w-full border-y border-white/10 bg-black overflow-hidden flex items-center py-6 md:py-10 shadow-[0_0_50px_rgba(147,51,234,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none w-full"></div>
        <div className="animate-marquee flex items-center">
          {/* We repeat the array so it is wide enough to loop seamlessly */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-600 to-zinc-800 uppercase tracking-tighter mx-8 hover:text-white transition-colors duration-500 cursor-default" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                CARTIO
              </span>
              <svg className="w-8 h-8 text-purple-500 animate-[spin_4s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              <span className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mx-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-default">
                Sale
              </span>
              <svg className="w-8 h-8 text-purple-500 animate-[spin_4s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
          ))}
        </div>
      </div>

      {/* --- CATEGORY OVERHAUL --- */}
      <div className="relative z-10 w-full px-4 sm:px-8 pb-20 pt-20 md:pb-32 md:pt-28 max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 text-center">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6">Cataloged Areas</h2>
          <p className="text-sm md:text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">Explore our dedicated segments. Precision engineered for your lifestyle.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Link href="/market?category=Stanley+tumblers" className="lg:col-span-2 group relative h-[250px] md:h-[500px] bg-zinc-900 overflow-hidden block rounded-3xl">
            <img src="Stanley.png" alt="Tumblers" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Stanley</h3>
              <p className="text-[10px] md:text-sm font-bold text-purple-400 uppercase tracking-[0.3em]">Hydration Mastered</p>
            </div>
          </Link>

          <Link href="/market?category=Decoration" className="group relative h-[250px] md:h-[500px] bg-zinc-900 overflow-hidden block rounded-3xl">
            <img src="Decor.jpg" alt="Decor" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Decor</h3>
              <p className="text-[10px] md:text-sm font-bold text-purple-400 uppercase tracking-[0.3em]">Modern Living</p>
            </div>
          </Link>

          <Link href="/market?category=Beauty+products" className="group relative h-[250px] md:h-[400px] bg-zinc-900 overflow-hidden block rounded-3xl">
            <img src="makeup.webp" alt="Beauty" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Beauty</h3>
              <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Shop Glow</p>
            </div>
          </Link>

          <Link href="/market?category=Prayer+Mat" className="group relative h-[250px] md:h-[400px] bg-zinc-900 overflow-hidden block rounded-3xl">
            <img src="mat.png" alt="Prayer Mats" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Prayer</h3>
              <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Premium Weaves</p>
            </div>
          </Link>

          <Link href="/market?category=MiNi+Fan" className="group relative h-[250px] md:h-[400px] bg-zinc-900 overflow-hidden block rounded-3xl">
            <img src="fan.png" alt="Fans" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Fans</h3>
              <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Aero-Dynamic</p>
            </div>
          </Link>

        </div>
      </div>
      {/* --- SALIENT FEATURES --- */}
      <div className="relative z-10 w-full bg-zinc-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-zinc-900/60 transition-colors duration-500">
              <svg className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Priority Dispatch</h4>
              <p className="text-zinc-500 text-xs tracking-wide leading-relaxed font-light">Nationwide secured delivery within 7 business days directly to your door.</p>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-zinc-900/60 transition-colors duration-500">
              <svg className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">AI Intelligence</h4>
              <p className="text-zinc-500 text-xs tracking-wide leading-relaxed font-light">Powered by Gemini Oracle for intelligent product recommendations and support.</p>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-zinc-900/60 transition-colors duration-500">
              <svg className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Uncompromising</h4>
              <p className="text-zinc-500 text-xs tracking-wide leading-relaxed font-light">Curated materials and premium craftsmanship guaranteeing authenticity.</p>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-zinc-900/60 transition-colors duration-500">
              <svg className="w-10 h-10 text-green-500 mb-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Encrypted Records</h4>
              <p className="text-zinc-500 text-xs tracking-wide leading-relaxed font-light">Bank-grade security protecting your data and transactions end-to-end.</p>
            </div>

          </div>
        </div>
      </div>

      {/* --- TRENDING NOW / THE COLLECTION --- */}
      <div className="relative z-10 w-full px-4 sm:px-8 pt-16 md:pt-24 pb-16 md:pb-24 bg-[#050505] border-y border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2 md:mb-4">
              The Collection
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-zinc-400 tracking-wide font-light">Curated essentials. Highly sought after.</p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Swipe to Explore
            <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
        </div>

        {loading ? (
          <div className="flex overflow-hidden gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((i) => <div key={i} className="shrink-0 w-[85vw] sm:w-[320px] lg:w-[400px] aspect-[3/4] bg-zinc-900/50 animate-pulse rounded-2xl md:rounded-3xl border border-white/5"></div>)}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-12 custom-scrollbar snap-x snap-mandatory hide-scrollbar max-w-7xl mx-auto">
            {trendingProducts.map((product) => (
              <Link href={`/market/${product.id}`} key={product.id} className="shrink-0 w-[85vw] sm:w-[320px] lg:w-[400px] snap-start group relative aspect-[3/4] bg-zinc-900 overflow-hidden block rounded-2xl md:rounded-3xl border border-white/5">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col justify-end h-1/2">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.3em] mb-2 md:mb-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:translate-y-4 group-hover:translate-y-0">{product.category}</p>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-lg md:text-xl text-purple-300 font-medium tracking-widest">Rs. {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* --- NETWORK FEEDBACK --- */}
      <div className="relative z-10 w-full border-t border-white/5 bg-[#050505] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-[0.4em]">Customers Perspectives</h2>
          </div>

          {loading ? null : reviews.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm tracking-widest uppercase py-10">
              No feedback entries available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="flex flex-col items-center text-center">
                  <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed tracking-wide mb-6 md:mb-8 italic">
                    "{review.comment}"
                  </p>
                  <div className="w-6 md:w-8 h-px bg-purple-500 mb-4 md:mb-6"></div>
                  <h4 className="text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase">{review.user_name || "Anonymous"}</h4>
                  <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-1 md:mt-2">Verified Client</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
}