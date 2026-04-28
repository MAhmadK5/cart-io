"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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

function MarketContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState(urlCategory || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // UI States
  const [gridLayout, setGridLayout] = useState<1 | 2 | 3 | 4>(3); 
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    // Automatically set sensible defaults based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) setGridLayout(2); // Mobile defaults to 2 columns
      else if (window.innerWidth < 1024) setGridLayout(3);
      else setGridLayout(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMin = minPrice === "" || product.price >= Number(minPrice);
    const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);
    const matchesStock = !inStockOnly || product.stock > 0;
    return matchesCategory && matchesSearch && matchesMin && matchesMax && matchesStock;
  });

  const displayedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    if (sortBy === "new") return b.id - a.id; 
    return b.aiMatch - a.aiMatch;
  });

  const getCategoryCount = (catName: string) => {
    if (catName === "All") return products.length;
    return products.filter(p => p.category === catName).length;
  };

  const getGridClass = () => {
    if (gridLayout === 1) return "grid-cols-1";
    if (gridLayout === 2) return "grid-cols-2";
    if (gridLayout === 3) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-4";
  };

  const renderFilters = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
          Categories
        </h3>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((category) => {
            const count = getCategoryCount(category);
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setShowMobileFilters(false); }}
                className={`group flex items-center justify-between text-left px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold ${
                  isActive 
                    ? "bg-blue-600/10 border border-blue-500/30 text-blue-400" 
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

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-black/50 border border-zinc-700 text-white text-sm rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="text-zinc-500">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-black/50 border border-zinc-700 text-white text-sm rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Stock Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">In Stock Only</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-blue-500' : 'bg-zinc-800'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${inStockOnly ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>
      
      <button 
        onClick={() => { setMinPrice(""); setMaxPrice(""); setInStockOnly(false); setActiveCategory("All"); setShowMobileFilters(false); }}
        className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 hover:text-white transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 pt-4 md:pt-8 relative">
      
      {/* --- PAGE HEADER --- */}
      <div className="mb-6 md:mb-10 pb-6 md:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Shop <span className="text-blue-500">Products</span>
          </h1>
          <p className="text-zinc-400 text-sm">Showing {displayedProducts.length} items</p>
        </div>
      </div>

      {/* --- CONTROL BAR --- */}
      <div className="sticky top-[80px] md:relative md:top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border border-white/5 rounded-2xl p-2 md:p-3 mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-wrap lg:flex-nowrap items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-grow min-w-[150px] order-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-zinc-800 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden order-2 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          Filters
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 order-3 bg-black border border-zinc-800 rounded-xl px-2 shrink-0">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white text-xs font-bold uppercase tracking-wider py-3 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="featured" className="bg-zinc-900">Recommended</option>
            <option value="new" className="bg-zinc-900">Newest</option>
            <option value="low" className="bg-zinc-900">Price: Low to High</option>
            <option value="high" className="bg-zinc-900">Price: High to Low</option>
          </select>
        </div>

        {/* ✨ Grid Layout Toggles (Now visible on Mobile too!) ✨ */}
        <div className="flex items-center gap-1 order-4 bg-black border border-zinc-800 p-1 rounded-xl shrink-0 ml-auto lg:ml-0">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setGridLayout(num as 1|2|3|4)}
              // Hide 3 and 4 column buttons on mobile screens
              className={`p-2 rounded-lg transition-colors ${num > 2 ? 'hidden md:block' : 'block'} ${gridLayout === num ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title={`${num} Columns`}
            >
              <div className={`grid gap-0.5 ${num === 1 ? 'grid-cols-1' : num === 2 ? 'grid-cols-2' : num === 3 ? 'grid-cols-3' : 'grid-cols-4'} w-4 h-4`}>
                {[...Array(num === 1 ? 2 : num * 2)].map((_, i) => (
                  <div key={i} className="bg-current rounded-[1px] w-full h-full"></div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 relative">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 space-y-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl">
            {renderFilters()}
          </div>
        </aside>

        {/* --- MOBILE FILTER DRAWER --- */}
        <div className={`lg:hidden fixed inset-0 z-[200] flex flex-col justify-end transition-all duration-300 ${showMobileFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${showMobileFilters ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMobileFilters(false)}></div>
          <div className={`relative bg-zinc-950 border-t border-zinc-800 rounded-t-[2rem] w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-6 pb-12 transition-transform duration-300 transform ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            {renderFilters()}
          </div>
        </div>

        {/* --- MAIN PRODUCT GRID --- */}
        <main className="flex-1">
          {loading ? (
            <div className={`grid gap-4 md:gap-6 ${getGridClass()}`}>
              {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                <div key={skeleton} className="bg-zinc-900/40 border border-white/5 rounded-3xl h-80 animate-pulse p-6 flex flex-col justify-end">
                  <div className="w-16 h-3 bg-zinc-800 rounded mb-2"></div>
                  <div className="w-full h-5 bg-zinc-800 rounded mb-4"></div>
                  <div className="w-24 h-5 bg-zinc-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] p-12 text-center backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
              <p className="text-zinc-400 text-sm mb-6">Try changing your filters or searching for something else.</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All"); setSortBy("featured"); setMinPrice(""); setMaxPrice(""); setInStockOnly(false);}}
                className="px-6 py-3 bg-white text-black hover:bg-blue-500 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 md:gap-6 ${getGridClass()}`}>
              {displayedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`group bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-900/60 relative ${gridLayout === 1 ? 'flex-row h-40' : ''}`}
                >
                  
                  {/* ✨ IMAGE AREA: Fixed to object-contain so it never crops! ✨ */}
                  <div className={`relative bg-zinc-950 overflow-hidden flex items-center justify-center p-4 ${gridLayout === 1 ? 'w-40 h-full shrink-0' : 'w-full aspect-square sm:aspect-auto sm:h-56'}`}>
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105" 
                      />
                    )}

                    {/* Stock Tags */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      {product.tag && (
                        <span className="px-2.5 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg">
                          {product.tag}
                        </span>
                      )}
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="px-2.5 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg animate-pulse">
                          Low Stock
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg">
                          Sold Out
                        </span>
                      )}
                    </div>
                    
                    {/* Hover Add Button (Desktop only) */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
                      <button 
                        disabled={product.stock === 0}
                        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openCart')); }}
                        className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-400 shadow-lg disabled:opacity-50 disabled:bg-zinc-600 disabled:cursor-not-allowed"
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className={`p-4 md:p-5 flex flex-col flex-1 relative z-10 ${gridLayout === 1 ? 'justify-center' : ''}`}>
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{product.category}</p>
                      
                      {gridLayout !== 1 && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          <span className="text-[10px] font-bold text-zinc-400">{product.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link href={`/market/${product.id}`} className="block group/title mb-3">
                      <h3 className={`font-bold text-zinc-100 group-hover/title:text-blue-400 transition-colors leading-snug ${gridLayout === 2 ? 'text-sm line-clamp-2' : 'text-lg line-clamp-1'}`}>
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <p className={`font-bold text-white tracking-tight ${gridLayout === 2 ? 'text-base' : 'text-xl'}`}>
                        Rs. {product.price.toLocaleString()}
                      </p>
                      
                      {/* Mobile add button (Always visible on mobile) */}
                      <button 
                        disabled={product.stock === 0}
                        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openCart')); }}
                        className="md:hidden w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
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

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-zinc-500 text-sm font-bold flex flex-col items-center gap-4"><span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span> Loading Products...</div>}>
      <MarketContent />
    </Suspense>
  );
}