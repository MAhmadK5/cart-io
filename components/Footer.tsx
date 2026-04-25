import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-xl border-t border-white/10 pt-16 pb-8 mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
              <span className="text-blue-500">Go</span>
              <span className="text-orange-500">BAZAAR</span>
            </Link>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              The premier AI-driven marketplace for modern, high-end products. Smart shopping starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/apparel" className="hover:text-blue-400 transition-colors">Apparel</Link></li>
              <li><Link href="/tech" className="hover:text-blue-400 transition-colors">Tech</Link></li>
              <li><Link href="/accessories" className="hover:text-blue-400 transition-colors">Accessories</Link></li>
              <li><Link href="/sale" className="hover:text-orange-400 transition-colors">On Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">AI FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-blue-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Stay Connected</h4>
            <p className="text-xs text-zinc-400 mb-4">Subscribe for exclusive drops and AI-curated deals.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-zinc-900/50 border border-zinc-700 text-white text-xs px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
              />
              <button className="bg-blue-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} GoBAZAAR. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}