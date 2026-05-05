"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 
import { supabase } from '../../lib/supabase'; 
import { useCart } from '../../context/CartContext'; 

type Product = {
  id: number;
  name: string;
  price: number;
  original_price: number | null; // ✨ ADDED ORIGINAL PRICE ✨
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
  const { addToCart } = useCart(); 

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(urlCategory || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // ✨ NEW: SALE FILTER ✨
  const [saleOnly, setSaleOnly] = useState(false);
  
  const [gridLayout, setGridLayout] = useState<1 | 2 | 3 | 4>(3); 
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (urlCategory && categories.includes(urlCategory)) setActiveCategory(urlCategory);
    if (urlCategory === "Sale") { setActiveCategory("All"); setSaleOnly(true); }
  }, [urlCategory, categories]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setGridLayout(2); 
      else if (window.innerWidth < 1024) setGridLayout(3);
      else setGridLayout(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const { data: catData } = await supabase.from('categories').select('name').order('name');
        if (catData) setCategories(["All", ...catData.map(c => c.name)]);

        const { data: prodData, error } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (error) throw error;
        if (prodData) setProducts(prodData);
      } catch (error) { console.error("Error fetching market data:", error); } finally { setLoading(false); }
    }
    fetchMarketData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMin = minPrice === "" || product.price >= Number(minPrice);
    const matchesMax = maxPrice === "" || product.price <= Number(maxPrice);
    const matchesStock = !inStockOnly || product.stock > 0;
    // ✨ SALE LOGIC ✨
    const matchesSale = !saleOnly || (product.original_price && product.original_price > product.price);
    
    return matchesCategory && matchesSearch && matchesMin && matchesMax && matchesStock && matchesSale;
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
    if (gridLayout === 3) return "grid-cols-2 lg:grid-cols-3";
    return "grid-cols-2 lg:grid-cols-4";
  };

  const handleSecureItem = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, quantity: 1 });
    window.dispatchEvent(new Event('openCart'));
  };

  const renderFilters = () => (
    <div className="space-y-10">
      
      {/* ✨ NEW: DEDICATED PROMOTIONS TOGGLE ✨ */}
      <div className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-widest text-red-500 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Flash Sales
            </span>
            <span className="text-[10px] text-zinc-400 font-light">View discounted assets</span>
          </div>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={saleOnly} onChange={() => setSaleOnly(!saleOnly)} />
            <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ${saleOnly ? 'bg-red-500' : 'bg-zinc-800'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${saleOnly ? 'transform translate-x-5' : ''}`}></div>
          </div>
        </label>
      </div>

      <div>
        <h3 className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Departments</h3>
        <div className="flex flex-col gap-2">
          {categories.map((category) => {
            const count = getCategoryCount(category);
            const isActive = activeCategory === category && !saleOnly; // Deselect if sale is active
            return (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setSaleOnly(false); setShowMobileFilters(false); }}
                className={`group flex items-center justify-between text-left px-5 py-3 rounded-2xl transition-all duration-300 text-sm md:text-base font-bold uppercase tracking-widest ${
                  isActive ? "bg-purple-600/10 border border-purple-500/30 text-purple-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"
                }`}
              >
                <span>{category}</span>
                <span className={`text-[9px] px-2.5 py-1 rounded-full ${isActive ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Investment Range</h3>
        <div className="flex items-center gap-4">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-black/50 border border-white/5 text-white text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors" />
          <span className="text-zinc-500">-</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-black/50 border border-white/5 text-white text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors" />
        </div>
      </div>
      <div>
        <label className="flex items-center justify-between cursor-pointer group p-4 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Available Only</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
            <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ${inStockOnly ? 'bg-purple-500' : 'bg-zinc-800'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${inStockOnly ? 'transform translate-x-5' : ''}`}></div>
          </div>
        </label>
      </div>
      <button onClick={() => { setMinPrice(""); setMaxPrice(""); setInStockOnly(false); setSaleOnly(false); setActiveCategory("All"); setShowMobileFilters(false); }} className="w-full py-4 bg-transparent border border-zinc-800 text-zinc-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-black transition-all duration-300">
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>

      <div className="min-h-screen pb-32 pt-16 md:pt-24 relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-16 pb-8 md:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5">
          <div>
            <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.4em] mb-4">The Catalog</p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              CARTIO <span className="text-zinc-600">MARKET</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm md:text-base font-light tracking-widest uppercase">
            Curating {displayedProducts.length} Premium Assets
          </p>
        </div>

        <div className="sticky top-[80px] md:relative md:top-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[2rem] p-3 md:p-4 mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-wrap lg:flex-nowrap items-center gap-3 md:gap-4">
          <div className="relative flex-grow min-w-[150px] order-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search catalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border border-white/5 text-white text-sm md:text-base rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          <button onClick={() => setShowMobileFilters(true)} className="lg:hidden order-2 flex items-center justify-center gap-2 bg-white text-black px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg> Filters
          </button>
          <div className="flex items-center gap-2 order-3 bg-black/50 border border-white/5 rounded-xl md:rounded-2xl px-4 shrink-0">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] py-3 md:py-4 focus:outline-none cursor-pointer appearance-none">
              <option value="featured" className="bg-zinc-900">Recommended</option>
              <option value="new" className="bg-zinc-900">New Arrivals</option>
              <option value="low" className="bg-zinc-900">Price: Ascending</option>
              <option value="high" className="bg-zinc-900">Price: Descending</option>
            </select>
          </div>
          <div className="flex items-center gap-1 order-4 bg-black/50 border border-white/5 p-1.5 rounded-xl md:rounded-2xl shrink-0 ml-auto lg:ml-0">
            {[1, 2, 3, 4].map((num) => (
              <button key={num} onClick={() => setGridLayout(num as 1|2|3|4)} className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-300 ${num > 2 ? 'hidden md:block' : 'block'} ${gridLayout === num ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`} title={`${num} Columns`}>
                <div className={`grid gap-0.5 md:gap-1 ${num === 1 ? 'grid-cols-1' : num === 2 ? 'grid-cols-2' : num === 3 ? 'grid-cols-3' : 'grid-cols-4'} w-4 h-4 md:w-5 md:h-5`}>
                  {[...Array(num === 1 ? 2 : num * 2)].map((_, i) => <div key={i} className="bg-current rounded-[1px] w-full h-full"></div>)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-10 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              {renderFilters()}
            </div>
          </aside>

          <div className={`lg:hidden fixed inset-0 z-[200] flex flex-col justify-end transition-all duration-500 ${showMobileFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${showMobileFilters ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMobileFilters(false)}></div>
            <div className={`relative bg-zinc-950 border-t border-white/10 rounded-t-[2.5rem] w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-6 md:p-8 pb-12 transition-transform duration-500 transform ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`}>
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              {renderFilters()}
            </div>
          </div>

          <main className="flex-1">
            {loading ? (
              <div className={`grid gap-4 md:gap-6 ${getGridClass()}`}>
                {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                  <div key={skeleton} className="bg-zinc-900/40 border border-white/5 rounded-[2rem] h-[400px] animate-pulse p-6 flex flex-col justify-end"></div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-16 md:p-24 text-center backdrop-blur-xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-zinc-500"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Asset Not Found</h3>
                <p className="text-zinc-400 text-lg mb-10 font-light">No items match your current refined criteria.</p>
                <button onClick={() => {setSearchQuery(""); setActiveCategory("All"); setSortBy("featured"); setMinPrice(""); setMaxPrice(""); setInStockOnly(false); setSaleOnly(false);}} className="px-10 py-5 bg-white text-black hover:bg-purple-600 hover:text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-none transition-all duration-300">Reset Catalog</button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-6 ${getGridClass()}`}>
                {displayedProducts.map((product) => {
                  const isOnSale = product.original_price && product.original_price > product.price;
                  
                  return (
                    <div key={product.id} className={`group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_50px_rgba(147,51,234,0.15)] relative ${gridLayout === 1 ? 'flex-row h-48 md:h-64' : ''}`}>
                      <div className={`relative bg-black overflow-hidden flex items-center justify-center p-6 md:p-8 ${gridLayout === 1 ? 'w-40 md:w-64 h-full shrink-0' : 'w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5]'}`}>
                        {product.image && <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-6 transition-all duration-1000 group-hover:scale-110" />}
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex flex-col gap-2">
                          {/* ✨ RED SALE BADGE ✨ */}
                          {isOnSale && <span className="px-3 md:px-4 py-1.5 bg-red-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl animate-pulse">Sale</span>}
                          
                          {product.tag && !isOnSale && <span className="px-3 md:px-4 py-1.5 bg-white text-black text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">{product.tag}</span>}
                          {product.stock <= 5 && product.stock > 0 && <span className="px-3 md:px-4 py-1.5 bg-orange-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">Rare Asset</span>}
                          {product.stock === 0 && <span className="px-3 md:px-4 py-1.5 bg-zinc-800 text-zinc-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">Vaulted</span>}
                        </div>
                        
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:flex items-center justify-center z-20">
                          <button 
                            disabled={product.stock === 0}
                            onClick={(e) => handleSecureItem(e, product)}
                            className="translate-y-8 group-hover:translate-y-0 transition-all duration-500 px-8 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-none hover:bg-purple-600 hover:text-white shadow-2xl disabled:opacity-0"
                          >
                            {product.stock === 0 ? 'Unavailable' : 'Secure Item'}
                          </button>
                        </div>
                      </div>

                      <div className={`p-5 md:p-8 flex flex-col flex-1 relative z-10 ${gridLayout === 1 ? 'justify-center' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-[9px] md:text-[10px] text-purple-400 font-bold uppercase tracking-[0.4em]">{product.category}</p>
                        </div>
                        
                        <Link href={`/market/${product.id}`} className="block group/title mb-4 md:mb-6">
                          <h3 className={`font-black text-white group-hover/title:text-purple-400 transition-colors uppercase tracking-tight leading-snug ${gridLayout === 2 ? 'text-lg md:text-2xl line-clamp-2' : 'text-2xl md:text-3xl line-clamp-1'}`}>{product.name}</h3>
                        </Link>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <p className={`font-light ${isOnSale ? 'text-red-400 font-bold' : 'text-zinc-300'} tracking-wider ${gridLayout === 2 ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>Rs. {product.price.toLocaleString()}</p>
                            
                            {/* ✨ CROSSED OUT ORIGINAL PRICE ✨ */}
                            {isOnSale && (
                              <p className="text-sm md:text-base text-zinc-500 line-through tracking-wider">
                                Rs. {product.original_price?.toLocaleString()}
                              </p>
                            )}
                          </div>

                          <button 
                            disabled={product.stock === 0}
                            onClick={(e) => handleSecureItem(e, product)}
                            className="lg:hidden w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-purple-600 hover:text-white transition-colors disabled:opacity-50 shrink-0"
                          >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-purple-500 text-sm font-bold flex flex-col items-center gap-6"><span className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span> Accessing Vault...</div>}>
      <MarketContent />
    </Suspense>
  );
}