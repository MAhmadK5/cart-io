"use client";

import Link from 'next/link';

export default function RefundPage() {
  return (
    <>
      {/* ✨ THE LUXURY ANIMATED BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-8 relative z-10 max-w-5xl mx-auto animate-fade-in">
        
        {/* Editorial Header */}
        <div className="mb-16 md:mb-20 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </div>
          <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.4em] mb-4">Official Directives</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Return Process</h1>
          <p className="text-zinc-400 mt-6 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            The CARTIO 7-Day Satisfaction Record.
          </p>
        </div>

        {/* Glassmorphic Container */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(147,51,234,0.1)] space-y-12 md:space-y-16">
          
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              The 3-Day Window
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              Our standard return window lasts 3 days from the date of successful delivery. If 3 days have passed since your asset arrived, we unfortunately cannot offer a refund or exchange. To be eligible for a return, your item must be strictly unused, in the exact same condition that you received it, and housed in its original, undamaged packaging with all tags attached.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Unboxing Rules
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-6">
              To ensure absolute transparency and to rapidly process claims for damaged or missing items, we highly encourage all clients to record a clear, continuous unboxing video upon receiving their package. Claims regarding physical damage or missing components without video evidence may be subject to rejection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Reverse Logistics
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-6">
              Unless the asset received is demonstrably defective or incorrect due to an error on our part, the client is responsible for bearing the shipping costs Rs.250+ for returning the item to our facility. Original shipping costs are strictly non-refundable. If you receive a refund, the cost of the original delivery logistics will be deducted from your total refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Refund Processing
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-6">
              Once your return is received and physically inspected by our quality assurance team, we will notify you of the approval or rejection of your refund. If approved, your funds will be securely transferred within 3 to 5 business days. For clients in Pakistan, refunds are issued strictly via IBFT (Inter-Bank Fund Transfer), JazzCash, or EasyPaisa.
            </p>
            <div className="flex items-center gap-3 px-5 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl w-fit shadow-[0_0_15px_rgba(147,51,234,0.15)] mt-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span> 
              <span className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-widest">IBFT / JazzCash / EasyPaisa</span>
            </div>
          </section>

          {/* Action Footer */}
          <div className="pt-10 border-t border-white/10 mt-12 text-center">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-6">Need to initiate a return?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/923196514249" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#25D366] text-black hover:bg-[#20bd5a] font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-none transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.195 1.585 6.014L.16 23.84l5.973-1.566C7.945 23.321 9.943 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                WhatsApp Support
              </a>
              <Link href="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border border-white/20 text-white hover:bg-white hover:text-black font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-none transition-all">
                Return to Homepage
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}