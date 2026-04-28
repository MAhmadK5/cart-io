"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

type Message = {
  id: number;
  session_id: string;
  sender: 'user' | 'agent';
  text: string;
  created_at: string;
};

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from('messages')
        .select('session_id')
        .order('created_at', { ascending: false });
      
      if (data) {
        const uniqueSessions = Array.from(new Set(data.map(m => m.session_id)));
        setSessions(uniqueSessions);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    const fetchChat = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', activeSession)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchChat();

    const channel = supabase
      .channel(`admin_chat_${activeSession}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `session_id=eq.${activeSession}` 
      }, (payload) => {
        const newMessage = payload.new as Message;
        if (newMessage.sender === 'user') {
          setMessages(prev => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeSession) return;

    const { data } = await supabase
      .from('messages')
      .insert([{ session_id: activeSession, sender: 'agent', text: reply }])
      .select();

    if (data) {
      setMessages(prev => [...prev, data[0]]);
      setReply('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex pt-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      {/* --- THE MASTER SIDEBAR (Identical to Dashboard to prevent trapping) --- */}
      <div className="w-72 bg-black/80 backdrop-blur-2xl border-r border-white/5 flex flex-col hidden md:flex h-[calc(100vh-5rem)] sticky top-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)] animate-pulse"></div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Status</p>
              <p className="text-xs text-white font-black uppercase tracking-wider">Online & Secure</p>
            </div>
          </div>
          
          <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Core Modules</h2>
          <nav className="space-y-3">
            {/* The Back Button! Notice the styling swaps to make this one the inactive state */}
            <Link href="/admin" className="flex items-center gap-4 px-5 py-4 bg-transparent border border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:border-zinc-800 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all group">
              <svg className="w-5 h-5 group-hover:text-blue-500 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Orders Desk
            </Link>
            {/* The Active Page */}
            <Link href="/admin/chat" className="flex items-center gap-4 px-5 py-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)] group">
              <svg className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Live Comms
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-8">
          <Link href="/" className="w-full py-4 bg-black border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Exit Nexus
          </Link>
        </div>
      </div>

      {/* --- EXTREME COMMS INTERFACE --- */}
      <div className="flex-1 p-6 md:p-10 flex gap-6 h-[calc(100vh-5rem)]">
        
        {/* Sessions List Column */}
        <div className="w-80 bg-zinc-950 border border-zinc-800 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl relative z-10">
          <div className="p-6 border-b border-white/5 bg-black/50">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Open Frequencies
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {sessions.map(id => (
              <button 
                key={id}
                onClick={() => setActiveSession(id)}
                className={`w-full p-5 rounded-2xl text-left transition-all border ${
                  activeSession === id 
                    ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
                    : 'bg-black border-transparent text-zinc-400 hover:bg-zinc-900 hover:border-white/10'
                }`}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-1 flex items-center justify-between">
                  Target ID 
                  {activeSession === id && <span className="text-green-400 animate-pulse">Live</span>}
                </p>
                <p className="text-sm font-mono font-bold truncate">{id}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Terminal */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl relative z-10">
          {activeSession ? (
            <>
              {/* Terminal Header */}
              <div className="p-6 border-b border-zinc-800 bg-black/50 flex justify-between items-center backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-1">Encrypted Tunnel</span>
                  <span className="text-lg font-mono font-bold text-white tracking-wider">{activeSession}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> 
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Signal Locked</span>
                </div>
              </div>
              
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar" style={{ backgroundImage: "radial-gradient(#222 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-5 rounded-2xl text-sm font-mono shadow-xl relative ${
                      msg.sender === 'agent' 
                        ? 'bg-[#005c4b] text-white rounded-br-sm border border-[#25D366]/30' 
                        : 'bg-[#202c33] text-zinc-300 border border-white/5 rounded-bl-sm'
                    }`}>
                      {msg.text}
                      <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${msg.sender === 'agent' ? 'text-green-300' : 'text-zinc-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Transmit Console */}
              <form onSubmit={handleSendReply} className="p-6 border-t border-zinc-800 bg-black/80">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-mono font-bold">{">"}</span>
                    <input 
                      type="text" 
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Enter command or message..."
                      className="w-full bg-[#111] border border-zinc-800 text-green-400 font-mono rounded-xl pl-10 pr-5 py-4 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all placeholder:text-zinc-700"
                    />
                  </div>
                  <button className="px-10 bg-green-600 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                    Transmit
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-black">
              <svg className="w-16 h-16 mb-4 opacity-50 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <span className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Target Selection</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}