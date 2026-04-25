"use client";

import { useState } from 'react';
import Link from 'next/link';

// Expanded dummy data for the market
const marketProducts = [
  { id: 1, name: "Graphite Urban Jacket", price: "$120", category: "Apparel", image: "Image" },
  { id: 2, name: "Premium White Denim", price: "$90", category: "Apparel", image: "Image" },
  { id: 3, name: "Cyber-Chic Neural Headset", price: "$350", category: "Tech", image: "Image" },
  { id: 4, name: "Matte Black Smartwatch", price: "$250", category: "Tech", image: "Image" },
  { id: 5, name: "Neon-Trimmed Sneakers", price: "$180", category: "Apparel", image: "Image" },
  { id: 6, name: "Haptic Feedback Gloves", price: "$210", category: "Tech", image: "Image" },
  { id: 7, name: "Titanium Aviators", price: "$150", category: "Accessories", image: "Image" },
  { id: 8, name: "Minimalist Leather Backpack", price: "$290", category: "Accessories", image: "Image" },
];

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Simple filter logic
  const filteredProducts = activeCategory === 'All' 
    ? marketProducts 
    : marketProducts.filter(p => p.category === activeCategory);

  return (
    <div className="pt-10 pb-24 min-h-screen flex flex-col md:flex-row gap-8 relative z-10">
      
      {/* --- SIDEBAR FILTERS --- */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-32">
          
          <h2 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Categories
          </h2>
          
          <div className="flex flex-col gap-3">
            {['All', 'Apparel', 'Tech', 'Accessories'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeCategory === cat 
                    ? 'text-orange-400' 
                    : 'text-zinc-500 hover:text-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Price Range
            </h2>
            <input type="range" className="w-full accent-blue-500" />
            <div className="flex justify-between text-xs text-zinc-500 mt-2 font-bold">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>
          
        </div>
      </aside>

      {/* --- PRODUCT GRID --- */}
      <div className="flex-grow">
        
        {/* Market Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500">Market</span>
            </h1>
            <p className="text-zinc-400 mt-2 text-sm font-medium tracking-wide">Showing {filteredProducts.length} results for "{activeCategory}"</p>
          </div>
          
          {/* Sort Dropdown */}
          <select className="bg-zinc-900/80 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl p-4 transition-all duration-300 hover:border-blue-500/40 hover:bg-zinc-900/80 overflow-hidden flex flex-col"
            >
              {/* Product Image */}
              <div className="w-full h-64 bg-zinc-950 border border-white/5 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                <span className="text-zinc-700 text-xs font-black uppercase tracking-widest group-hover:scale-110 transition-transform duration-500">{product.image}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  
                  {/* ✨ Add to Cart Trigger */}
                  <button 
                    onClick={() => window.dispatchEvent(new Event('openCart'))}
                    className="bg-blue-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    Quick Add
                  </button>
                  
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex-grow flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                  <Link href={`/market/${product.id}`}>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition-colors cursor-pointer">{product.name}</h3>
                  </Link>
                </div>
                <p className="text-zinc-300 font-black">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}