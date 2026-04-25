import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pt-20 pb-24 min-h-screen relative z-10 flex flex-col items-center">
      
      {/* --- HERO SECTION --- */}
      <div className="text-center max-w-3xl mb-20 space-y-6">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl">
          Redefining the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500">Digital Bazaar.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide leading-relaxed">
          We don't just sell products. We engineer an ecosystem where cutting-edge artificial intelligence meets high-end retail. 
        </p>
      </div>

      {/* --- THE ORIGIN STORY GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full mb-24">
        
        {/* Left Card: The Origin */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-10 sm:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-colors duration-500"></div>
          
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            The Origin
          </h2>
          <p className="text-zinc-300 leading-relaxed font-light mb-4">
            Born out of the vibrant tech hub of Islamabad, GoBAZAAR was conceptualized by Abdul Rafy to bridge the gap between premium lifestyle products and next-generation technology. 
          </p>
          <p className="text-zinc-300 leading-relaxed font-light">
            Rooted in advanced Computer Science principles, the platform was built from the ground up to eliminate the friction of traditional online shopping. No more endless scrolling. Just smart, curated, and seamless experiences.
          </p>
        </div>

        {/* Right Card: The AI Advantage */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-10 sm:p-12 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-500"></div>
          
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
            The Engine
          </h2>
          <p className="text-zinc-300 leading-relaxed font-light mb-4">
            Under the hood, GoBAZAAR is powered by a proprietary AI architecture. Our intelligent 24/7 support agent and dynamic recommendation engine learn from market trends in real-time.
          </p>
          <p className="text-zinc-300 leading-relaxed font-light">
            We believe that technology should be invisible but impactful. You get the aesthetic you want, with the performance and speed you demand.
          </p>
        </div>
      </div>

      {/* --- METRICS / BRAGGING RIGHTS --- */}
      <div className="w-full max-w-5xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
          <span className="text-4xl font-black text-blue-400 mb-2">24/7</span>
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">AI Support Active</span>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 sm:pt-0">
          <span className="text-4xl font-black text-white mb-2">0.2s</span>
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Avg. Response Time</span>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 sm:pt-0">
          <span className="text-4xl font-black text-orange-400 mb-2">100%</span>
          <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Curated Quality</span>
        </div>
      </div>

      {/* --- CALL TO ACTION --- */}
      <div className="mt-24 text-center">
        <h3 className="text-2xl font-black text-white mb-6">Ready to experience the future?</h3>
        <Link href="/market">
          <button className="px-10 py-5 bg-blue-600 hover:bg-orange-500 text-white text-sm font-black uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105 duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
            Enter the Market
          </button>
        </Link>
      </div>

    </div>
  );
}