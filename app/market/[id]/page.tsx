"use client";

import { useState, useEffect, useRef } from 'react';
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
  colors?: string[]; 
  is_customizable?: boolean; 
};

type ChatMessage = {
  text: string;
  sender: 'user' | 'gemini';
};

const PRODUCT_QUESTIONS = [
  "What are the main features?",
  "How should I maintain this?",
  "Is this a good gift?",
  "What makes this premium?",
  "Are there styling tips?"
];

export default function ProductDetails() {
  const params = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  
  // ✨ NEW: Cinematic Zoom State ✨
  const [isZoomed, setIsZoomed] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // ✨ NEW: Expandable Review Form Toggle ✨
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiInput, setGeminiInput] = useState('');
  const [isGeminiTyping, setIsGeminiTyping] = useState(false);
  const [geminiMessages, setGeminiMessages] = useState<ChatMessage[]>([]);
  const geminiEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const { data: mainProduct, error: mainError } = await supabase.from('products').select('*').eq('id', params.id).single();
        if (mainError) throw mainError;
        
        if (mainProduct) { 
          setProduct(mainProduct); 
          setActiveImage(mainProduct.image); 
          
          if (mainProduct.colors && mainProduct.colors.length > 0) {
            setSelectedColor(mainProduct.colors[0]);
          }

          setGeminiMessages([
            { text: `I am the CARTIO Gemini Oracle. I am analyzing the ${mainProduct.name}. Select a query below or type your own question to learn more about this asset.`, sender: 'gemini' }
          ]);
        }

        const { data: reviewData } = await supabase.from('reviews').select('*').eq('product_id', params.id).order('created_at', { ascending: false });
        if (reviewData) setReviews(reviewData);

        const { data: recs } = await supabase.from('products').select('*').neq('id', params.id).limit(10);
        if (recs) setRecommendations(recs);

      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally { setLoading(false); }
    }
    if (params.id) fetchProductData();
  }, [params.id]);

  useEffect(() => {
    geminiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [geminiMessages, isGeminiTyping, isGeminiOpen]);

  // Handle Escape key to close zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        color: selectedColor || undefined,
        customText: customText.trim() || undefined
      });
      window.dispatchEvent(new Event('openCart')); 
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewForm.comment.trim()) return;
    
    setIsSubmittingReview(true);
    try {
      const payload = {
        product_id: product.id,
        user_name: reviewForm.name.trim() || 'Anonymous Client',
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim() // Make sure this matches your DB!
      };

      const { error } = await supabase.from('reviews').insert([payload]);
      if (error) throw error;

      const newReview = { ...payload, id: Math.random(), created_at: new Date().toISOString() };
      setReviews([newReview, ...reviews]);
      setReviewForm({ name: '', rating: 5, comment: '' });
      setIsReviewFormOpen(false); // Close form on success
      
    } catch (err) {
      console.error(err);
      alert("Failed to post feedback. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const askGemini = async (text: string) => {
    if (!text.trim() || !product || isGeminiTyping) return;

    setGeminiMessages(prev => [...prev, { text: text, sender: 'user' }]);
    setGeminiInput('');
    setIsGeminiTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey || apiKey === "your_actual_api_key_here") {
        throw new Error("Missing API Key. Please add NEXT_PUBLIC_GEMINI_API_KEY.");
      }

      const systemPrompt = `You are an exclusive luxury e-commerce assistant for CARTIO, powered by Gemini. The customer is asking about a product they are viewing. 
      Product Name: ${product.name}. Category: ${product.category}. Description: ${product.description}. Price: Rs. ${product.price}. 
      Customer's Question: ${text}
      Keep your response concise, luxurious, deeply knowledgeable, and strictly related to the product or CARTIO's high-end brand tone. Structure with small paragraphs if needed.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Google API rejected the request.");
      
      if (data.candidates && data.candidates.length > 0) {
        setGeminiMessages(prev => [...prev, { text: data.candidates[0].content.parts[0].text, sender: 'gemini' }]);
      } else {
        throw new Error("No readable text was returned from the AI.");
      }
    } catch (error: any) {
      setGeminiMessages(prev => [...prev, { text: `System Error: ${error.message}`, sender: 'gemini' }]);
    } finally {
      setIsGeminiTyping(false);
    }
  };
const handleGeminiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askGemini(geminiInput);
  };
  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-pulse relative z-10">
        <div className="w-full lg:w-1/2 aspect-square bg-zinc-900/40 backdrop-blur-xl rounded-[2rem]"></div>
        <div className="w-full lg:w-1/2 space-y-8 pt-10"><div className="w-32 h-4 bg-zinc-900/50 rounded-full"></div><div className="w-3/4 h-16 bg-zinc-900/50 rounded-xl"></div><div className="w-48 h-10 bg-zinc-900/50 rounded-xl"></div><div className="w-full h-40 bg-zinc-900/50 rounded-xl"></div></div>
      </div>
    );
  }

  if (!product) return null;
  const galleryImages = Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery : [product.image];
  
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : (product.rating || 5.0).toFixed(1);

  const hasColors = product.colors && product.colors.length > 0;
  const allowNotes = product.is_customizable || hasColors;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-40"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950 -z-20"></div>

      {/* ✨ NEW: FULLSCREEN ZOOM OVERLAY ✨ */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[99999] bg-zinc-950/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-8 right-8 w-12 h-12 bg-white/10 text-white hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img 
            src={activeImage} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain drop-shadow-[0_0_100px_rgba(255,255,255,0.1)] select-none"
            onClick={(e) => e.stopPropagation()} // Prevent click on image from closing
          />
        </div>
      )}

      {/* GEMINI CHAT DRAWER */}
      <div className={`fixed inset-0 z-[9999] ${isGeminiOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${isGeminiOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={() => setIsGeminiOpen(false)}></div>
        
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950/90 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.3)] flex flex-col transition-transform duration-500 pointer-events-auto ${isGeminiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animate-gradient-x"></div>

          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-purple-500/30 overflow-hidden">
                <svg className="w-7 h-7 text-white animate-[spin_4s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/></svg>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 uppercase tracking-tighter leading-none mb-1">Gemini Oracle</h2>
              </div>
            </div>
            <button onClick={() => setIsGeminiOpen(false)} className="w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center group">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
            {geminiMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} relative z-10`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.sender === 'user' ? 'bg-gradient-to-br from-zinc-100 to-zinc-300 text-black rounded-tr-sm font-medium' : 'bg-zinc-900 border border-purple-500/20 text-zinc-200 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isGeminiTyping && (
              <div className="flex justify-start relative z-10">
                <div className="bg-zinc-900 border border-purple-500/20 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={geminiEndRef} />
          </div>

          <div className="bg-black/60 backdrop-blur-md pt-4 pb-2 px-5 flex gap-2 overflow-x-auto custom-scrollbar border-t border-white/5 shrink-0">
            {PRODUCT_QUESTIONS.map((action, index) => (
              <button key={index} onClick={() => askGemini(action)} disabled={isGeminiTyping} className="shrink-0 px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-white hover:border-purple-500 transition-all disabled:opacity-50 whitespace-nowrap">
                {action}
              </button>
            ))}
          </div>

          <div className="p-5 bg-black/80 shrink-0 pt-3 border-t border-white/5">
            <form onSubmit={handleGeminiSubmit} className="relative flex items-center group">
              <input type="text" value={geminiInput} onChange={(e) => setGeminiInput(e.target.value)} placeholder="Ask Gemini..." className="w-full bg-zinc-900 border border-white/10 text-white text-sm rounded-full py-4 pl-5 pr-14 focus:outline-none focus:border-purple-500 transition-all font-light" />
              <button type="submit" disabled={!geminiInput.trim() || isGeminiTyping} className="absolute right-1.5 w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50">
                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- THE MAIN PRODUCT PAGE CONTENT --- */}
      <div className="min-h-screen pb-32 pt-12 md:pt-16 max-w-7xl mx-auto px-4 sm:px-8 animate-fade-in relative z-10">
        <div className="mb-10 flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
          <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link><span className="text-zinc-700">/</span><Link href="/market" className="hover:text-purple-400 transition-colors">Shop</Link><span className="text-zinc-700">/</span><span className="text-white">{product.category}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-32">
          
          {/* ✨ UPGRADED: Dynamic Image Container ✨ */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <button 
              onClick={() => setIsZoomed(true)}
              className="w-full bg-zinc-900/20 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center p-6 md:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] group cursor-zoom-in"
              title="Click to Zoom"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              {/* h-auto lets the image dictate height natively up to max-h */}
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-auto max-h-[70vh] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl" 
              />
              <div className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </div>
              {product.tag && <div className="absolute top-8 left-8"><span className="px-5 py-2 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">{product.tag}</span></div>}
            </button>

            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {galleryImages.map((img, index) => (
                  <button key={index} onClick={() => setActiveImage(img)} className={`w-20 h-20 md:w-28 md:h-28 shrink-0 bg-zinc-900/40 backdrop-blur-md rounded-2xl md:rounded-[1.5rem] overflow-hidden p-3 transition-all duration-300 ${activeImage === img ? 'ring-2 ring-purple-500 opacity-100 shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'border border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}>
                    <img src={img} className="w-full h-full object-contain" alt={`view ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-xs md:text-sm text-purple-400 font-bold uppercase tracking-[0.4em] mb-4">{product.category}</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
              <h2 className="text-3xl md:text-4xl font-light text-zinc-300 tracking-wide">Rs. {product.price.toLocaleString()}</h2>
              <div className="w-px h-8 bg-zinc-800"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span className="text-lg font-bold text-white">{avgRating}</span>
                <span className="text-sm md:text-base text-zinc-500 uppercase tracking-widest ml-2 font-light">({totalReviews} Reviews)</span>
              </div>
            </div>
            
            <p className="text-lg md:text-2xl text-zinc-400 font-light leading-relaxed mb-10 tracking-wide">{product.description}</p>

            <div className="mb-10 flex items-center gap-4 bg-zinc-900/30 border border-white/5 p-5 rounded-2xl w-max">
               <span className={`flex w-3 h-3 rounded-full ${product.stock > 0 ? (product.stock < 10 ? 'bg-red-500 animate-ping' : 'bg-purple-500') : 'bg-zinc-700'}`}></span>
               <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] ${product.stock > 0 ? (product.stock < 10 ? 'text-red-400' : 'text-purple-400') : 'text-zinc-500'}`}>
                  {product.stock > 0 ? (product.stock < 10 ? `Extremely Limited: ${product.stock} Remaining` : 'In Stock & Ready for Dispatch') : 'Currently Unavailable'}
               </span>
            </div>

            {(hasColors || allowNotes) && (
              <div className="mb-10 space-y-8 border-y border-white/10 py-8">
                {hasColors && (
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Select Finish</h3>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Required</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.colors!.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-2 transition-all duration-300 relative ${selectedColor === color ? 'border-purple-500 scale-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-white/10 hover:border-white/30 hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                          title={`Select ${color} finish`}
                        >
                          {selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-4 h-4 bg-black/30 rounded-full border border-white/50"></span>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {allowNotes && (
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Notes & Engraving</h3>
                      <span className="text-[10px] text-purple-400 uppercase tracking-widest">Complimentary</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={25}
                        placeholder="Enter custom text or request..."
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 rounded-none focus:outline-none focus:border-purple-500 transition-colors font-light tracking-widest placeholder:text-zinc-700"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-zinc-600 font-bold tracking-widest">
                        {25 - customText.length} Left
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-4 mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between bg-zinc-900/80 border border-white/10 rounded-none px-4 py-2 sm:w-40 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-white w-12 h-12 flex items-center justify-center text-2xl transition-colors">-</button>
                  <span className="font-black text-white text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-white w-12 h-12 flex items-center justify-center text-2xl transition-colors">+</button>
                </div>
                <button disabled={product.stock === 0} onClick={handleAddToCart} className="flex-1 bg-white text-black hover:bg-purple-600 hover:text-white px-8 py-6 rounded-none font-black text-sm md:text-base uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 flex items-center justify-center gap-4">
                  {product.stock === 0 ? 'Out of Stock' : `Add to CArt - Rs. ${(product.price * quantity).toLocaleString()}`}
                </button>
              </div>
              
              <button 
                onClick={() => setIsGeminiOpen(true)}
                className="w-full relative overflow-hidden bg-zinc-900 border border-white/10 hover:border-purple-500/50 text-white px-8 py-5 rounded-none font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-4 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-500/10 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg className="w-5 h-5 text-white animate-[spin_4s_linear_infinite] relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/></svg>
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-rose-300 transition-all duration-300">
                  Consult Gemini About This Item
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-white/10">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                <div><p className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">Complimentary Shipping</p><p className="text-xs md:text-sm text-zinc-500 font-light tracking-wide">On all orders over Rs. 3000 nationwide.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div><p className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">CARTIO Verified</p><p className="text-xs md:text-sm text-zinc-500 font-light tracking-wide">100% authentic premium goods.</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* ✨ UPGRADED: MODERN CLIENT LEDGER (REVIEWS) ✨ */}
        <div className="border-t border-white/10 pt-20 mb-32">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">Customer Reviews</h3>
              <p className="text-lg text-zinc-400 font-light tracking-wide flex items-center gap-3">
                <span className="text-purple-400 font-bold">{avgRating} ★</span> 
                <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span> 
                {totalReviews} Verified Reviews
              </p>
            </div>
            <button 
              onClick={() => setIsReviewFormOpen(!isReviewFormOpen)} 
              className={`px-8 py-4 border rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${isReviewFormOpen ? 'bg-zinc-800 border-transparent text-white' : 'bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]'}`}
            >
              {isReviewFormOpen ? 'Cancel Entry' : 'Give a Review'}
            </button>
          </div>

          {/* Expandable Form */}
          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isReviewFormOpen ? 'max-h-[600px] opacity-100 mb-16' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <form onSubmit={handleReviewSubmit} className="relative z-10 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 space-y-6">
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Client Alias</label>
                    <input type="text" required placeholder="e.g. Ahmad." value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors font-light rounded-xl placeholder:text-zinc-700" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Rating</label>
                    <select value={reviewForm.rating} onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 text-purple-400 font-bold px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors rounded-xl cursor-pointer appearance-none">
                      <option value="5" className="bg-zinc-900">5 Stars - Exceptional</option>
                      <option value="4" className="bg-zinc-900">4 Stars - Very Good</option>
                      <option value="3" className="bg-zinc-900">3 Stars - Average</option>
                      <option value="2" className="bg-zinc-900">2 Stars - Poor</option>
                      <option value="1" className="bg-zinc-900">1 Star - Terrible</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-2/3 flex flex-col">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Public Feedback</label>
                  <textarea required rows={4} placeholder="Share your experience with this asset..." value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full flex-1 bg-black/50 border border-white/10 text-white px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors font-light resize-none rounded-xl mb-6 placeholder:text-zinc-700"></textarea>
                  <button type="submit" disabled={isSubmittingReview} className="w-full md:w-auto self-end bg-white text-black hover:bg-purple-600 hover:text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all disabled:opacity-50">
                    {isSubmittingReview ? 'Encrypting...' : 'Publish Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sleek Grid of Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-white/5 border-dashed rounded-[2rem]">
                <p className="text-zinc-500 font-light uppercase tracking-widest text-sm">The ledger is currently empty for this asset.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-zinc-900/20 backdrop-blur-md border border-white/5 hover:border-white/10 p-8 rounded-[2rem] flex flex-col transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-wider text-lg">{review.user_name}</h4>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-purple-500' : 'text-zinc-800'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-400 font-light leading-relaxed italic text-sm">"{review.comment}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RELATED ASSETS */}
    {/* RELATED ASSETS (DYNAMIC SCROLLER) */}
        <div className="border-t border-white/10 pt-20">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">Explore Further</h3>
              <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide">Curated additions for your collection.</p>
            </div>
            
            {/* Visual cue for users to scroll */}
            <div className="hidden md:flex items-center gap-3 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
              Swipe to Explore
              <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </div>
          
          {/* ✨ THE UPGRADED HORIZONTAL SCROLLER ✨ */}
          <div className="flex overflow-x-auto gap-6 pb-12 custom-scrollbar snap-x snap-mandatory hide-scrollbar">
            {recommendations.map((rec) => (
              <Link href={`/market/${rec.id}`} key={rec.id} className="shrink-0 w-[85vw] sm:w-[320px] lg:w-[400px] snap-start group relative aspect-[3/4] bg-zinc-900 overflow-hidden block rounded-2xl md:rounded-3xl border border-white/5">
                <img src={rec.image} alt={rec.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" />
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