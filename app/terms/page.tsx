"use client";

import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      {/* ✨ THE LUXURY ANIMATED BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-8 relative z-10 max-w-5xl mx-auto animate-fade-in">
        
        {/* Editorial Header */}
        <div className="mb-16 md:mb-20 text-center">
          <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.4em] mb-4">Official Directives</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Terms of Service</h1>
          <p className="text-zinc-400 mt-6 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            The foundational agreements for accessing and utilizing the CARTIO network.
          </p>
        </div>

        {/* Glassmorphic Container */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(147,51,234,0.1)] space-y-12 md:space-y-16">
          
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              1. Platform Agreement
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              By accessing or utilizing the CARTIO platform, you agree to be bound unconditionally by these Terms of Service. If you do not agree to all the terms and conditions outlined in this ledger, you are prohibited from accessing the boutique or using any of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              2. Asset Pricing & Modifications
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-4">
              All prices displayed on the CARTIO network are in Pakistani Rupees (PKR) and are inclusive of standard local taxes unless explicitly stated otherwise. We reserve the right to modify the pricing of our premium assets, or discontinue specific items, at any time without prior notice.
            </p>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              CARTIO shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of a product line.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              3. Cash on Delivery (COD) Protocol
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-6">
              To maintain the integrity of our logistics network across Pakistan, all Cash on Delivery (COD) orders are subject to telephonic or WhatsApp verification. CARTIO reserves the right to hold, delay, or permanently cancel any COD order if the provided mobile number is unreachable, invalid, or flagged by our system for previous fraudulent activity.
            </p>
            <div className="flex items-center gap-3 px-5 py-3 bg-red-500/10 border border-red-500/30 rounded-xl w-fit shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span className="text-xs md:text-sm font-bold text-red-400 uppercase tracking-widest">Strict Zero-Tolerance for Fake Orders</span>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              4. Accuracy of Billing
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and highly accurate purchase and account information (including a valid Pakistani mobile number and complete postal address) for all transactions made at our store.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              5. Governing Law
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed strictly in accordance with the laws of the Islamic Republic of Pakistan. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Lahore.
            </p>
          </section>

          {/* Action Footer */}
          <div className="pt-10 border-t border-white/10 mt-12 text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black hover:bg-purple-600 hover:text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-none transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Return to Homepage
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}