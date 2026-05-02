"use client";

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Message = {
  id?: number;
  session_id: string;
  sender: 'user' | 'agent';
  text: string;
  created_at: string;
};

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Session & Fetch History
  useEffect(() => {
    // Check if they already have a chat session in this browser tab
    let currentSession = sessionStorage.getItem('cartio_chat_session');
    if (!currentSession) {
      currentSession = "sess_" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('cartio_chat_session', currentSession);
    }
    setSessionId(currentSession);

    // Fetch previous messages for this specific user
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', currentSession)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Show a default welcome message only locally if no history exists
        setMessages([{
          session_id: currentSession!,
          sender: 'agent',
          text: "Hello! 👋 Welcome to CARTIO. Let us know what you need help with, and a human agent will assist you! Assist Timings: 9 AM - 3 PM",
          created_at: new Date().toISOString()
        }]);
      }
    };
    
    fetchMessages();

    // 2. Subscribe to REALTIME updates!
    const channel = supabase
      .channel('realtime_chat')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `session_id=eq.${currentSession}` 
      }, (payload) => {
        const newMessage = payload.new as Message;
        // Only append if it's from the agent (since we optimistically add user messages)
        if (newMessage.sender === 'agent') {
          setMessages((prev) => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // 3. Send Message to Database
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userText = input;
    setInput(''); // Clear input instantly for snappy UI

    // Optimistically update the UI so it feels instant
    const tempMessage: Message = {
      session_id: sessionId,
      sender: 'user',
      text: userText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    // Actually push it to Supabase
    const { error } = await supabase
      .from('messages')
      .insert([
        { session_id: sessionId, sender: 'user', text: userText }
      ]);

    if (error) {
      console.error("Error sending message:", error);
    }
  };

  // Helper to format timestamps
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      
      {/* --- THE WHATSAPP DARK MODE DIALOG BOX --- */}
      <div className={`mb-4 w-[calc(100vw-3rem)] sm:w-[350px] bg-[#0b141a] border border-zinc-800 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 origin-bottom-left flex flex-col ${isOpen ? 'scale-100 opacity-100 h-[480px] pointer-events-auto' : 'scale-50 opacity-0 h-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-[#202c33] p-3 flex items-center justify-between shrink-0 cursor-default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative overflow-hidden shrink-0">
              <span className="text-[#008069] font-black text-[10px] tracking-tighter">CARTIO</span>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-base font-medium text-white leading-tight">CARTIO Support</h3>
              <p className="text-[11px] text-white/70">Typically replies instantly or doesn't replies sometimes</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Chat Body Area (Dark WhatsApp Background) */}
        <div 
          className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 relative custom-scrollbar bg-[#0b141a]"
          style={{ 
            backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
            backgroundSize: 'contain',
            backgroundBlendMode: 'soft-light',
            opacity: 0.9
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
              <div 
                className={`px-3 py-2 rounded-lg max-w-[85%] text-sm shadow-sm relative z-10 ${
                  msg.sender === 'user' 
                    ? 'bg-[#005c4b] text-white rounded-tr-none ml-4' 
                    : 'bg-[#202c33] text-white rounded-tl-none mr-4'
                }`}
              >
                {/* The classic WhatsApp speech bubble tails */}
                {msg.sender === 'user' ? (
                  <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] border-t-[#005c4b] border-r-[10px] border-r-transparent"></div>
                ) : (
                  <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-[#202c33] border-l-[10px] border-l-transparent"></div>
                )}

                <div className="pr-10 relative">
                  <span className="break-words leading-relaxed">{msg.text}</span>
                  <div className="float-right -mr-10 mt-2 flex items-center gap-1">
                    <span className="text-[10px] text-white/60">{formatTime(msg.created_at)}</span>
                    {msg.sender === 'user' && (
                      <svg className="w-3 h-3 text-[#53bdeb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area & Disclaimer */}
        <div className="bg-[#202c33] flex flex-col shrink-0 relative z-20">
          <form onSubmit={handleSendMessage} className="p-2 flex items-center gap-2">
            <div className="flex-1 bg-[#2a3942] rounded-lg flex items-center px-4 py-1.5">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message" 
                className="w-full bg-transparent text-white text-sm focus:outline-none py-2 placeholder:text-zinc-400"
              />
            </div>
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-12 h-12 bg-[#00a884] text-white rounded-full flex items-center justify-center hover:bg-[#008f6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </form>
          {/* Disclaimer */}
          <p className="text-center text-[10px] text-zinc-500 italic pb-2 font-medium">
            *not actual whatsapp!
          </p>
        </div>
      </div>

      {/* --- THE FLOATING TRIGGER BUTTON (LEFT SIDE) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-[60px] h-[60px] rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-110 hover:shadow-[0_4px_25px_rgba(37,211,102,0.5)] transition-all duration-300 relative group ${isOpen ? 'bg-zinc-800 text-zinc-400' : 'bg-[#25D366] text-white'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <>
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.195 1.585 6.014L.16 23.84l5.973-1.566C7.945 23.321 9.943 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-zinc-950 rounded-full"></span>
            
            {/* Tooltip popping out to the right since the button is on the left */}
            <span className="absolute left-[75px] bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              CARTIO Live Support
            </span>
          </>
        )}
      </button>

    </div>
  );
}