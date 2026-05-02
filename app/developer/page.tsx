"use client";

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '../../lib/supabase'; 

export default function DeveloperPage() {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // ✨ LIVE SUPABASE INTEGRATION ✨
      const { error } = await supabase
        .from('developer_feedback')
        .insert([
          { 
            name: feedback.name, 
            email: feedback.email, 
            message: feedback.message 
          }
        ]);

      if (error) throw error;

      // Trigger the premium success UI
      setIsSuccess(true);
      setFeedback({ name: '', email: '', message: '' });
      
      // Smoothly reset the form after 6 seconds
      setTimeout(() => setIsSuccess(false), 6000);

    } catch (error) {
      console.error("Error sending transmission:", error);
      alert("Transmission failed. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ✨ THE LUXURY ANIMATED BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      <div className="min-h-screen pt-32 pb-32 px-4 sm:px-8 relative z-10 max-w-6xl mx-auto animate-fade-in">
        
        {/* ✨ THE MASSIVE CENTER-ALIGNED MESSAGE ✨ */}
        <div className="max-w-4xl mx-auto text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <p className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-[0.5em] mb-6 relative z-10">Behind the Code</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-10 relative z-10">
            Welcome to CARTIO.
          </h1>
          
          <p className="text-2xl md:text-4xl text-zinc-300 font-light leading-snug tracking-wide mb-8 relative z-10">
            I am <span className="text-white font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">Muhammad Ahmad Khalid</span>, the lead architect and full-stack developer behind this platform. <br /> <i>Soon adding more features for seamless user experience.</i>
          </p>
          
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-8 relative z-10">
            Currently pursuing my BS in Computer Science at SZABIST University in Islamabad, my vision was to build an ecosystem that transcends traditional online shopping. CARTIO isn't just an e-commerce store; it is a meticulously engineered digital boutique bridging the gap between cutting-edge Artificial Intelligence and premium web experiences.
          </p>
        </div>

        {/* ✨ THE CONTAINERS (Grid Layout) ✨ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Container 1: The Technology Stack */}
          <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-[0_0_50px_rgba(147,51,234,0.05)] relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              The Technology
            </h2>
            <p className="text-base text-zinc-400 font-light leading-relaxed tracking-wide mb-10">
              To achieve uncompromised speed and fluid usability, CARTIO is powered by a modern, high-performance stack. The integration of live AI concierges and real-time database management ensures a seamless, bespoke journey.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <span className="px-5 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black transition-colors">Next.js 14</span>
              <span className="px-5 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-widest hover:bg-[#61DAFB] hover:text-black hover:border-[#61DAFB] transition-colors">React</span>
              <span className="px-5 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-widest hover:bg-[#38B2AC] hover:text-black hover:border-[#38B2AC] transition-colors">Tailwind CSS</span>
              <span className="px-5 py-3 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300 uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]">Gemini AI Engine</span>
              <span className="px-5 py-3 bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 rounded-full text-xs font-bold text-[#3ECF8E] uppercase tracking-widest">Supabase Database</span>
            </div>
          </div>

          {/* Container 2: Professional Network & Links */}
          <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-[0_0_50px_rgba(147,51,234,0.05)] relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-blue-500"></span>
              Connect With The Architect
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://www.linkedin.com/in/m-ahmad-khalid-bb0514377/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#0A66C2]/20 hover:border-[#0A66C2] transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-[#0A66C2] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white">LinkedIn</span>
              </a>

              <a href="https://github.com/MAhmadK5" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-black transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-black">GitHub</span>
              </a>

              <a href="https://wa.me/923015906959" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#25D366]/20 hover:border-[#25D366] transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-[#25D366] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.195 1.585 6.014L.16 23.84l5.973-1.566C7.945 23.321 9.943 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white">WhatsApp</span>
              </a>

              <a href="mailto:connectahmadkhalid@gmail.com" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-500/20 hover:border-rose-500 transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-rose-500 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white">Email</span>
              </a>

              <a href="https://www.facebook.com/share/1J19KTD3nE/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#1877F2]/20 hover:border-[#1877F2] transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-[#1877F2] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white">Facebook</span>
              </a>

              <a href="https://www.instagram.com/could_be_ahmad/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#E4405F]/20 hover:border-[#E4405F] transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-[#E4405F] transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white">Instagram</span>
              </a>

              <a href="https://stackoverflow.com/users/32577852/muhammad-ahmad-khalid" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#F58025]/20 hover:border-[#F58025] transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-[#F58025] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M15.725 10.63l-7.794-1.636-.341 1.63 7.794 1.636.341-1.63zm1.189 3.037l-7.538.74-.162 1.658 7.538-.74.162-1.658zm-1.077-6.242l-6.86-4.004-.836 1.442 6.86 4.004.836-1.442zm2.083 9.475v3.1h-11.84v-3.1h-1.666v4.766h15.17v-4.766h-1.664zm-10.174-1.652h7.962v-1.666h-7.962v1.666zm5.111-13.882l-5.753 5.568 1.157 1.2 5.753-5.568-1.157-1.2z"/></svg>
                </div>
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white">Stack Overflow</span>
              </a>

              <a href="https://me.developers.google.com/u/AhmadKhalid" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#4285F4]/20 hover:border-[#4285F4] transition-all group/link">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-[#4285F4] transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-white line-clamp-1">Google Dev Groups</span>
              </a>

              <a href="https://vercel.com/mahmadk5s-projects" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-black transition-all group/link sm:col-span-2">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover/link:bg-black transition-colors shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest group-hover/link:text-black leading-none mb-1">Vercel Deployment</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover/link:text-zinc-600">Infrastructure</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ✨ MAXED OUT: DIRECT LINE TO THE ARCHITECT (Feedback Form) ✨ */}
        <div className="max-w-4xl mx-auto bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_0_50px_rgba(255,255,255,0.02)] relative overflow-hidden group hover:border-purple-500/30 hover:shadow-[0_0_80px_rgba(147,51,234,0.1)] transition-all duration-700 mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
          
          {isSuccess ? (
            // SUCCESS UI ANIMATION
            <div className="relative z-10 flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <svg className="w-12 h-12 text-green-400 animate-[bounce_1s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-3">Transmission Received</h3>
              <p className="text-lg text-zinc-400 font-light tracking-wide text-center max-w-md">
                Thank you for your insights. Your data has been securely logged into my terminal.
              </p>
            </div>
          ) : (
            // FEEDBACK FORM UI
            <>
              <div className="relative z-10 text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">Direct Line</h2>
                <p className="text-zinc-400 font-light tracking-wide text-lg max-w-2xl mx-auto">
                  Have a feature request, spotted a bug, or just want to discuss the architecture? Send a secure transmission to my database.
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name Input with Icon */}
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required
                      value={feedback.name}
                      onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                      className="w-full bg-zinc-950/50 border border-white/10 text-white pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-light placeholder:text-zinc-600 shadow-inner hover:bg-black/60" 
                    />
                  </div>

                  {/* Email Input with Icon */}
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      required
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      className="w-full bg-zinc-950/50 border border-white/10 text-white pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-light placeholder:text-zinc-600 shadow-inner hover:bg-black/60" 
                    />
                  </div>
                </div>
                
                {/* Textarea with Icon */}
                <div className="relative group/input">
                  <div className="absolute top-5 left-4 flex items-start pointer-events-none">
                    <svg className="h-5 w-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <textarea 
                    placeholder="Suggest a feature or report an issue..." 
                    required
                    rows={4}
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    className="w-full bg-zinc-950/50 border border-white/10 text-white pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-light placeholder:text-zinc-600 resize-none custom-scrollbar shadow-inner hover:bg-black/60" 
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 overflow-hidden relative group ${
                    isSubmitting 
                      ? 'bg-zinc-800 text-zinc-500 cursor-wait' 
                      : 'bg-white text-black hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                  
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Submit to Developer</span>
                      <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* ✨ QUOTE & FOOTER ✨ */}
        <div className="text-center pt-10 border-t border-white/10 max-w-2xl mx-auto">
          <p className="text-2xl md:text-3xl text-zinc-300 font-light leading-relaxed tracking-wide italic mb-6">
            "We don't just write code. We architect experiences."
          </p>
          <p className="text-sm font-black text-purple-400 uppercase tracking-[0.4em] mb-12">
            — Muhammad Ahmad Khalid
          </p>
          
          <Link href="/market" className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-black hover:bg-purple-600 hover:text-white font-black text-sm uppercase tracking-[0.3em] rounded-none transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group">
            Explore the Shop
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>

      </div>
    </>
  );
}