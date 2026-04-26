"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase'; // Connected to your live database

// Define our product structure
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  tag: string | null;
  rating: number;
  reviews: number;
  aiMatch: number;
  stock: number;
  description: string;
  image: string;
};

export default function ProductDetails() {
  const params = useParams();
  
  // Live Database States
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [viewers, setViewers] = useState(12);

  // Fake live network activity ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(3, prev + Math.floor(Math.random() * 5) - 2));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Fetch real data from Supabase based on the URL ID
  useEffect(() => {
    async function fetchProductData() {
      try {
        // 1. Fetch the main product
        const { data: mainProduct, error: mainError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single(); // Gets exactly one row

        if (mainError) throw mainError;
        if (mainProduct) setProduct(mainProduct);

        // 2. Fetch 3 other products for the recommendations section
        const { data: recs, error: recsError } = await supabase
          .from('products')
          .select('*')
          .neq('id', params.id) // Don't include the current product
          .limit(3);

        if (!recsError && recs) setRecommendations(recs);

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProductData();
    }
  }, [params.id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-6xl mx-auto flex gap-12 animate-pulse">
        <div className="w-full lg:w-1/2 h-[500px] bg-zinc-900/50 rounded-[2rem]"></div>
        <div className="w-full lg:w-1/2 space-y-6 pt-10">
          <div className="w-32 h-6 bg-zinc-900/50 rounded-full"></div>
          <div className="w-3/4 h-12 bg-zinc-900/50 rounded-xl"></div>
          <div className="w-48 h-8 bg-zinc-900/50 rounded-xl"></div>
          <div className="w-full h-32 bg-zinc-900/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-black text-white mb-4">404 - Asset Not Found</h1>
        <p className="text-zinc-400 mb-8">The requested product does not exist in the GOBAAZAAR database.</p>
        <Link href="/market" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors">
          Return to Market
        </Link>
      </div>
    );
  }

  const stockPercentage = Math.min(100, Math.max(5, (product.stock / 50) * 100));

  return (
    <div className="min-h-screen pb-24 pt-8 animate-fade-in">
      
      {/* Header Row: Breadcrumbs & Network Status */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/market" className="hover:text-blue-400 transition-colors">Market</Link>
          <span>/</span>
          <span className="text-orange-400">{product.category}</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border border-white/5 rounded-full backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span className="text-white">{viewers}</span> Network Nodes Viewing
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        
        {/* --- LEFT COLUMN: MEDIA GALLERY --- */}
        <div className="space-y-4">
          <div className="w-full h-[400px] md:h-[550px] bg-black border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center relative group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Live Database Image */}
            {product.image && (
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700" />
            )}

            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-orange-500/10 z-0 mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,1)] z-20 animate-[scan_3s_ease-in-out_infinite]"></div>
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
            `}} />

            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              {product.tag && (
                <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((thumb) => (
              <div key={thumb} className={`h-20 sm:h-24 bg-zinc-900/40 border rounded-2xl overflow-hidden cursor-pointer transition-all ${thumb === 1 ? 'border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-white/5 hover:border-zinc-500 hover:bg-zinc-800'}`}>
                {/* Reusing main image for thumbnails to simulate a gallery */}
                <img src={product.image} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: PRODUCT DATA --- */}
        <div className="flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">{product.category}</p>
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.2)]">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{product.aiMatch}% AI Signature Match</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-light text-white">${product.price}</h2>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span className="text-sm font-bold text-white">{product.rating}</span>
              <span className="text-sm text-zinc-500 underline cursor-pointer hover:text-zinc-300">({product.reviews} Verified Reviews)</span>
            </div>
          </div>

          {/* Live Stock Indicator */}
          <div className="mb-8 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className={`${product.stock < 10 ? 'text-orange-500 animate-pulse' : 'text-zinc-400'}`}>
                {product.stock < 10 ? 'High Demand Warning' : 'Global Inventory'}
              </span>
              <span className="text-white">{product.stock} Units Left</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${product.stock < 10 ? 'bg-orange-500' : 'bg-blue-500'}`}
                style={{ width: `${stockPercentage}%` }}
              ></div>
            </div>
          </div>

          <p className="text-zinc-400 leading-relaxed font-light mb-10">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-2 sm:w-32">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-white p-2 transition-colors">-</button>
              <span className="font-bold text-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-white p-2 transition-colors">+</button>
            </div>

            <button 
              onClick={() => window.dispatchEvent(new Event('openCart'))}
              className="flex-1 bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3"
            >
              <span>Add to Cart</span>
              <span>•</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>

          <div className="border border-white/5 bg-zinc-900/40 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="flex border-b border-white/5">
              {['overview', 'specs', 'ledger'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-zinc-800/80 text-white border-b-2 border-orange-500 shadow-[inset_0_-10px_20px_rgba(249,115,22,0.1)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}
                >
                  {tab === 'overview' ? 'AI Synthesis' : tab === 'specs' ? 'Tech Specs' : 'Ledger'}
                </button>
              ))}
            </div>
            <div className="p-6 h-32">
              {activeTab === 'overview' && (
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  <span className="text-orange-400 font-bold">System Note:</span> Based on real-time neural network feedback, 96% of users report maximum satisfaction with the build quality and aesthetic profile of this asset. Delivery routing is currently optimized for your location.
                </p>
              )}
              {activeTab === 'specs' && (
                <ul className="space-y-3 text-sm text-zinc-400 font-light">
                  <li className="flex justify-between items-center border-b border-white/5 pb-1"><span className="text-zinc-500">Material Core:</span> <span className="text-white font-medium">Premium Grade Synthetics</span></li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-1"><span className="text-zinc-500">Logistics Weight:</span> <span className="text-white font-medium">Optimized Class C</span></li>
                  <li className="flex justify-between items-center"><span className="text-zinc-500">Node Compatibility:</span> <span className="text-blue-400 font-bold">Universal</span></li>
                </ul>
              )}
              {activeTab === 'ledger' && (
                <div className="space-y-2 text-sm text-zinc-400 font-light font-mono">
                  <div className="flex justify-between"><span className="text-zinc-500">Smart Contract:</span> <span className="text-orange-400">0x8F9...2A1B</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Origin Block:</span> <span className="text-white">#1894920</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Authentication:</span> <span className="text-green-400">Cryptographically Secured</span></div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- NEURAL NETWORK RECOMMENDATIONS --- */}
      <div className="border-t border-white/5 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">You May Also Like</h3>
            <p className="text-zinc-400 text-sm mt-1">Products frequently purchased alongside {product.name}.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Link href={`/market/${rec.id}`} key={rec.id} className="group bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <div className="w-full h-48 bg-black relative overflow-hidden flex items-center justify-center">
                {rec.image && (
                  <img src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{rec.category}</p>
                <h4 className="font-bold text-zinc-100 group-hover:text-white transition-colors truncate">{rec.name}</h4>
                <p className="text-zinc-400 text-sm">${rec.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}