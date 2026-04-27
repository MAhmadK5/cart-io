import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Return & Refund Protocol</h1>
        <p className="text-zinc-400">Our 7-Day Satisfaction Ledger</p>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        
        <div className="p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">The 7-Day Window</h2>
            <p className="text-zinc-400 font-light leading-relaxed">
              Our policy lasts 7 days. If 7 days have gone by since your asset was delivered, unfortunately, we cannot offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">Initiating a Return</h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-4">
              To complete your return, we require a receipt or proof of purchase (Your Order ID). Please contact our Support Desk via WhatsApp or Email to open a return ticket. Do not send your purchase back to the manufacturer.
            </p>
            <Link href="/faq" className="text-xs font-bold text-orange-400 uppercase tracking-widest hover:text-white transition-colors">
              → View Support Contact Details
            </Link>
          </section>

          <section>
            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">Refund Processing</h2>
            <p className="text-zinc-400 font-light leading-relaxed">
              Once your return is received and inspected, we will send you an email or WhatsApp notification to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied via Bank Transfer or your original method of payment, within 3-5 business days.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}