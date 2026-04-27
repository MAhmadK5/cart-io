"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
// ✨ Added this to read the URL! ✨
import { useSearchParams } from 'next/navigation'; 
import { supabase } from '../../lib/supabase'; 

const CATEGORIES = ["All", "MiNi Fan", "Stanley tumblers", "Prayer Mat", "Beauty products", "Tables", "Decoration"];

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

export default function MarketPage() {
  // Read the URL
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Set the default category to whatever is in the URL, or "All" if the URL is empty
  const [activeCategory, setActiveCategory] = useState(urlCategory || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // If the URL changes while we are ALREADY on the page, update the category!
  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    return b.aiMatch - a.aiMatch;
  });

  const getCategoryCount = (catName: string) => {
    if (catName === "All") return products.length;
    return products.filter(p => p.category === catName).length;
  };

  return (
    <div className="min-h-screen pb-24 pt-8">
      <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Database Connected</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500">Market</span>
          </h1>
          <p className="text-zinc-400 text-lg">Curated inventory powered by real-time cloud data.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Sort:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900/80 border border-zinc-700 text-white text-sm rounded-xl py-2 px-4 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <option value="featured">AI Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-32 space-y-8 bg-zinc-900/20 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700/50 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 shadow-inner"
              />
            </div>

            <div>
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Filters
              </h3>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((category) => {
                  const count = getCategoryCount(category);
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`group flex items-center justify-between text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                        isActive 
                          ? "bg-blue-600/10 border border-blue-500/30 text-white shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"
                      }`}
                    >
                      <span>{category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="bg-black/40 border border-white/5 rounded-3xl h-96 animate-pulse p-6 flex flex-col justify-end">
                  <div className="w-16 h-4 bg-zinc-800 rounded mb-2"></div>
                  <div className="w-full h-6 bg-zinc-800 rounded mb-4"></div>
                  <div className="w-24 h-6 bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-16 text-center backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Query Returned Zero Results</h3>
              <p className="text-zinc-400 mb-6">No items match your current parameters.</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All"); setSortBy("featured");}}
                className="px-8 py-3 bg-white text-black hover:bg-blue-500 hover:text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all"
              >
                Reset Parameters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="relative w-full h-64 bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
                    )}

                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.tag && (
                        <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
                      <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span className="text-[10px] font-bold text-white">{product.aiMatch}% Match</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openCart')); }}
                        className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 bg-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{product.category}</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span className="text-[10px] text-zinc-400">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>
                    
                    <Link href={`/market/${product.id}`} className="block group/title">
                      <h3 className="text-xl font-bold text-zinc-100 group-hover/title:text-orange-400 transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <p className="text-2xl font-light text-white tracking-tight">Rs. {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}