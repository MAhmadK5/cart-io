"use client";

import { useState, useEffect, useRef } from 'react';
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

  // 1. Fetch all unique customer sessions
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

  // 2. Fetch messages when a session is selected
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

    // Listen for NEW messages from the customer in real-time
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

  // 3. Send Reply as Agent
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeSession) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ 
        session_id: activeSession, 
        sender: 'agent', 
        text: reply 
      }])
      .select();

    if (data) {
      setMessages(prev => [...prev, data[0]]);
      setReply('');
    }
  };

  return (
    <div className="flex h-[80vh] bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* SIDEBAR: Active Sessions */}
      <div className="w-1/3 border-r border-white/5 bg-zinc-900/50 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Active Transmissions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map(id => (
            <button 
              key={id}
              onClick={() => setActiveSession(id)}
              className={`w-full p-4 rounded-2xl text-left transition-all ${activeSession === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Session</p>
              <p className="text-sm font-mono font-bold truncate">{id}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-black/40">
        {activeSession ? (
          <>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
              <span className="text-xs font-black text-white uppercase tracking-widest">Routing to: {activeSession}</span>
              <span className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Encrypted
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.sender === 'agent' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendReply} className="p-6 border-t border-white/5 bg-zinc-900/40">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Transmit reply..."
                  className="flex-1 bg-black border border-zinc-800 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="px-8 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600 font-black uppercase tracking-widest text-xs">
            Select a session to begin transmission
          </div>
        )}
      </div>
    </div>
  );
}