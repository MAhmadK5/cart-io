"use client";

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      {/* ✨ THE LUXURY ANIMATED BACKGROUND ✨ */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-8 relative z-10 max-w-5xl mx-auto animate-fade-in">
        
        {/* Editorial Header */}
        <div className="mb-16 md:mb-20 text-center">
          <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.4em] mb-4">Official Directives</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Privacy Policy</h1>
          <p className="text-zinc-400 mt-6 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            How CARTIO collects, secures, and utilizes your data to provide a seamless premium experience.
          </p>
        </div>

        {/* Glassmorphic Container */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_50px_rgba(147,51,234,0.1)] space-y-12 md:space-y-16">
          
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Data Collection
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              When you secure an asset from CART IO, we collect standard personal information required to fulfill your order. This includes your full name, mobile number (crucial for order verification in Pakistan), exact delivery address, and email address. When you browse our e-Shop, we automatically receive your computer’s internet protocol (IP) address to help us learn about your browser and operating system, ensuring a seamless experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Logistics & Courier Partners
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-6">
              To guarantee nationwide delivery across Pakistan, CART IO partners with premium local logistics and courier services (such as TCS, Leopards, CallCourier, or Trax). We only share the absolute minimum required data—your name, phone number, and delivery address—with these third parties solely for the purpose of fulfilling and dispatching your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Payment & Security
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide mb-6">
              For Cash on Delivery (COD) orders, your mobile number will be used to verify the authenticity of the order before dispatch. For prepaid orders, our digital payment gateways adhere to strict industry standards (PCI-DSS) to ensure the secure handling of credit and debit card information. We do not store your raw credit card details on our local servers.
            </p>
            <div className="flex items-center gap-3 px-5 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl w-fit shadow-[0_0_15px_rgba(147,51,234,0.15)]">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-widest">256-Bit SSL Encrypted Protocol</span>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Cookies & Tracking
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              CARTIO utilizes cookies to maintain the contents of your shopping cart, remember your device for future visits, and gather analytics to improve our boutique's design. You have the right to disable cookies through your browser settings, though this may restrict your ability to seamlessly purchase items from our store.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-purple-500"></span>
              Your Privacy Rights
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
              You retain the right to access, modify, or request the permanent deletion of your personal data stored within our network. If you wish to amend your information or opt out of promotional communications, you may contact our dedicated support team via WhatsApp or Email at any time.
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