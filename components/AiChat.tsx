"use client";

import { useState, useRef, useEffect } from 'react';

// Type definition for our chat messages
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting from the AI
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Welcome to the GOBAAZAAR neural network. I am your personal procurement assistant. How can I optimize your lifestyle today?", 
      sender: 'ai' 
    }
  ]);

  // Auto-scroll to the bottom when a new message appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Add user message
    const newUserMsg: Message = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponses = [
        "Analyzing your request... Our current inventory suggests the Matte Black Stanley 40oz is a perfect match for your parameters.",
        "Excellent choice. I have cross-referenced that with our global ledger and verified its authenticity.",
        "My neural models indicate high demand for that asset. I recommend securing your order immediately.",
        "I can assist with that. Would you like me to open the procurement terminal (cart) for you?",
        "Our logistics nodes are fully operational. Delivery to your sector will be highly optimized."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAiMsg: Message = { id: Date.now() + 1, text: randomResponse, sender: 'ai' };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay to feel like it's "thinking"
  };

  return (
    <>
      {/* --- FLOATING CHAT BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 z-900 group hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* Pulsing AI Core */}
        <span className="relative flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)]"></span>
        </span>
      </button>

      {/* --- CHAT WINDOW TERMINAL --- */}
      <div 
        className={`fixed bottom-6 right-6 w-[90vw] max-w-95 h-125 max-h-[80vh] bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col z-[950] transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 pointer-events-none translate-y-10'}`}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">GOBAAZAAR AI</h3>
              <p className="text-[9px] text-zinc-400 uppercase tracking-[0.2em]">Neural Link: Online</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                  : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-900/50 border-t border-white/5 rounded-b-3xl">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Query the network..."
              className="w-full bg-black border border-zinc-700/50 text-white text-sm rounded-full py-3 pl-5 pr-12 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:bg-zinc-700 transition-all hover:bg-blue-500"
            >
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">End-to-End Encrypted</span>
          </div>
        </div>

      </div>
    </>
  );
}