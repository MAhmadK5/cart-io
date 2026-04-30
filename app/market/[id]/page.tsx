"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../context/CartContext';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  tag: string | null;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  image: string;
  gallery?: string[]; 
};

export default function ProductDetails() {
  const params = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function fetchProductData() {
      try {
        const { data: mainProduct, error: mainError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (mainError) throw mainError;
        if (mainProduct) {
          setProduct(mainProduct);
          setActiveImage(mainProduct.image);
        }

        const { data: recs, error: recsError } = await supabase
          .from('products')
          .select('*')
          .neq('id', params.id)
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

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-pulse relative z-10">
        <div className="w-full lg:w-1/2 aspect-square bg-zinc-900/40 backdrop-blur-xl rounded-[2rem]"></div>
        <div className="w-full lg:w-1/2 space-y-8 pt-10">
          <div className="w-32 h-4 bg-zinc-900/50 rounded-full"></div>
          <div className="w-3/4 h-16 bg-zinc-900/50 rounded-xl"></div>
          <div className="w-48 h-10 bg-zinc-900/50 rounded-xl"></div>
          <div className="w-full h-40 bg-zinc-900/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Asset Not Found</h1>
        <p className="text-xl md:text-2xl text-zinc-400 mb-10 font-light">This exclusive item is no longer available in the CART IO network.</p>
        <Link href="/market" className="px-10 py-5 bg-white text-black rounded-none font-black uppercase tracking-[0.3em] text-sm md:text-base hover:bg-purple-600 hover:text-white transition-all duration-300">
          Return to Boutique
        </Link>
      </div>
    );
  }
  
  const galleryImages = Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <>
      {/* ✨ THE ANIMATED LUXURY BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-40"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950 -z-20"></div>

      <div className="min-h-screen pb-32 pt-12 md:pt-16 max-w-7xl mx-auto px-4 sm:px-8 animate-fade-in relative z-10">
        
        {/* Editorial Breadcrumbs */}
        <div className="mb-10 flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
          <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <span className="text-zinc-700">/</span>
          <Link href="/market" className="hover:text-purple-400 transition-colors">Boutique</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-white">{product.category}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-32">
          
          {/* --- LEFT: MASSIVE EDITORIAL GALLERY --- */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="w-full aspect-[4/5] sm:aspect-square bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center p-6 md:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
              
              {product.tag && (
                <div className="absolute top-8 left-8">
                  <span className="px-5 py-2 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">
                    {product.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {galleryImages.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 md:w-28 md:h-28 shrink-0 bg-zinc-900/40 backdrop-blur-md rounded-2xl md:rounded-[1.5rem] overflow-hidden p-3 transition-all duration-300 ${activeImage === img ? 'ring-2 ring-purple-500 opacity-100 shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'border border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt={`${product.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: PRODUCT TYPOGRAPHY --- */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <p className="text-xs md:text-sm text-purple-400 font-bold uppercase tracking-[0.4em] mb-4">
              {product.category}
            </p>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 uppercase">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
              <h2 className="text-3xl md:text-4xl font-light text-zinc-300 tracking-wide">Rs. {product.price.toLocaleString()}</h2>
              <div className="w-px h-8 bg-zinc-800"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span className="text-lg font-bold text-white">{product.rating}</span>
                <span className="text-sm md:text-base text-zinc-500 uppercase tracking-widest ml-2 font-light">({product.reviews} Client Reviews)</span>
              </div>
            </div>

            <p className="text-lg md:text-2xl text-zinc-400 font-light leading-relaxed mb-10 tracking-wide">
              {product.description || "Designed for premium quality and everyday reliability. Add this essential asset to your modern lifestyle collection today."}
            </p>

            {/* Exclusive Stock Status */}
            <div className="mb-10 flex items-center gap-4 bg-zinc-900/30 border border-white/5 p-5 rounded-2xl w-max">
               <span className={`flex w-3 h-3 rounded-full ${product.stock > 0 ? (product.stock < 10 ? 'bg-red-500 animate-ping' : 'bg-purple-500') : 'bg-zinc-700'}`}></span>
               <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] ${product.stock > 0 ? (product.stock < 10 ? 'text-red-400' : 'text-purple-400') : 'text-zinc-500'}`}>
                  {product.stock > 0 ? (product.stock < 10 ? `Extremely Limited: ${product.stock} Units Remaining` : 'In Stock & Ready for Dispatch') : 'Currently Unavailable'}
               </span>
            </div>

            {/* Huge Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center justify-between bg-zinc-900/80 border border-white/10 rounded-none px-4 py-2 sm:w-40 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-white w-12 h-12 flex items-center justify-center text-2xl transition-colors">-</button>
                <span className="font-black text-white text-xl">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-white w-12 h-12 flex items-center justify-center text-2xl transition-colors">+</button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white text-black hover:bg-purple-600 hover:text-white px-8 py-6 rounded-none font-black text-sm md:text-base uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 flex items-center justify-center gap-4"
              >
                {product.stock === 0 ? 'Out of Stock' : `Secure Item - Rs. ${(product.price * quantity).toLocaleString()}`}
              </button>
            </div>

            {/* CART IO Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-white/10">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                <div>
                  <p className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">Complimentary Shipping</p>
                  <p className="text-xs md:text-sm text-zinc-500 font-light tracking-wide">On all orders over Rs. 2500 nationwide.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <p className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">CART IO Verified</p>
                  <p className="text-xs md:text-sm text-zinc-500 font-light tracking-wide">100% authentic premium goods.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- CROSS-SELL: EDITORIAL LAYOUT --- */}
        <div className="border-t border-white/10 pt-20">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">Explore Further</h3>
              <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide">Curated additions for your collection.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Link href={`/market/${rec.id}`} key={rec.id} className="group relative aspect-[3/4] bg-zinc-900 overflow-hidden block rounded-2xl md:rounded-3xl">
                <img 
                  src={rec.image} 
                  alt={rec.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col justify-end h-1/2">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.3em] mb-2 md:mb-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:translate-y-4 group-hover:translate-y-0">{rec.category}</p>
                  <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2 line-clamp-2">{rec.name}</h4>
                  <p className="text-lg md:text-xl text-zinc-300 font-light tracking-widest">Rs. {rec.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}