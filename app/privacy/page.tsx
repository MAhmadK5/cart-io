import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Privacy Protocol</h1>
        <p className="text-zinc-400">Data Security & Privacy Ledger</p>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.3)] space-y-8">
        
        <section>
          <h2 className="text-lg font-black text-blue-400 uppercase tracking-widest mb-4">Data Collection</h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, phone number, and email address. When you browse our store, we also automatically receive your computer’s internet protocol (IP) address.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-blue-400 uppercase tracking-widest mb-4">Security & Encryption</h2>
          <p className="text-zinc-400 font-light leading-relaxed mb-4">
            To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full w-fit">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">256-Bit SSL Secured Node</span>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black text-blue-400 uppercase tracking-widest mb-4">Third-Party Services</h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us (such as delivery couriers and payment gateways).
          </p>
        </section>

      </div>
    </div>
  );
}