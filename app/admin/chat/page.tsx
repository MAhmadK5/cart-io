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
    <>
      {/* ✨ THE LUXURY ANIMATED BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      <div className="min-h-screen flex pt-24 md:pt-32 relative z-10 max-w-[1600px] mx-auto px-4 md:px-0">
        
        {/* --- MASTER SIDEBAR (Consistent with Admin Dashboard) --- */}
        <div className="w-80 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 flex flex-col hidden lg:flex h-[calc(100vh-8rem)] sticky top-24 shadow-2xl rounded-3xl ml-6 z-20">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-8">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Portal Status</p>
                <p className="text-sm text-white font-black uppercase tracking-wider">Online & Secure</p>
              </div>
            </div>
            
            <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Navigation</h2>
            <nav className="space-y-4">
              
              {/* Inactive Orders Link */}
              <Link href="/admin" className="flex items-center gap-4 px-6 py-5 bg-transparent border border-transparent text-zinc-500 hover:bg-white/5 hover:border-white/10 hover:text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group">
                <svg className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Orders Overview
              </Link>
              
              {/* Active Chat Link */}
              <div className="flex items-center gap-4 px-6 py-5 bg-purple-600/10 border border-purple-500/30 text-purple-400 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(147,51,234,0.1)] group">
                <svg className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                Customer Chat
              </div>
              
            </nav>
          </div>
          <div className="mt-auto p-8 pt-0">
            <Link href="/" className="w-full py-5 bg-transparent border border-zinc-700 text-zinc-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign Out
            </Link>
          </div>
        </div>

        {/* --- LUXURY COMMS INTERFACE --- */}
        <div className="flex-1 p-0 md:p-6 lg:p-10 flex flex-col md:flex-row gap-6 lg:gap-8 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
          
          {/* Active Conversations Column */}
          <div className="w-full md:w-80 lg:w-96 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl relative z-10 shrink-0">
            <div className="p-8 border-b border-white/5 bg-black/40">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.6)]"></span> 
                Active Conversations
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {sessions.map(id => (
                <button 
                  key={id}
                  onClick={() => setActiveSession(id)}
                  className={`w-full p-6 rounded-2xl text-left transition-all border ${
                    activeSession === id 
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-[0_0_20px_rgba(147,51,234,0.15)]' 
                      : 'bg-black/50 border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2 flex items-center justify-between">
                    Client ID 
                    {activeSession === id && <span className="text-purple-400 animate-pulse">Active</span>}
                  </p>
                  <p className={`text-base md:text-lg font-bold truncate tracking-wider ${activeSession === id ? 'text-white' : 'text-zinc-400'}`}>
                    {id}
                  </p>
                </button>
              ))}
              {sessions.length === 0 && (
                <p className="text-zinc-600 text-sm font-light text-center mt-10 tracking-widest uppercase">No active client sessions.</p>
              )}
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="flex-1 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl relative z-10">
            {activeSession ? (
              <>
                {/* Chat Header */}
                <div className="p-8 border-b border-white/5 bg-black/40 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2">Client Session</span>
                    <span className="text-xl md:text-2xl font-bold text-white tracking-wider">{activeSession}</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></span> 
                    <span className="text-[10px] md:text-xs text-purple-400 font-black uppercase tracking-widest">Connected</span>
                  </div>
                </div>
                
                {/* Message Feed */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 custom-scrollbar">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-3xl text-lg md:text-xl font-medium tracking-wide shadow-2xl relative ${
                        msg.sender === 'agent' 
                          ? 'bg-purple-600 text-white rounded-br-sm border border-purple-500 shadow-[0_10px_30px_rgba(147,51,234,0.2)]' 
                          : 'bg-zinc-800 text-zinc-100 border border-white/10 rounded-bl-sm'
                      }`}>
                        {msg.text}
                        <div className={`text-[10px] md:text-xs mt-4 font-black uppercase tracking-widest ${msg.sender === 'agent' ? 'text-purple-300' : 'text-zinc-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendReply} className="p-6 md:p-8 border-t border-white/5 bg-black/60 backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type a message to the client..."
                        className="w-full bg-zinc-900/50 border border-white/10 text-white text-lg rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 tracking-wide font-light"
                      />
                    </div>
                    <button className="px-10 py-5 sm:py-0 bg-white text-black font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Send Reply
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-black/20 backdrop-blur-sm">
                <svg className="w-20 h-20 mb-6 opacity-30 animate-pulse text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <span className="font-light text-xl md:text-2xl tracking-widest text-zinc-500">Select a client conversation to begin.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}