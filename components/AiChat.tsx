"use client";

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext'; 

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  product?: any; 
  isActionable?: boolean;
};

const QUICK_ACTIONS = [
  "Show me new arrivals",
  "Track my order",
  "What payment methods do you accept?",
  "Show me something affordable",
  "What are your delivery charges?",
  "Connect to a human"
];

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { addToCart } = useCart(); 
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      text: "Welcome to the CARTIO Vault. I am the Gemini Oracle. Select a prompt below or describe the asset you are looking for.", 
      sender: 'bot' 
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openChatBox = () => setIsOpen(true);
    window.addEventListener('openAiChat', openChatBox);
    return () => window.removeEventListener('openAiChat', openChatBox);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processAIResponse = async (userText: string) => {
    const text = userText.toLowerCase();
    let foundProduct = null;
    let isActionable = false;

    if (text.includes("new arrival") || text.includes("latest") || text.includes("newest")) {
      const { data } = await supabase.from('products').select('*').order('id', { ascending: false }).limit(1);
      if (data && data.length > 0) { foundProduct = data[0]; isActionable = true; }
    } 
    else if (text.includes("affordable") || text.includes("cheap") || text.includes("lowest") || text.includes("under")) {
      const { data } = await supabase.from('products').select('*').gt('stock', 0).order('price', { ascending: true }).limit(1);
      if (data && data.length > 0) { foundProduct = data[0]; isActionable = true; }
    } 
    else {
      const stopWords = ["do", "you", "have", "any", "i", "want", "looking", "for", "a", "the", "is", "there", "show", "me", "can", "get", "buy", "some", "like", "in", "stock"];
      const words = text.split(" ").filter(w => w.length > 2 && !stopWords.includes(w));
      
      if (words.length > 0) {
        const orQuery = words.map(w => `name.ilike.%${w}%,category.ilike.%${w}%,tag.ilike.%${w}%`).join(',');
        const { data } = await supabase.from('products').select('*').or(orQuery).limit(1);
        if (data && data.length > 0) { foundProduct = data[0]; isActionable = true; }
      }
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey || apiKey === "your_actual_api_key_here") {
        throw new Error("Missing API Key. Please configure NEXT_PUBLIC_GEMINI_API_KEY.");
      }

      let systemPrompt = `You are the CARTIO AI Concierge, a luxury e-commerce assistant powered by Gemini. 
      Tone: Concise, luxurious, elegant, and extremely helpful. Never use emojis.
      Knowledge Base:
      - Shipping: Complimentary nationwide over Rs. 3000. Otherwise Rs. 250.
      - Payment: Cash on Delivery (COD) and Credit/Debit Cards via 256-Bit SSL.
      - Returns: 7-day Satisfaction Ledger.
      
      The user said: "${userText}"`;

      if (foundProduct) {
        systemPrompt += `\n\nSYSTEM NOTE: Our database automatically found a relevant product: ${foundProduct.name} (Rs. ${foundProduct.price}). Tell the user you found it and ask if they want to secure it.`;
      } else if (text.includes("show") || text.includes("buy") || text.includes("looking for")) {
        systemPrompt += `\n\nSYSTEM NOTE: The user was looking for a product, but our database found NO matches. Apologize luxuriously and suggest browsing New Arrivals.`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Google API rejected the request.");
      
      if (data.candidates && data.candidates.length > 0) {
        return { text: data.candidates[0].content.parts[0].text, product: foundProduct, isActionable: isActionable };
      } else {
        throw new Error("No readable text was returned from the AI.");
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      return { text: `System Error: ${error.message}`, product: null, isActionable: false };
    }
  };

  const sendUserMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMsgId = Math.random().toString(36).substring(7);
    
    setMessages(prev => [...prev, { id: newMsgId, text: text, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    const response = await processAIResponse(text);
    setMessages(prev => [...prev, { id: Math.random().toString(), ...response, sender: 'bot' }]);
    setIsTyping(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  const handleAiAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
    
    setMessages(prev => [...prev, { 
      id: Math.random().toString(), 
      text: `Excellent choice. "${product.name}" has been secured in your ledger.`, 
      sender: 'bot' 
    }]);

    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <>
      {/* ✨ PART 1: THE CHAT WINDOW ✨
        Completely separated from the button. Only visible when open.
      */}
      <div className={`fixed inset-0 z-[9990] ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        
        {/* Background Overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        ></div>

        {/* The Actual Chat Box */}
        <div 
          className={`absolute bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(139,92,246,0.3)] flex flex-col transition-all duration-500 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 h-[600px] max-h-[75vh]' : 'scale-50 opacity-0 h-0'}`}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 animate-gradient-x"></div>

          <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0 mt-1">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-purple-500/30 overflow-hidden">
                <svg className="w-7 h-7 text-white animate-[spin_4s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/></svg>
              </div>
              <div>
                <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 uppercase tracking-tighter leading-none mb-1">
                  Gemini Oracle
                </h2>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Global Intelligence</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} relative z-10`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.sender === 'user' ? 'bg-gradient-to-br from-zinc-100 to-zinc-300 text-black rounded-tr-sm font-medium' : 'bg-zinc-900 border border-purple-500/20 text-zinc-200 rounded-tl-sm'}`}>
                  {msg.text}
                </div>

                {msg.product && (
                  <div className="mt-3 w-[85%] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="flex gap-3 p-3">
                      <div className="w-16 h-16 bg-zinc-900 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                        <img src={msg.product.image} alt={msg.product.name} className="absolute inset-0 w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">{msg.product.category}</p>
                        <h4 className="text-white font-bold text-xs uppercase tracking-tight line-clamp-1 my-0.5">{msg.product.name}</h4>
                        <p className="text-zinc-400 font-light text-xs">Rs. {msg.product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {msg.isActionable && msg.product.stock > 0 && (
                      <button 
                        onClick={() => { handleAiAddToCart(msg.product); msg.isActionable = false; }}
                        className="w-full py-3 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-purple-500 transition-colors border-t border-purple-500 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add to Ledger
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start relative z-10">
                <div className="bg-zinc-900 border border-purple-500/20 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center shadow-lg">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-black/60 backdrop-blur-md pt-4 pb-2 px-5 flex gap-2 overflow-x-auto custom-scrollbar border-t border-white/5 shrink-0">
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                onClick={() => sendUserMessage(action)}
                disabled={isTyping}
                className="shrink-0 px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-white hover:border-purple-500 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="p-5 bg-black/80 shrink-0 pt-3 border-t border-white/5">
            <form onSubmit={handleFormSubmit} className="relative flex items-center group">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask the Oracle..." 
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm rounded-full py-4 pl-5 pr-14 focus:outline-none focus:border-purple-500 transition-all font-light placeholder:text-zinc-600" 
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping} 
                className="absolute right-1.5 w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ✨ PART 2: THE FLOATING TRIGGER BUTTON ✨
        Completely ripped out of the wrapper. Pure native HTML button.
      */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={`fixed z-[99999] flex items-center justify-center w-[60px] h-[60px] rounded-full shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all duration-500 group ${isOpen ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white text-black'}`}
        style={{ 
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom))', 
          right: '1.5rem',
          touchAction: 'manipulation', 
          WebkitTapHighlightColor: 'transparent' 
        }}
        aria-label="Toggle AI Concierge"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <>
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-20 animate-ping"></span>
            <svg className="w-8 h-8 relative z-10 text-black transition-colors animate-[spin_6s_linear_infinite]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/></svg>
            <span className="absolute right-[75px] bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10 hidden sm:block">
              Consult Gemini
            </span>
          </>
        )}
      </button>
    </>
  );
}