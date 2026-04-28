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

// ✨ New type for database reviews ✨
type Review = {
  id: number;
  name: string;
  tag: string;
  text: string;
  rating: number;
};

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [limitedDrop, setLimitedDrop] = useState<Product | null>(null);
  
  // ✨ State for real reviews ✨
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const { data: trendingData } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false })
          .limit(4);
        if (trendingData) setTrendingProducts(trendingData);

        const { data: dropData } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0)
          .order('stock', { ascending: true })
          .limit(1);
        if (dropData && dropData.length > 0) setLimitedDrop(dropData[0]);

        // ✨ Fetch real reviews from the database ✨
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .order('id', { ascending: true })
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
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg"></div>
      <div className={`fixed top-0 left-0 w-full h-screen -z-20 overflow-hidden bg-black transition-opacity duration-2000 ease-in-out ${videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <video autoPlay muted playsInline onEnded={() => setVideoEnded(true)} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-40">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center relative z-10 pb-10 w-full overflow-hidden px-4 mt-10 md:mt-0">
        
        <div className="mb-8 flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Dilevering Nationwide</span>
        </div>

        <img src="/gobaazaar.png" alt="GOBAAZAAR" className="h-10 sm:h-14 md:h-20 w-auto object-contain transition-transform hover:scale-105 duration-500 brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-8"/>
        
        <h1 className="text-lg sm:text-xl md:text-2xl text-white font-medium tracking-[0.4em] drop-shadow-lg mb-6 flex items-center justify-center gap-4 w-full">
          <span className="hidden sm:block w-16 h-px bg-gradient-to-r from-transparent to-blue-500"></span>
          SMART SHOPPING
          <span className="hidden sm:block w-16 h-px bg-gradient-to-l from-transparent to-orange-500"></span>
        </h1>
        
        <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-light tracking-wider leading-relaxed mb-10 drop-shadow-md">
          Elevate your everyday routine. Discover a curated collection of premium tumblers, modern room decor, and smart lifestyle essentials designed for your home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
          <Link href="/market" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl border border-white hover:bg-transparent hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:border-blue-500 flex items-center justify-center gap-3 group">
              <span>Start Shopping</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
          
          {/* ✨ FUNCTIONAL "ASK OUR AI" BUTTON ✨ */}
         {/* ✨ FUNCTIONAL "ASK OUR AI" BUTTON ✨ */}
          <button 
            onClick={() => window.dispatchEvent(new Event('openAiChat'))}
            className="w-full sm:w-auto px-10 py-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-700 text-zinc-300 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-400 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
          >
            <span>Ask Our AI</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative h-64 sm:h-72 rounded-[2rem] overflow-hidden flex items-center p-8 md:p-10 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.05)] hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] bg-black">
            <img src="Stanley3.jpg" alt="Flash Sale" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-0"></div>
            <div className="relative z-10 w-full">
              <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block shadow-lg">Flash Sale</span>
              <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">Up to 30% Off <br/><span className="text-orange-400">Tumblers</span></h3>
              <Link href="/market?category=Stanley+tumblers">
                <button className="mt-2 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 hover:text-orange-400 transition-colors">Shop The Sale <span className="group-hover:translate-x-1 transition-transform">→</span></button>
              </Link>
            </div>
          </div>
          <div className="group relative h-64 sm:h-72 rounded-[2rem] overflow-hidden flex items-center p-8 md:p-10 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.05)] hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] bg-black">
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop" alt="New Arrivals" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-0"></div>
            <div className="relative z-10 w-full">
              <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block shadow-lg">New Drops</span>
              <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">Elevate Your <br/><span className="text-blue-400">Living Space</span></h3>
              <Link href="/market?category=Decoration">
                <button className="mt-2 text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 hover:text-blue-400 transition-colors">Explore Decor <span className="group-hover:translate-x-1 transition-transform">→</span></button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-screen border-y border-white/5 bg-zinc-950/80 backdrop-blur-xl py-3 mb-24 shadow-2xl flex overflow-hidden" style={{ marginLeft: 'calc(50% - 50vw)' }}>
        <div className="marquee-track flex shrink-0 items-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center shrink-0 px-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">FREE NATIONWIDE SHIPPING <span className="text-orange-500 text-lg">✦</span></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">CURATED PREMIUM GOODS <span className="text-blue-500 text-lg">✦</span></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">100% SECURE CHECKOUT <span className="text-orange-500 text-lg">✦</span></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">24/7 CUSTOMER SUPPORT <span className="text-blue-500 text-lg">✦</span></span>
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `.marquee-track { animation: infinite-scroll 40s linear infinite; width: max-content; } @keyframes infinite-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}} />
      </div>

      {/* --- REAL LIMITED DROP --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="w-full h-[500px] bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5"></div>
        ) : limitedDrop ? (
          <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-black relative overflow-hidden flex items-center justify-center group">
              <img src={limitedDrop.image} alt={limitedDrop.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-orange-500/20 mix-blend-overlay"></div>
              <div className="absolute top-6 left-6 flex gap-2 z-10">
                <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full">Limited Drop</span>
                <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-orange-500/50 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">Only {limitedDrop.stock} Left</span>
              </div>
            </div>
            <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-black/20">
              <h2 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span> Live Data
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 uppercase">{limitedDrop.name}</h3>
              <p className="text-zinc-400 leading-relaxed mb-8 font-light line-clamp-3">
                {limitedDrop.description || "Critically low inventory detected. Secure this premium asset before our network runs completely out of stock."}
              </p>
              <div className="mb-8">
                <h4 className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">Drop Closes In:</h4>
                <div className="flex gap-4">
                  <div className="flex flex-col"><span className="text-3xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span><span className="text-[10px] text-zinc-500 uppercase tracking-widest">Hours</span></div>
                  <span className="text-3xl font-black text-zinc-700">:</span>
                  <div className="flex flex-col"><span className="text-3xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span><span className="text-[10px] text-zinc-500 uppercase tracking-widest">Mins</span></div>
                  <span className="text-3xl font-black text-zinc-700">:</span>
                  <div className="flex flex-col"><span className="text-3xl font-black text-orange-400 animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</span><span className="text-[10px] text-zinc-500 uppercase tracking-widest">Secs</span></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.dispatchEvent(new Event('openCart'))} className="px-8 py-4 bg-white text-black hover:bg-orange-500 hover:text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  Secure Now - Rs. {limitedDrop.price.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Trending Now
              <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] uppercase tracking-widest rounded-md hidden sm:inline-block">Live DB</span>
            </h2>
            <p className="text-zinc-400 mt-2">Highest rated essentials powered by our database.</p>
          </div>
          <Link href="/market" className="text-sm font-bold text-blue-400 hover:text-orange-400 uppercase tracking-widest transition-colors">View All &rarr;</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="w-full h-80 bg-zinc-900/50 rounded-2xl animate-pulse border border-white/5"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <Link href={`/market/${product.id}`} key={product.id} className="group relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden cursor-pointer flex flex-col">
                <div className="w-full h-64 bg-black rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span className="text-[10px] text-white font-bold">{product.rating}</span>
                  </div>
                </div>
                <div className="space-y-1 relative z-10 flex-1 flex flex-col">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">{product.category}</p>
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-zinc-400 font-medium mt-auto pt-2">Rs. {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* --- ✨ REAL DYNAMIC REVIEWS ✨ --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
            Network Feedback
          </h2>
          <p className="text-zinc-400 mt-2">Real reviews verified by our secure ledger.</p>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[1, 2, 3].map(i => <div key={i} className="h-48 bg-zinc-900/40 rounded-3xl animate-pulse"></div>)}
           </div>
        ) : (
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
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Shop by Category</h2>
          <p className="text-zinc-400 mt-2">Explore our six premium collections.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          <Link href="/market?category=Stanley+tumblers" className="md:col-span-2 group relative bg-black rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <img src="Stanley.webp" alt="Tumblers" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-0"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Stanley Tumblers</h3>
              <p className="text-zinc-300 font-medium tracking-wide flex items-center gap-2">Hydration, mastered. <span className="group-hover:translate-x-2 transition-transform">&rarr;</span></p>
            </div>
          </Link>
          <Link href="/market?category=Beauty+products" className="group relative bg-black rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <img src="makeup.jpg" alt="Beauty" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent z-0"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">Beauty</h3>
              <p className="text-zinc-300 font-medium tracking-wide flex items-center gap-2">Shop Glow <span className="group-hover:translate-x-2 transition-transform">&rarr;</span></p>
            </div>
          </Link>
          <Link href="/market?category=Prayer+Mat" className="group relative bg-black rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <img src="mat.jpeg" alt="Prayer Mats" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent z-0"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Prayer Mats</h3>
              <p className="text-zinc-300 font-medium tracking-wide flex items-center gap-2">Premium Weaves <span className="group-hover:translate-x-2 transition-transform">&rarr;</span></p>
            </div>
          </Link>
          <Link href="/market?category=MiNi+Fan" className="group relative bg-black rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <img src="fan.jpg" alt="Fans" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent z-0"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">MiNi Fans</h3>
              <p className="text-zinc-300 font-medium tracking-wide flex items-center gap-2">Aero-Dynamic <span className="group-hover:translate-x-2 transition-transform">&rarr;</span></p>
            </div>
          </Link>
          <Link href="/market?category=Decoration" className="md:col-span-2 group relative bg-black rounded-3xl overflow-hidden flex items-end p-8 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop" alt="Decor" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-0"></div>
            <div className="relative z-10 w-full">
              <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">Curated Furniture</span>
              <h3 className="text-3xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">Tables & Decoration</h3>
              <p className="text-zinc-300 font-medium tracking-wide flex items-center gap-2">Redefine your living space with our modern collection <span className="group-hover:translate-x-2 transition-transform">&rarr;</span></p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}