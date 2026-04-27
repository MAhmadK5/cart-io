import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Terms of Service</h1>
        <p className="text-zinc-400">Last Updated: April 2026</p>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        
        <section className="border-b border-white/5 pb-8 mb-8">
          <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">1. Network Agreement</h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            By accessing or using the GOBAAZAAR platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services.
          </p>
        </section>

        <section className="border-b border-white/5 pb-8 mb-8">
          <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">2. Asset Pricing & Modifications</h2>
          <p className="text-zinc-400 font-light leading-relaxed mb-4">
            Prices for our products (assets) are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>
          <p className="text-zinc-400 font-light leading-relaxed">
            All prices are listed in Pakistani Rupees (PKR) unless otherwise stated.
          </p>
        </section>

        <section className="border-b border-white/5 pb-8 mb-8">
          <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">3. Accuracy of Billing</h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4">4. Governing Law</h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Pakistan.
          </p>
        </section>

      </div>
    </div>
  );
}