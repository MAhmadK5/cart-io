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
    let currentSession = sessionStorage.getItem('gobaazaar_chat_session');
    if (!currentSession) {
      currentSession = "sess_" + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('gobaazaar_chat_session', currentSession);
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
          text: "Hello! 👋 Welcome to GOBAAZAAR. Let us know what you need help with, and a human agent will assist you!",
          created_at: new Date().toISOString()
        }]);
      }
    };
    
    fetchMessages();

    // 2. Subscribe to REALTIME updates!
    // This listens to the database and instantly grabs replies from the Admin
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
      
      {/* --- THE WHATSAPP DIALOG BOX --- */}
      <div className={`mb-4 w-[calc(100vw-3rem)] sm:w-[350px] bg-[#0b141a] border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 origin-bottom-left flex flex-col ${isOpen ? 'scale-100 opacity-100 h-[450px]' : 'scale-0 opacity-0 h-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-[#202c33] p-4 flex items-center justify-between shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366]/20 rounded-full flex items-center justify-center relative">
              <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#202c33] rounded-full"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Support</h3>
              <p className="text-[10px] text-[#25D366]">We reply immediately</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Chat Body Area */}
        <div 
          className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 relative custom-scrollbar"
          style={{ backgroundImage: "radial-gradient(#202c33 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-md relative z-10 ${
                  msg.sender === 'user' 
                    ? 'bg-[#005c4b] text-white rounded-tr-none' 
                    : 'bg-[#202c33] text-white border border-white/5 rounded-tl-none'
                }`}
              >
                {msg.text}
                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[9px] text-zinc-400">{formatTime(msg.created_at)}</span>
                  {msg.sender === 'user' && (
                    <svg className="w-3 h-3 text-[#53bdeb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#202c33] shrink-0 border-t border-white/5 relative z-20">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-[#2a3942] border border-transparent text-white text-sm rounded-full py-3 px-4 focus:outline-none focus:border-[#25D366] transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 bg-[#25D366] text-[#0b141a] rounded-full flex items-center justify-center hover:bg-[#20bd5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-md"
            >
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </form>
        </div>
      </div>

      {/* --- THE FLOATING TRIGGER BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 relative ${isOpen ? 'bg-zinc-800 text-zinc-400' : 'bg-[#25D366] text-white'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        )}
      </button>

    </div>
  );
}