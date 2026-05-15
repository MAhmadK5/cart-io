"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function BlogPage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ✨ FETCH LIVE DATABASE PRODUCTS ✨
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4);
          
        if (data && !error) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error("Error fetching lab products:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      {/* ✨ AMBIENT BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>
      <div className="absolute top-0 right-0 w-full md:w-[800px] h-[400px] md:h-[600px] bg-purple-600/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-full md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="min-h-screen pb-24 sm:pb-32 pt-28 sm:pt-32 md:pt-40 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto animate-fade-in">
        
        {/* --- HEADER --- */}
        <div className="mb-12 sm:mb-16 md:mb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-zinc-900/80 border border-white/10 mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Welcome To</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black text-white tracking-tighter uppercase leading-none mb-4 sm:mb-6 drop-shadow-2xl">
            CARTIO LAB
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed px-2">
            The intersection of raw utility and uncompromised luxury. Discover the ethos behind the assets we curate.
          </p>
        </div>

        {/* ========================================= */}
        {/* ✨ THE FOUNDER STORY (THE ARCHITECT) ✨ */}
        {/* ========================================= */}
        <div className="mb-16 sm:mb-24 md:mb-32 relative w-full rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
          
          <div className="flex flex-col lg:flex-row relative z-10">
            
            {/* Cinematic Image Side */}
            <div className="w-full lg:w-1/2 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] overflow-hidden bg-zinc-950 border-b lg:border-b-0 lg:border-r border-white/5">
               <img 
                 src="/CEO.png" 
                 alt="The Architect Workspace" 
                 className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
               />
               <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            </div>

            {/* Typography & Quote Side */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-black/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none -mt-12 sm:-mt-20 lg:mt-0 relative rounded-t-3xl lg:rounded-none">
               <p className="text-[9px] sm:text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-3 sm:mb-4 flex items-center gap-2">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 The Architect
               </p>
               
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8 leading-tight">
                 Vision Built <br/><span className="text-zinc-500">On Precision.</span>
               </h2>
               
               <div className="relative">
                 <svg className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-8 h-8 sm:w-12 sm:h-12 text-white/5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                 <p className="text-zinc-300 text-xs sm:text-sm md:text-base font-light leading-relaxed mb-8 sm:mb-10 italic">
                   "CARTIO wasn't born out of a desire to just sell products. It was engineered out of a frustration with the ordinary. I wanted to build an ecosystem where premium isn't an upsell—it's the baseline. Every asset curated in this lab represents an obsession with aesthetics, absolute functionality, and uncompromised luxury."
                 </p>
               </div>
               
               <div className="flex items-center gap-4 sm:gap-5 pt-5 sm:pt-6 border-t border-white/10">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 font-black text-lg sm:text-xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                   MJ
                 </div>
                 <div>
                   <p className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-0.5">Muhammad Jawad</p>
                   <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Founder & CEO</p>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* ========================================= */}
        {/* ✨ THE BRAND MANIFESTO ✨ */}
        {/* ========================================= */}
        <div className="mb-16 sm:mb-24 md:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center px-2">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4 sm:mb-6">
              Defy The <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Ordinary.</span>
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6 text-zinc-400 font-light text-sm sm:text-base md:text-lg leading-relaxed border-l-2 border-white/10 pl-4 sm:pl-6 md:pl-10">
            <p>
              We don't do mass market. We don't do "good enough." CARTIO is a strictly curated nexus for individuals who demand excellence in every facet of their lives. 
            </p>
            <p>
              From the hydration vessel on your executive desk to the prayer mat in your sanctuary, every asset we deploy has been vetted for absolute peak performance and undeniable aesthetic dominance. We are not a store; we are an upgrade to your lifestyle.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* ✨ THE GENESIS DROP (MESSAGE POSTER) ✨ */}
        {/* ========================================= */}
        <div className="mb-16 sm:mb-24 md:mb-32 relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl flex items-center justify-center">
          <img 
            src="/CARTIO.png" 
            alt="The Genesis Drop Poster" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/95"></div>
          <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>

          <div className="relative z-10 p-6 sm:p-8 md:p-16 flex flex-col items-center text-center max-w-4xl mx-auto">
            <span className="px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 sm:mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Phase 01
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-8 leading-tight drop-shadow-lg">
              Oh, Hey There! 👋 <br />
              <span className="text-purple-400 text-2xl sm:text-3xl md:text-5xl lg:text-6xl block mt-2">The Genesis Drop 🚀</span>
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm md:text-xl font-light leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              The wait is finally over. Our very first curated drop has officially landed in the Lab. Come say hi, explore the collection, and find your new favorite obsession. Welcome to the CARTIO family! 🖤✨
            </p>
            <Link href="/market" className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-black font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-xl group flex items-center gap-2 sm:gap-3">
              Explore The Drop
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>

        {/* ========================================= */}
        {/* ✨ SHOP THE LAB (LIVE DB PRODUCTS) ✨ */}
        {/* ========================================= */}
        <div className="mb-16 sm:mb-24 md:mb-32">
          <div className="flex items-end justify-between border-b border-white/10 pb-4 sm:pb-6 mb-6 sm:mb-10">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1 sm:mb-2">The Arsenal</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Shop The Lab</h2>
            </div>
            <Link href="/market" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              View All <span className="text-sm leading-none">&rarr;</span>
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="bg-zinc-900/40 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] h-[250px] sm:h-[300px] md:h-[400px] animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="w-full bg-zinc-900/20 border border-white/5 rounded-[2rem] p-8 sm:p-12 text-center">
              <p className="text-zinc-500 font-light tracking-widest uppercase text-xs sm:text-sm">No assets currently featured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/market/${product.id}`} className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/40 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                  {/* ✨ REDUCED PADDING ON MOBILE ✨ */}
                  <div className="relative bg-black w-full aspect-[4/5] overflow-hidden flex items-center justify-center p-3 sm:p-6">
                    {product.image && <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-2 sm:p-4 transition-all duration-1000 group-hover:scale-110" />}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1 border-t border-white/5">
                    <p className="text-[8px] sm:text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2 truncate">{product.category}</p>
                    <h3 className="font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm sm:text-base md:text-lg line-clamp-1 mb-2 sm:mb-4">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="font-light text-zinc-300 tracking-wider text-sm sm:text-base md:text-xl">Rs. {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-6 sm:mt-8 flex justify-center sm:hidden">
            <Link href="/market" className="w-full text-center px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              View All Assets
            </Link>
          </div>
        </div>

        {/* --- NEWSLETTER CTA --- */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-blue-600/20 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none"></div>
          
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4 relative z-10">Join The Inner Circle</h3>
          <p className="text-zinc-400 font-light text-xs sm:text-sm md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto relative z-10 px-2">
            Subscribe to the CARTIO network to receive early access to new drops and encrypted discount codes directly to your inbox.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS" 
              required
              className="flex-1 bg-black/50 border border-white/10 text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl outline-none focus:border-blue-500 transition-colors font-mono text-xs sm:text-sm tracking-widest placeholder:text-zinc-600"
            />
            <button 
              type="button" 
              onClick={() => alert('Subscribed to CARTIO Network!')}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </>
  );
}