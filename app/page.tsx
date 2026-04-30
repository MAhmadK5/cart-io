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
  const [featuredLandscape, setFeaturedLandscape] = useState<Product | null>(null);
  
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

        const { data: featuredData } = await supabase
          .from('products')
          .select('*')
          .order('price', { ascending: false }) 
          .limit(1);
        if (featuredData && featuredData.length > 0) setFeaturedLandscape(featuredData[0]);

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
        {/* ✨ REMOVED GRAYSCALE FROM VIDEO ✨ */}
        <video autoPlay muted playsInline onEnded={() => setVideoEnded(true)} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-40">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center relative z-10 pb-10 w-full overflow-hidden px-4 mt-16 md:mt-0">
        <div className="mb-6 md:mb-8 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-1.5 md:py-2 bg-black/30 backdrop-blur-md border border-white/5 rounded-full">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">Global Delivery Available</span>
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
          Elevate your lifestyle with a curated collection of modern essentials. Designed for those who demand excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto px-6 sm:px-0">
          <Link href="/market" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 bg-white text-black text-xs md:text-base font-black uppercase tracking-[0.2em] rounded-none hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-3 group">
              <span>Enter Boutique</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* --- DB-DRIVEN LANDSCAPE BANNER --- */}
      <div className="relative z-10 w-full px-4 sm:px-8 pb-16 md:pb-24">
        {loading ? (
          <div className="w-full h-[300px] md:h-[600px] bg-zinc-900/50 animate-pulse rounded-2xl"></div>
        ) : featuredLandscape ? (
          <Link href={`/market/${featuredLandscape.id}`} className="block relative w-full h-[300px] md:h-[600px] overflow-hidden group rounded-2xl bg-black">
            <img 
              src={featuredLandscape.image} 
              alt={featuredLandscape.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 z-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-0"></div>
            
            <div className="absolute bottom-0 left-0 p-6 md:p-16 z-10 w-full md:w-2/3">
              <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6 inline-block">
                Featured Collection
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight uppercase mb-2 md:mb-4 tracking-tight line-clamp-1">
                {featuredLandscape.name}
              </h2>
              <p className="text-sm sm:text-lg md:text-2xl text-zinc-300 font-light mb-6 md:mb-8 line-clamp-2 max-w-xl tracking-wide">
                {featuredLandscape.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="text-xl md:text-3xl text-white font-bold">Rs. {featuredLandscape.price.toLocaleString()}</span>
                <span className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                  Shop Now <span className="group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            </div>
          </Link>
        ) : null}
      </div>

      {/* --- EDITORIAL LIMITED DROP --- */}
      <div className="relative z-10 w-full border-t border-white/5 bg-zinc-950 pb-20 pt-16 md:pb-32 md:pt-24">
        {loading ? null : limitedDrop ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-0">
              
              <div className="w-full lg:w-1/2 relative min-h-[350px] sm:min-h-[500px] lg:min-h-[700px] bg-zinc-900 group overflow-hidden rounded-2xl lg:rounded-none lg:rounded-l-2xl">
                {/* ✨ REMOVED GRAYSCALE FROM IMAGE ✨ */}
                <img 
                  src={limitedDrop.image} 
                  alt={limitedDrop.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
                />
              </div>

              <div className="w-full lg:w-1/2 flex flex-col justify-center bg-zinc-900/20 p-6 sm:p-10 md:p-16 rounded-2xl lg:rounded-none lg:rounded-r-2xl border border-white/5 lg:border-l-0">
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-ping"></span>
                  <h4 className="text-[10px] md:text-sm text-red-500 font-bold uppercase tracking-[0.3em]">Vault Closing</h4>
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase leading-none tracking-tighter mb-4 md:mb-6">
                  {limitedDrop.name}
                </h2>
                
                <p className="text-base sm:text-xl md:text-2xl text-zinc-400 font-light mb-8 md:mb-12 tracking-wide">
                  Extremely limited allocation. Once the timer expires, this asset returns to the vault permanently. Only <span className="text-white font-bold">{limitedDrop.stock}</span> remaining globally.
                </p>

                <div className="flex items-end gap-4 sm:gap-6 md:gap-10 mb-8 md:mb-16 border-b border-white/10 pb-6 md:pb-10">
                  <div className="flex flex-col">
                    <span className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.3em] mt-2 md:mt-3">Hours</span>
                  </div>
                  <span className="text-2xl sm:text-4xl md:text-6xl font-light text-zinc-700 leading-none pb-4 md:pb-8">:</span>
                  <div className="flex flex-col">
                    <span className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.3em] mt-2 md:mt-3">Mins</span>
                  </div>
                  <span className="text-2xl sm:text-4xl md:text-6xl font-light text-zinc-700 leading-none pb-4 md:pb-8">:</span>
                  <div className="flex flex-col">
                    <span className="text-4xl sm:text-6xl md:text-8xl font-black text-purple-500 leading-none tracking-tighter">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.3em] mt-2 md:mt-3">Secs</span>
                  </div>
                </div>

                <button onClick={() => window.dispatchEvent(new Event('openCart'))} className="w-full md:w-max px-6 py-4 md:px-12 md:py-5 bg-white text-black hover:bg-purple-600 hover:text-white text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-none transition-colors flex items-center justify-center gap-3 md:gap-4 group">
                  <span>Secure Asset - Rs. {limitedDrop.price.toLocaleString()}</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>

            </div>
          </div>
        ) : null}
      </div>

      {/* --- TRENDING NOW --- */}
      {/* ✨ ADDED pt-12 md:pt-24 TO FIX MERGING WITH VAULT CLOSING SECTION ✨ */}
      <div className="relative z-10 w-full px-4 sm:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2 md:mb-4">
              The Collection
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-zinc-400 tracking-wide font-light">Curated essentials. Highly sought after.</p>
          </div>
          <Link href="/market" className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.3em] hover:text-purple-400 transition-colors flex items-center gap-2 group">
            View Editorial <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-zinc-900/50 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
            {trendingProducts.map((product) => (
              <Link href={`/market/${product.id}`} key={product.id} className="group relative aspect-[3/4] bg-zinc-900 overflow-hidden block">
                {/* ✨ REMOVED GRAYSCALE FROM IMAGE ✨ */}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full flex flex-col justify-end h-1/2">
                  <p className="text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] mb-2 md:mb-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:translate-y-4 group-hover:translate-y-0">{product.category}</p>
                  <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight mb-1 md:mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm md:text-lg text-purple-300 font-medium tracking-widest">Rs. {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* --- NETWORK FEEDBACK --- */}
      {/* ✨ REDUCED PADDING AND TEXT SIZE TO FIX "TOO BIG" ISSUE ✨ */}
      <div className="relative z-10 w-full border-y border-white/5 bg-[#050505] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-[0.4em]">Client Perspectives</h2>
          </div>

          {loading ? null : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="flex flex-col items-center text-center">
                  <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  {/* Reduced from text-3xl to text-xl */}
                  <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed tracking-wide mb-6 md:mb-8 italic">
                    "{review.text}"
                  </p>
                  <div className="w-6 md:w-8 h-px bg-purple-500 mb-4 md:mb-6"></div>
                  <h4 className="text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase">{review.name}</h4>
                  <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-1 md:mt-2">Verified Client</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- CATEGORY OVERHAUL --- */}
      <div className="relative z-10 w-full px-4 sm:px-8 pb-24 pt-20 md:pb-40 md:pt-32 max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16 text-center">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6">Curated Departments</h2>
          <p className="text-sm md:text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">Explore our dedicated segments. Precision engineered for your lifestyle.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          
          <Link href="/market?category=Stanley+tumblers" className="lg:col-span-2 group relative h-[250px] md:h-[500px] bg-zinc-900 overflow-hidden block">
            {/* ✨ ALL GRAYSCALES REMOVED BELOW ✨ */}
            <img src="Stanley.webp" alt="Tumblers" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Stanley</h3>
              <p className="text-[10px] md:text-sm font-bold text-purple-400 uppercase tracking-[0.3em]">Hydration Mastered</p>
            </div>
          </Link>

          <Link href="/market?category=Decoration" className="group relative h-[250px] md:h-[500px] bg-zinc-900 overflow-hidden block">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop" alt="Decor" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Decor</h3>
              <p className="text-[10px] md:text-sm font-bold text-purple-400 uppercase tracking-[0.3em]">Modern Living</p>
            </div>
          </Link>

          <Link href="/market?category=Beauty+products" className="group relative h-[250px] md:h-[400px] bg-zinc-900 overflow-hidden block">
            <img src="makeup.jpg" alt="Beauty" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Beauty</h3>
              <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Shop Glow</p>
            </div>
          </Link>

          <Link href="/market?category=Prayer+Mat" className="group relative h-[250px] md:h-[400px] bg-zinc-900 overflow-hidden block">
            <img src="mat.jpeg" alt="Prayer Mats" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Prayer</h3>
              <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Premium Weaves</p>
            </div>
          </Link>

          <Link href="/market?category=MiNi+Fan" className="group relative h-[250px] md:h-[400px] bg-zinc-900 overflow-hidden block">
            <img src="fan.jpg" alt="Fans" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">Fans</h3>
              <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.3em]">Aero-Dynamic</p>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}