"use client";

import Link from 'next/link';
import { useState } from 'react';
// ✨ Import Supabase! ✨
import { supabase } from '../lib/supabase';

export default function Footer() {
  const supportPhoneWA = "923196514249"; 
  const supportPhoneDisplay = "+92 319 651 4249";
  const supportEmail = "gobaazaar0@gmail.com";

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✨ CONNECTED TO SUPABASE ✨
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      // Push the email to your new table
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: email }]);

      // If they are already subscribed, Supabase throws a '23505' unique error.
      // We can just ignore it and show success anyway to protect their privacy!
      if (error && error.code !== '23505') {
        throw error;
      }

      setIsSuccess(true);
      setEmail(''); // Clear the input
      
      // Reset the button back to normal after 4 seconds
      setTimeout(() => setIsSuccess(false), 4000);

    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Something went wrong connecting to the network. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-zinc-950 pt-20 pb-10 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* Top Section: Newsletter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-16 border-b border-white/5">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black text-white tracking-widest uppercase mb-2">Stay in the loop</h3>
            <p className="text-sm text-zinc-400 font-light">Sign up for exclusive offers, new arrivals, and premium lifestyle tips.</p>
          </div>
          
          {/* FUNCTIONAL NEWSLETTER FORM */}
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col relative">
            <div className="flex items-center relative w-full md:w-80">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting || isSuccess}
                placeholder="Enter your email address..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-full py-3 pl-6 pr-32 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`absolute right-1 top-1 bottom-1 px-6 font-bold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center min-w-[100px] ${
                  isSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-black hover:bg-orange-500 hover:text-white'
                } disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : isSuccess ? (
                  <span>Joined!</span>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>
            {isSuccess && (
              <p className="absolute -bottom-6 left-6 text-[10px] text-green-400 font-bold uppercase tracking-widest animate-fade-in">
                Welcome to the inner circle.
              </p>
            )}
          </form>
        </div>

        {/* Middle Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
          <img 
           src="/cart-io-logo.png" 
           alt="CART IO" 
          className="h-19 w-auto object-contain mb-6" 
            />
            <p className="text-xs text-zinc-400 leading-relaxed font-light mb-6 pr-4">
              Elevating your everyday essentials. A curated premium lifestyle brand designed for your modern home.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-zinc-500">
              <a href="https://www.instagram.com/cartio.pk?igsh=MTIzY293MHVsOXA0MA==&utm_source=ig_contact_invite" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="https://www.facebook.com/share/1KmDTRiPtK/?mibextid=wwXIfr" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="#" className="hover:text-white transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/></svg></a>
              <a href="https://www.tiktok.com/@cartio.pk?_r=1&_t=ZS-95yS6EaWPVl" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-light">
              <li><Link href="/market?category=Stanley+tumblers" className="hover:text-white transition-colors">Stanley Tumblers</Link></li>
              <li><Link href="/market?category=Beauty+products" className="hover:text-white transition-colors">Beauty & Skincare</Link></li>
              <li><Link href="/market?category=Prayer+Mat" className="hover:text-white transition-colors">Premium Prayer Mats</Link></li>
              <li><Link href="/market?category=MiNi+Fan" className="hover:text-white transition-colors">Mini Fans</Link></li>
              <li><Link href="/market?category=Decoration" className="hover:text-white transition-colors">Home Decor</Link></li>
            </ul>
          </div>

          {/* Support Desk */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6">Help & Support</h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-light">
              <li>
                <a href={`https://wa.me/${supportPhoneWA}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-green-400 transition-colors group">
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  <span className="font-bold">WhatsApp Us</span>
                </a>
              </li>
              <li>
                <a href={`sms:${supportPhoneDisplay}`} className="flex items-center gap-3 hover:text-blue-400 transition-colors group">
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span>Text: {supportPhoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-3 hover:text-orange-400 transition-colors group">
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>{supportEmail}</span>
                </a>
              </li>
              <li className="pt-2"><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-light mb-8">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
  © {new Date().getFullYear()} CART IO. All rights reserved.
</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Developed by <span className="text-white">AHMAD KHALID</span> |{' '}
               <a href="https://www.linkedin.com/in/m-ahmad-khalid-bb0514377" className="hover:text-blue-400 transition-colors">LinkedIn</a> |{' '}
              <a href="https://github.com/MAhmadK5" className="hover:text-orange-400 transition-colors">GitHub</a>
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Secure Checkout
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}