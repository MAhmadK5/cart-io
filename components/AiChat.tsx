"use client";

import { useState, useRef, useEffect } from 'react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Initial Greeting
  const [messages, setMessages] = useState<Message[]>([
    { text: "Welcome to GOBAAZAAR. I am your Support Node. How can I assist you with your assets today?", sender: 'bot' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
// ... existing states ...

  // ✨ ADD THIS NEW LISTENER ✨
  useEffect(() => {
    const openChatBox = () => setIsOpen(true);
    window.addEventListener('openAiChat', openChatBox);
    return () => window.removeEventListener('openAiChat', openChatBox);
  }, []);

  // ... existing useEffect for scrolling ...
  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User's Message
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI / Agent typing a response
    setTimeout(() => {
      setIsTyping(false);
      
      // A simple simulated auto-response
      let botResponse = "I've received your message. Our human agents are currently routing this request. Is there anything else you need help with?";
      
      if (userMessage.toLowerCase().includes("order") || userMessage.toLowerCase().includes("track")) {
        botResponse = "If you need to track an order, you can use our dedicated Tracking Node in the footer! Just enter your Order ID.";
      } else if (userMessage.toLowerCase().includes("refund") || userMessage.toLowerCase().includes("return")) {
        botResponse = "We offer a 7-day hassle-free return window. You can view the full policy in the Legal section of our footer.";
      }

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1500); // 1.5 second "typing" delay
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end">
      
      {/* --- THE CHAT WINDOW --- */}
      <div 
        className={`mb-4 w-[calc(100vw-3rem)] sm:w-[380px] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col ${isOpen ? 'scale-100 opacity-100 h-[500px]' : 'scale-0 opacity-0 h-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full border border-blue-400">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Support Node</h3>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">Online</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..." 
              className="w-full bg-black border border-zinc-800 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Secured by GOBAAZAAR Node</span>
          </div>
        </div>
      </div>

      {/* --- THE FLOATING BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 relative ${isOpen ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-blue-600 text-white'}`}
        aria-label="Toggle Live Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <>
            {/* Ping animation behind the icon */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40 animate-ping"></span>
            <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </>
        )}
      </button>

    </div>
  );
}