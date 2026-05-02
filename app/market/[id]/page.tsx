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
  colors?: string[];          // ✨ NEW: Array of hex colors
  is_customizable?: boolean;  // ✨ NEW: Custom text flag
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
  
  // ✨ NEW CUSTOMIZATION STATES ✨
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");

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
          
          // ✨ Auto-select the first color if colors exist
          if (mainProduct.colors && mainProduct.colors.length > 0) {
            setSelectedColor(mainProduct.colors[0]);
          }

          setGeminiMessages([
            { text: `I am the CARTIO Gemini Oracle. I am analyzing the ${mainProduct.name}. Select a query below or type your own question to learn more about this asset.`, sender: 'gemini' }
          ]);
        }
        const { data: recs } = await supabase.from('products').select('*').neq('id', params.id).limit(3);
        if (recs) setRecommendations(recs);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally { setLoading(false); }
    }
    if (params.id) fetchProductData();
  }, [params.id]);

  useEffect(() => {
    geminiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [geminiMessages, isGeminiTyping, isGeminiOpen]);

  // ✨ UPDATED ADD TO CART FUNCTION ✨
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

  const askGemini = async (text: string) => {
    if (!text.trim() || !product || isGeminiTyping) return;

    setGeminiMessages(prev => [...prev, { text: text, sender: 'user' }]);
    setGeminiInput('');
    setIsGeminiTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "your_actual_api_key_here") {
        throw new Error("Missing API Key. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file and restart the server.");
      }

      const systemPrompt = `You are an exclusive luxury e-commerce assistant for CARTIO, powered by Gemini. The customer is asking about a product they are viewing. 
      Product Name: ${product.name}. 
      Category: ${product.category}. 
      Description: ${product.description}. 
      Price: Rs. ${product.price}. 
      Customer's Question: ${text}
      Keep your response concise, luxurious, deeply knowledgeable, and strictly related to the product or CARTIO's high-end brand tone. Structure with small paragraphs if needed.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Google API Rejection Details:", data);
        throw new Error(data.error?.message || "Google API rejected the request.");
      }
      
      if (data.candidates && data.candidates.length > 0) {
        const geminiReply = data.candidates[0].content.parts[0].text;
        setGeminiMessages(prev => [...prev, { text: geminiReply, sender: 'gemini' }]);
      } else {
        throw new Error("No readable text was returned from the AI.");
      }
    } catch (error: any) {
      console.error("Gemini System Error:", error);
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

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-40"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950 -z-20"></div>

      {/* GEMINI CHAT DRAWER */}
      <div className={`fixed inset-0 z-[9999] ${isGeminiOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ${isGeminiOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} onClick={() => setIsGeminiOpen(false)}></div>
        
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950/90 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.3)] flex flex-col transition-transform duration-500 pointer-events-auto ${isGeminiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animate-gradient-x"></div>

          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)] overflow-hidden">
                <svg className="w-7 h-7 text-white animate-[spin_4s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/></svg>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 uppercase tracking-tighter leading-none mb-1">
                  Gemini Oracle
                </h2>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Product Intelligence</p>
              </div>
            </div>
            <button onClick={() => setIsGeminiOpen(false)} className="w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center group">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            {geminiMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} relative z-10`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-zinc-100 to-zinc-300 text-black rounded-tr-sm font-medium' 
                      : 'bg-zinc-900 border border-purple-500/20 text-zinc-200 rounded-tl-sm shadow-[0_5px_20px_rgba(168,85,247,0.05)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isGeminiTyping && (
              <div className="flex justify-start relative z-10">
                <div className="bg-zinc-900 border border-purple-500/20 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center shadow-lg">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(59,130,246,0.5)]" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(168,85,247,0.5)]" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce shadow-[0_0_5px_rgba(244,63,94,0.5)]" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={geminiEndRef} />
          </div>

          <div className="bg-black/60 backdrop-blur-md pt-4 pb-2 px-5 flex gap-2 overflow-x-auto custom-scrollbar border-t border-white/5 shrink-0">
            {PRODUCT_QUESTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => askGemini(action)}
                disabled={isGeminiTyping}
                className="shrink-0 px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-white hover:border-purple-500 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="p-5 bg-black/80 shrink-0 pt-3 border-t border-white/5">
            <form onSubmit={handleGeminiSubmit} className="relative flex items-center group">
              <input 
                type="text" 
                value={geminiInput} 
                onChange={(e) => setGeminiInput(e.target.value)} 
                placeholder="Ask Gemini about this asset..." 
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm rounded-full py-4 pl-5 pr-14 focus:outline-none focus:border-purple-500 transition-all font-light placeholder:text-zinc-600 shadow-inner group-hover:border-white/20" 
              />
              <button 
                type="submit" 
                disabled={!geminiInput.trim() || isGeminiTyping} 
                className="absolute right-1.5 w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* --- THE MAIN PRODUCT PAGE CONTENT --- */}
      <div className="min-h-screen pb-32 pt-12 md:pt-16 max-w-7xl mx-auto px-4 sm:px-8 animate-fade-in relative z-10">
        <div className="mb-10 flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
          <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link><span className="text-zinc-700">/</span><Link href="/market" className="hover:text-purple-400 transition-colors">Boutique</Link><span className="text-zinc-700">/</span><span className="text-white">{product.category}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-32">
          
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="w-full aspect-[4/5] sm:aspect-square bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center p-6 md:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
              {product.tag && <div className="absolute top-8 left-8"><span className="px-5 py-2 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">{product.tag}</span></div>}
            </div>
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
                <span className="text-lg font-bold text-white">{product.rating}</span>
                <span className="text-sm md:text-base text-zinc-500 uppercase tracking-widest ml-2 font-light">({product.reviews} Reviews)</span>
              </div>
            </div>
            <p className="text-lg md:text-2xl text-zinc-400 font-light leading-relaxed mb-10 tracking-wide">{product.description}</p>

            <div className="mb-10 flex items-center gap-4 bg-zinc-900/30 border border-white/5 p-5 rounded-2xl w-max">
               <span className={`flex w-3 h-3 rounded-full ${product.stock > 0 ? (product.stock < 10 ? 'bg-red-500 animate-ping' : 'bg-purple-500') : 'bg-zinc-700'}`}></span>
               <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] ${product.stock > 0 ? (product.stock < 10 ? 'text-red-400' : 'text-purple-400') : 'text-zinc-500'}`}>
                  {product.stock > 0 ? (product.stock < 10 ? `Extremely Limited: ${product.stock} Remaining` : 'In Stock & Ready for Dispatch') : 'Currently Unavailable'}
               </span>
            </div>

            {/* ✨ NEW: DYNAMIC PRODUCT CUSTOMIZATION UI ✨ */}
            {(product.colors && product.colors.length > 0) || product.is_customizable ? (
              <div className="mb-10 space-y-8 border-y border-white/10 py-8">
                
                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Select Finish</h3>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Required</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map(color => (
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

                {/* Custom Engraving Input */}
                {product.is_customizable && (
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Bespoke Engraving</h3>
                      <span className="text-[10px] text-purple-400 uppercase tracking-widest">Complimentary</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="Enter name or initials (e.g. A.R.)"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 rounded-none focus:outline-none focus:border-purple-500 transition-colors font-light tracking-widest placeholder:text-zinc-700"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-zinc-600 font-bold tracking-widest">
                        {15 - customText.length} Left
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex flex-col gap-4 mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between bg-zinc-900/80 border border-white/10 rounded-none px-4 py-2 sm:w-40 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-zinc-400 hover:text-white w-12 h-12 flex items-center justify-center text-2xl transition-colors">-</button>
                  <span className="font-black text-white text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-zinc-400 hover:text-white w-12 h-12 flex items-center justify-center text-2xl transition-colors">+</button>
                </div>
                <button disabled={product.stock === 0} onClick={handleAddToCart} className="flex-1 bg-white text-black hover:bg-purple-600 hover:text-white px-8 py-6 rounded-none font-black text-sm md:text-base uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 flex items-center justify-center gap-4">
                  {product.stock === 0 ? 'Out of Stock' : `Secure Item - Rs. ${(product.price * quantity).toLocaleString()}`}
                </button>
              </div>
              
              <button 
                onClick={() => setIsGeminiOpen(true)}
                className="w-full relative overflow-hidden bg-zinc-900 border border-white/10 hover:border-purple-500/50 text-white px-8 py-5 rounded-none font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-4 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-500/10 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg className="w-5 h-5 text-white animate-[spin_4s_linear_infinite] relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/></svg>
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-rose-300 transition-all duration-300">
                  Consult Gemini About This Asset
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-white/10">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                <div><p className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">Complimentary Shipping</p><p className="text-xs md:text-sm text-zinc-500 font-light tracking-wide">On all orders over Rs. 2500 nationwide.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-purple-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div><p className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">CARTIO Verified</p><p className="text-xs md:text-sm text-zinc-500 font-light tracking-wide">100% authentic premium goods.</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-20">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div><h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">Explore Further</h3><p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide">Curated additions for your collection.</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Link href={`/market/${rec.id}`} key={rec.id} className="group relative aspect-[3/4] bg-zinc-900 overflow-hidden block rounded-2xl md:rounded-3xl border border-white/5">
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