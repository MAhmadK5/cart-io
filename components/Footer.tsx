"use client";

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const supportPhoneWA = "923196514249"; 
  const supportPhoneDisplay = "+92 319 651 4249";
  const supportEmail = "pkcartio@gmail.com";

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: email }]);

      if (error && error.code !== '23505') {
        throw error;
      }

      setIsSuccess(true);
      setEmail(''); 
      
      setTimeout(() => setIsSuccess(false), 4000);

    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Something went wrong connecting to the network. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-zinc-950 pt-20 pb-6 overflow-hidden">
      
      {/* MASSIVE BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[12rem] md:text-[20rem] lg:text-[28rem] font-black text-white/[0.015] uppercase tracking-tighter whitespace-nowrap">
          CARTIO
        </span>
      </div>

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
          
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col relative">
            <div className="flex items-center relative w-full md:w-80">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting || isSuccess}
                placeholder="Enter your email address..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-full py-3 pl-6 pr-32 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 shadow-inner"
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
              <a href="https://www.instagram.com/cartio.pk?igsh=MTIzY293MHVsOXA0MA==&utm_source=ig_contact_invite" target="_blank" rel="noopener noreferrer" className="hover:text-pink-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1KmDTRiPtK/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@cartio.pk?_r=1&_t=ZS-95yS6EaWPVl" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
              <a href="https://x.com/cartiopk?s=21" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.threads.com/@cartio.pk?invite=0" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 11.233c.319-2.22-1.393-4.526-4-4.526-2.585 0-4.47 1.95-4.47 5.253 0 3.328 1.914 5.275 4.502 5.275 1.547 0 2.846-.628 3.513-1.637l-1.572-1.1c-.42.593-1.077.942-1.941.942-1.42 0-2.45-.885-2.618-2.296h6.732c.038-.382.062-.84.062-1.334l-.004-.577h-6.732c.168-1.408 1.196-2.294 2.616-2.294.945 0 1.637.382 1.996 1.047h1.916v-.053zm-6.52 1.334h4.636c-.168 1.033-1.002 1.7-2.318 1.7-1.314 0-2.15-.667-2.318-1.7z"/>
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" clipRule="evenodd"/>
                </svg>
              </a>
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

        {/* ========================================= */}
        {/* ✨ UNBREAKABLE TRUST BADGES & BOTTOM BAR ✨ */}
        {/* ========================================= */}
        <div className="flex flex-col pt-8 mt-4 gap-8 border-t border-white/5">
          
          {/* Top Row: Trust Badges (Re-ordered above copyright) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-6 text-zinc-600 mb-2">
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Secure Checkout</span>
            </div>

            {/* SECURE GATEWAYS */}
            <div className="flex flex-wrap items-center gap-5 justify-center">
              
              {/* VISA */}
              <div className="flex items-center hover:text-blue-950 transition-colors cursor-default" title="Visa">
                <span className="text-xl font-black italic tracking-tighter">VISA</span>
              </div>

              {/* MASTERCARD - EXACT SVG WITH PREMIUM HOVER */}
              <div className="flex items-center cursor-default" title="Mastercard">
                <svg viewBox="0 -9 58 58" fill="none" className="h-7 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <rect x="0.5" y="0.5" width="57" height="39" rx="3.5" fill="white" stroke="#F3F3F3"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.2489 30.8906V32.3674V33.8443H20.6016V33.4857C20.3963 33.7517 20.0848 33.9186 19.6614 33.9186C18.8266 33.9186 18.1722 33.27 18.1722 32.3674C18.1722 31.4656 18.8266 30.8163 19.6614 30.8163C20.0848 30.8163 20.3963 30.9832 20.6016 31.2492V30.8906H21.2489ZM19.7419 31.4218C19.1816 31.4218 18.8387 31.8483 18.8387 32.3674C18.8387 32.8866 19.1816 33.3131 19.7419 33.3131C20.2773 33.3131 20.6387 32.905 20.6387 32.3674C20.6387 31.8299 20.2773 31.4218 19.7419 31.4218ZM43.1228 32.3674C43.1228 31.8483 43.4657 31.4218 44.026 31.4218C44.5621 31.4218 44.9228 31.8299 44.9228 32.3674C44.9228 32.905 44.5621 33.3131 44.026 33.3131C43.4657 33.3131 43.1228 32.8866 43.1228 32.3674ZM45.5338 29.7044V32.3674V33.8443H44.8858V33.4857C44.6804 33.7517 44.3689 33.9186 43.9455 33.9186C43.1107 33.9186 42.4563 33.27 42.4563 32.3674C42.4563 31.4656 43.1107 30.8163 43.9455 30.8163C44.3689 30.8163 44.6804 30.9832 44.8858 31.2492V29.7044H45.5338ZM29.2838 31.3914C29.7008 31.3914 29.9688 31.6509 30.0373 32.1079H28.4925C28.5616 31.6814 28.8225 31.3914 29.2838 31.3914ZM27.8138 32.3674C27.8138 31.4465 28.424 30.8163 29.2966 30.8163C30.1307 30.8163 30.7038 31.4465 30.7102 32.3674C30.7102 32.4537 30.7038 32.5344 30.6974 32.6143H28.4868C28.5802 33.1462 28.9601 33.3379 29.3771 33.3379C29.6758 33.3379 29.9938 33.2261 30.2433 33.0288L30.5605 33.5048C30.1991 33.8075 29.7885 33.9186 29.3401 33.9186C28.449 33.9186 27.8138 33.3068 27.8138 32.3674ZM37.1126 32.3674C37.1126 31.8483 37.4555 31.4218 38.0158 31.4218C38.5511 31.4218 38.9126 31.8299 38.9126 32.3674C38.9126 32.905 38.5511 33.3131 38.0158 33.3131C37.4555 33.3131 37.1126 32.8866 37.1126 32.3674ZM39.5228 30.8906V32.3674V33.8443H38.8755V33.4857C38.6695 33.7517 38.3587 33.9186 37.9352 33.9186C37.1004 33.9186 36.446 33.27 36.446 32.3674C36.446 31.4656 37.1004 30.8163 37.9352 30.8163C38.3587 30.8163 38.6695 30.9832 38.8755 31.2492V30.8906H39.5228ZM33.4569 32.3674C33.4569 33.2636 34.0857 33.9186 35.0452 33.9186C35.4936 33.9186 35.7923 33.8196 36.116 33.5663L35.8051 33.0472C35.5621 33.2205 35.3068 33.3131 35.026 33.3131C34.5091 33.3068 34.1292 32.9361 34.1292 32.3674C34.1292 31.7988 34.5091 31.4281 35.026 31.4218C35.3068 31.4218 35.5621 31.5144 35.8051 31.6877L36.116 31.1685C35.7923 30.9153 35.4936 30.8163 35.0452 30.8163C34.0857 30.8163 33.4569 31.4713 33.4569 32.3674ZM41.0177 31.2492C41.1859 30.9896 41.429 30.8163 41.8026 30.8163C41.9337 30.8163 42.1205 30.8411 42.2638 30.8969L42.0642 31.5024C41.9273 31.4465 41.7904 31.4281 41.6593 31.4281C41.2358 31.4281 41.0241 31.6997 41.0241 32.1885V33.8443H40.3761V30.8906H41.0177V31.2492ZM24.4505 31.1254C24.1389 30.9217 23.7098 30.8163 23.2364 30.8163C22.4822 30.8163 21.9967 31.1749 21.9967 31.762C21.9967 32.2437 22.3582 32.5407 23.024 32.6334L23.3298 32.6765C23.6848 32.7261 23.8524 32.8187 23.8524 32.9856C23.8524 33.2141 23.6157 33.3442 23.1737 33.3442C22.7253 33.3442 22.4017 33.2021 22.1835 33.0351L21.8784 33.5352C22.2334 33.7948 22.6818 33.9186 23.1673 33.9186C24.027 33.9186 24.5253 33.5168 24.5253 32.9545C24.5253 32.4353 24.1332 32.1637 23.4852 32.0711L23.1801 32.0272C22.9 31.9904 22.6754 31.9353 22.6754 31.7372C22.6754 31.5208 22.8871 31.3914 23.2421 31.3914C23.6221 31.3914 23.9899 31.5335 24.1703 31.6446L24.4505 31.1254ZM32.0184 31.2492C32.1859 30.9896 32.429 30.8163 32.8025 30.8163C32.9337 30.8163 33.1205 30.8411 33.2637 30.8969L33.0641 31.5024C32.9273 31.4465 32.7904 31.4281 32.6592 31.4281C32.2358 31.4281 32.0241 31.6997 32.0241 32.1885V33.8443H31.3768V30.8906H32.0184V31.2492ZM27.2784 30.8906H26.2198V29.9944H25.5654V30.8906H24.9616V31.4776H25.5654V32.8251C25.5654 33.5105 25.8334 33.9186 26.5991 33.9186C26.8799 33.9186 27.2036 33.8323 27.4089 33.6901L27.2221 33.1398C27.0289 33.2509 26.8172 33.3068 26.649 33.3068C26.3253 33.3068 26.2198 33.1087 26.2198 32.8123V31.4776H27.2784V30.8906ZM17.5997 31.9904V33.8443H16.9453V32.2005C16.9453 31.6997 16.7336 31.4218 16.2916 31.4218C15.8617 31.4218 15.563 31.6941 15.563 32.2069V33.8443H14.9086V32.2005C14.9086 31.6997 14.6912 31.4218 14.2613 31.4218C13.8186 31.4218 13.5321 31.6941 13.5321 32.2069V33.8443H12.8784V30.8906H13.5264V31.2548C13.7695 30.909 14.0803 30.8163 14.3982 30.8163C14.853 30.8163 15.1767 31.0144 15.382 31.3418C15.6564 30.9274 16.0485 30.8099 16.4285 30.8163C17.1513 30.8227 17.5997 31.2923 17.5997 31.9904Z" fill="#231F20"/>
                  <path d="M34.0465 25.8715H24.2359V8.3783H34.0465V25.8715Z" fill="#FF5F00"/>
                  <path d="M24.8583 17.1253C24.8583 13.5767 26.5328 10.4157 29.1405 8.37867C27.2336 6.88907 24.8269 5.99998 22.2114 5.99998C16.0194 5.99998 11 10.9809 11 17.1253C11 23.2697 16.0194 28.2506 22.2114 28.2506C24.8269 28.2506 27.2336 27.3615 29.1405 25.8719C26.5328 23.8349 24.8583 20.6739 24.8583 17.1253" fill="#EB001B"/>
                  <path d="M47.2818 17.1253C47.2818 23.2697 42.2624 28.2506 36.0704 28.2506C33.4548 28.2506 31.0482 27.3615 29.1405 25.8719C31.7489 23.8349 33.4235 20.6739 33.4235 17.1253C33.4235 13.5767 31.7489 10.4157 29.1405 8.37867C31.0482 6.88907 33.4548 5.99998 36.0704 5.99998C42.2624 5.99998 47.2818 10.9809 47.2818 17.1253" fill="#F79E1B"/>
                </svg>
              </div>

              {/* AMEX - EXACT SVG WITH PREMIUM HOVER */}
              <div className="flex items-center cursor-default" title="American Express">
                <svg viewBox="0 0 512 512" className="h-7 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <path fill="#306FC5" d="M512,402.281c0,16.716-13.55,30.267-30.265,30.267H30.265C13.55,432.549,0,418.997,0,402.281V109.717 c0-16.715,13.55-30.266,30.265-30.266h451.47c16.716,0,30.265,13.551,30.265,30.266V402.281L512,402.281z"/>
                  <path opacity="0.15" fill="#202121" d="M21.517,402.281V109.717 c0-16.715,13.552-30.266,30.267-30.266h-21.52C13.55,79.451,0,93.001,0,109.717v292.565c0,16.716,13.55,30.267,30.265,30.267h21.52 C35.07,432.549,21.517,418.997,21.517,402.281z"/>
                  <g>
                    <polygon fill="#FFFFFF" points="74.59,220.748 89.888,220.748 82.241,201.278 "/>
                    <polygon fill="#FFFFFF" points="155.946,286.107 155.946,295.148 181.675,295.148 181.675,304.885 155.946,304.885 155.946,315.318 184.455,315.318 197.666,300.712 185.151,286.107 "/>
                    <polygon fill="#FFFFFF" points="356.898,201.278 348.553,220.748 364.548,220.748 "/>
                    <polygon fill="#FFFFFF" points="230.348,320.875 230.348,281.241 212.268,300.712 "/>
                    <path fill="#FFFFFF" d="M264.42,292.368c-0.696-4.172-3.48-6.261-7.654-6.261h-14.599v12.516h15.299 C261.637,298.624,264.42,296.539,264.42,292.368z"/>
                    <path fill="#FFFFFF" d="M313.09,297.236c1.391-0.697,2.089-2.785,2.089-4.867c0.696-2.779-0.698-4.172-2.089-4.868 c-1.387-0.696-3.476-0.696-5.559-0.696h-13.91v11.127h13.909C309.613,297.932,311.702,297.932,313.09,297.236z"/>
                    <path fill="#FFFFFF" d="M413.217,183.198v8.344l-4.169-8.344H376.37v8.344l-4.174-8.344h-44.502 c-7.648,0-13.909,1.392-19.469,4.173v-4.173h-31.289v0.696v3.477c-3.476-2.78-7.648-4.173-13.211-4.173h-111.95l-7.652,17.384 l-7.647-17.384h-25.031h-10.431v8.344l-3.477-8.344h-0.696H66.942l-13.909,32.68L37.042,251.34l-0.294,0.697h0.294h35.463h0.444 l0.252-0.697l4.174-10.428h9.039l4.172,11.125h40.326v-0.697v-7.647l3.479,8.343h20.163l3.475-8.343v7.647v0.697h15.993h79.965 h0.696v-18.08h1.394c1.389,0,1.389,0,1.389,2.087v15.297h50.065v-4.172c4.172,2.089,10.426,4.172,18.771,4.172h20.863l4.172-11.123 h9.732l4.172,11.123h40.328v-6.952v-3.476l6.261,10.428h1.387h0.698h30.595v-68.143h-31.291l0,0H413.217z M177.501,241.609h-6.955 h-4.171v-4.169v-34.076l-0.696,1.595v-0.019l-16.176,36.669h-0.512h-3.719h-6.017l-16.687-38.245v38.245h-23.64l-4.867-10.43 H70.417l-4.868,10.43H53.326l20.57-48.675h17.382l19.469,46.587v-46.587h4.171h14.251l0.328,0.697h0.024l8.773,19.094l6.3,14.306 l0.223-0.721l13.906-33.375H177.5v48.674H177.501L177.501,241.609z M225.481,203.364h-27.119v9.039h26.423v9.734h-26.423v9.738 h27.119v10.427h-38.939v-49.367h38.939V203.364L225.481,203.364z M275.076,221.294c0.018,0.016,0.041,0.027,0.063,0.042 c0.263,0.278,0.488,0.557,0.68,0.824c1.332,1.746,2.409,4.343,2.463,8.151c0.004,0.066,0.007,0.131,0.011,0.197 c0,0.038,0.007,0.071,0.007,0.11c0,0.022-0.002,0.039-0.002,0.06c0.016,0.383,0.026,0.774,0.026,1.197v9.735h-10.428v-5.565 c0-2.781,0-6.954-2.089-9.735c-0.657-0.657-1.322-1.09-2.046-1.398c-1.042-0.675-3.017-0.686-6.295-0.686h-12.52v17.384h-11.818 v-48.675h26.425c6.254,0,10.428,0,13.906,2.086c3.407,2.046,5.465,5.439,5.543,10.812c-0.161,7.4-4.911,11.46-8.326,12.829 C270.676,218.662,272.996,219.129,275.076,221.294z M298.491,241.609h-11.822v-48.675h11.822V241.609z M434.083,241.609h-15.3 l-22.25-36.855v30.595l-0.073-0.072v6.362h-11.747v-0.029h-11.822l-4.172-10.43H344.38l-4.172,11.123h-13.211 c-5.559,0-12.517-1.389-16.687-5.561c-4.172-4.172-6.256-9.735-6.256-18.773c0-6.953,1.389-13.911,6.256-19.472 c3.474-4.175,9.735-5.562,17.382-5.562h11.128v10.429h-11.128c-4.172,0-6.254,0.693-9.041,2.783 c-2.082,2.085-3.474,6.256-3.474,11.123c0,5.564,0.696,9.04,3.474,11.821c2.091,2.089,4.87,2.785,8.346,2.785h4.867l15.991-38.243 h6.957h10.428l19.472,46.587v-2.376v-15.705v-1.389v-27.116h17.382l20.161,34.07v-34.07h11.826v47.977h0.002L434.083,241.609 L434.083,241.609z"/>
                    <path fill="#FFFFFF" d="M265.161,213.207c0.203-0.217,0.387-0.463,0.543-0.745c0.63-0.997,1.352-2.793,0.963-5.244 c-0.016-0.225-0.057-0.433-0.105-0.634c-0.013-0.056-0.011-0.105-0.026-0.161l-0.007,0.001c-0.346-1.191-1.229-1.923-2.11-2.367 c-1.394-0.693-3.48-0.693-5.565-0.693h-13.909v11.127h13.909c2.085,0,4.172,0,5.565-0.697c0.209-0.106,0.395-0.25,0.574-0.413 l0.002,0.009C264.996,213.389,265.067,213.315,265.161,213.207z"/>
                    <path fill="#FFFFFF" d="M475.105,311.144c0-4.867-1.389-9.736-3.474-13.212v-31.289h-0.032v-2.089c0,0-29.145,0-33.483,0 c-4.336,0-9.598,4.171-9.598,4.171v-4.171h-31.984c-4.87,0-11.124,1.392-13.909,4.171v-4.171h-57.016v2.089v2.081 c-4.169-3.474-11.824-4.171-15.298-4.171h-37.549v2.089v2.081c-3.476-3.474-11.824-4.171-15.998-4.171H215.05l-9.737,10.431 l-9.04-10.431h-2.911h-4.737h-54.93v2.089v5.493v62.651h61.19l10.054-10.057l8.715,10.057h0.698h35.258h1.598h0.696h0.692v-6.953 v-9.039h3.479c4.863,0,11.124,0,15.991-2.089v17.382v1.394h31.291v-1.394V317.4h1.387c2.089,0,2.089,0,2.089,2.086v14.6v1.394 h94.563c6.263,0,12.517-1.394,15.993-4.175v2.781v1.394h29.902c6.254,0,12.517-0.695,16.689-3.478 c6.402-3.841,10.437-10.64,11.037-18.749c0.028-0.24,0.063-0.48,0.085-0.721l-0.041-0.039 C475.087,312.043,475.105,311.598,475.105,311.144z M256.076,306.973h-13.91v2.081v4.174v4.173v7.649h-22.855l-13.302-15.299 l-0.046,0.051l-0.65-0.748l-15.297,15.996h-44.501v-48.673h45.197l12.348,13.525l2.596,2.832l0.352-0.365l14.604-15.991h36.852 c7.152,0,15.161,1.765,18.196,9.042c0.365,1.441,0.577,3.043,0.577,4.863C276.237,304.189,266.502,306.973,256.076,306.973z M325.609,306.276c1.389,2.081,2.085,4.867,2.085,9.041v9.732h-11.819v-6.256c0-2.786,0-7.65-2.089-9.739 c-1.387-2.081-4.172-2.081-8.341-2.081H292.93v18.077h-11.82v-49.369h26.421c5.559,0,10.426,0,13.909,2.084 c3.474,2.088,6.254,5.565,6.254,11.128c0,7.647-4.865,11.819-8.343,13.212C322.829,303.49,324.914,304.885,325.609,306.276z M373.589,286.107h-27.122v9.04h26.424v9.737h-26.424v9.736h27.122v10.429H334.65V275.68h38.939V286.107z M402.791,325.05h-22.252 v-10.429h22.252c2.082,0,3.476,0,4.87-1.392c0.696-0.697,1.387-2.085,1.387-3.477c0-1.394-0.691-2.778-1.387-3.475 c-0.698-0.695-2.091-1.391-4.176-1.391c-11.126-0.696-24.337,0-24.337-15.296c0-6.954,4.172-14.604,16.689-14.604h22.945v11.819 h-21.554c-2.085,0-3.478,0-4.87,0.696c-1.387,0.697-1.387,2.089-1.387,3.478c0,2.087,1.387,2.783,2.778,3.473 c1.394,0.697,2.783,0.697,4.172,0.697h6.259c6.259,0,10.43,1.391,13.211,4.173c2.087,2.087,3.478,5.564,3.478,10.43 C420.869,320.179,414.611,325.05,402.791,325.05z M462.59,320.179c-2.778,2.785-7.648,4.871-14.604,4.871H425.74v-10.429h22.245 c2.087,0,3.481,0,4.87-1.392c0.693-0.697,1.391-2.085,1.391-3.477c0-1.394-0.698-2.778-1.391-3.475 c-0.696-0.695-2.085-1.391-4.172-1.391c-11.122-0.696-24.337,0-24.337-15.295c0-6.609,3.781-12.579,13.106-14.352 c1.115-0.154,2.293-0.253,3.583-0.253h22.948v11.819h-15.3h-5.561h-0.696c-2.087,0-3.476,0-4.865,0.696 c-0.7,0.697-1.396,2.089-1.396,3.478c0,2.087,0.696,2.783,2.785,3.473c1.389,0.697,2.78,0.697,4.172,0.697h0.691h5.565 c3.039,0,5.337,0.375,7.44,1.114c1.926,0.697,8.302,3.549,9.728,10.994c0.124,0.78,0.215,1.594,0.215,2.495 C466.761,313.925,465.37,317.401,462.59,320.179z"/>
                  </g>
                </svg>
              </div>

              {/* EASYPAISA - EXACT SVG WITH GREEN HOVER */}
              <div className="flex items-center text-zinc-500 hover:text-[#00B55E] transition-colors cursor-default" title="Easypaisa">
                <svg viewBox="0 0 48 48" className="h-6 w-auto" fill="none">
                  <path stroke="currentColor" strokeLinejoin="round" d="M24.6025,4.5c8.516,0,15.42,5.7166,15.42,12.7693S33.12,28.6141,24.6025,28.6141Q12.4689,28.3687,7.4111,20.972A1.6469,1.6469,0,0,1,7.1663,19.73Q10.0575,5.2982,24.6025,4.5Zm-.5751,7.9439q-7.3449.7437-8.9894,6.9928,2.2406,1.9754,8.9894,2.1927c4.5207-.0711,7.2591-1.389,7.3129-4.4525C31.0589,13.7933,27.7687,12.3159,24.0274,12.4439Z"/>
                  <path stroke="currentColor" strokeLinejoin="round" d="M6.396,24.71C8.9221,31.9571,15.8885,35.99,23.05,35.99c5.9392,0,9.8755-2.5707,11.94-6.4492L41.6456,33.71c-2.32,5.6749-9.1977,9.79-17.3225,9.79-10.0289,0-18.617-6.7591-17.93-18.5113C6.393,24.8952,6.394,24.8017,6.396,24.71Z"/>
                </svg>
              </div>

              {/* JAZZCASH */}
              <div className="flex items-center hover:text-[#ED1C24] transition-colors cursor-default" title="JazzCash">
                <span className="text-[14px] font-black tracking-tight">JazzCash</span>
              </div>

              {/* BANK TRANSFER - EXACT SVG WITH PREMIUM HOVER */}
              <div className="flex items-center gap-1 cursor-default" title="Direct Bank Transfer">
                <svg viewBox="0 0 512 512" className="h-7 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <path fill="#E7E8E3" d="M512,402.282c0,16.716-13.55,30.267-30.265,30.267H30.265C13.55,432.549,0,418.996,0,402.282V109.717 c0-16.716,13.55-30.266,30.265-30.266h451.469c16.716,0,30.265,13.551,30.265,30.266L512,402.282L512,402.282z"/>
                  <path opacity="0.15" fill="#202121" d="M21.517,402.282V109.717 c0-16.716,13.552-30.266,30.267-30.266h-21.52C13.55,79.451,0,93.003,0,109.717v292.565c0,16.716,13.55,30.267,30.265,30.267h21.52 C35.07,432.549,21.517,418.996,21.517,402.282z"/>
                  <g>
                    <path fill="#006E90" d="M146.165,179.389h38.042c14.009-0.227,29.384,3.418,29.384,20.389c0,7.289-4.329,13.211-10.706,16.4 c8.654,2.505,14.011,10.024,14.011,19.249c0,19.363-14.239,25.284-31.665,25.284h-39.066L146.165,179.389L146.165,179.389z M167.348,211.395h16.404c3.643,0,8.654-1.937,8.654-7.745c0-5.923-4.215-7.858-8.654-7.858h-16.404L167.348,211.395 L167.348,211.395z M167.348,243.741h16.972c6.719,0,11.389-2.391,11.389-9.111c0-7.176-5.011-9.568-11.389-9.568h-16.972V243.741z" />
                    <path fill="#006E90" d="M250.487,179.389h21.524l30.411,81.322h-22.096l-5.011-14.578h-28.36l-5.126,14.578h-21.754 L250.487,179.389z M251.852,230.417h18.45l-8.998-28.474h-0.226L251.852,230.417z"/>
                    <path fill="#006E90" d="M308.336,179.389h21.757l28.246,50.115h0.226v-50.115H378.5v81.322h-21.757l-28.246-50.682h-0.226 v50.682h-19.935V179.389z"/>
                    <path fill="#006E90" d="M392.957,179.389h21.185v31.209l26.765-31.209h26.311l-30.07,32.006l33.829,49.317h-26.309 l-21.869-34.167l-8.656,9.112v25.056h-21.185V179.39L392.957,179.389L392.957,179.389z"/>
                  </g>
                  <g>
                    <path fill="#66CDE7" d="M92.893,290.217H76.184v43.452H61.598v-43.452H44.891v-12.55h48.002V290.217z"/>
                    <path fill="#66CDE7" d="M99.324,277.668h28.55c9.883,0,19.608,4.472,19.608,15.764c0,6.04-2.899,11.766-8.783,14.042v0.155 c5.96,1.414,7.684,8.078,8.156,13.413c0.157,2.352,0.394,10.587,2.354,12.629h-14.435c-1.254-1.882-1.489-7.373-1.646-8.941 c-0.394-5.648-1.332-11.451-8.156-11.451h-11.059v20.392H99.324V277.668z M113.916,301.981h12.232c4.393,0,6.746-2.352,6.746-6.586 c0-4.156-3.294-6.042-7.372-6.042h-11.607C113.916,289.353,113.916,301.981,113.916,301.981z"/>
                    <path fill="#66CDE7" d="M171.169,277.668h14.824l20.941,56.002h-15.218l-3.448-10.041h-19.531l-3.528,10.041h-14.983 L171.169,277.668z M172.111,312.806h12.707l-6.197-19.611h-0.157L172.111,312.806z"/>
                    <path fill="#66CDE7" d="M211.015,277.668h14.98l19.453,34.511h0.159v-34.511h13.726v56.002h-14.98l-19.455-34.902h-0.157 v34.902h-13.726L211.015,277.668L211.015,277.668z"/>
                    <path fill="#66CDE7" d="M280.665,314.845c0.315,6.588,4.393,8.704,10.59,8.704c4.391,0,8.941-1.567,8.941-5.724 c0-4.941-8.001-5.882-16.078-8.159c-8.001-2.274-16.394-5.88-16.394-16.157c0-12.235,12.315-17.02,22.826-17.02 c11.137,0,22.352,5.41,22.432,18.039h-14.589c0.235-5.098-4.55-6.745-9.021-6.745c-3.137,0-7.059,1.097-7.059,4.785 c0,4.313,8.078,5.097,16.235,7.373c8.081,2.274,16.237,6.038,16.237,16.156c0,14.198-12.08,18.748-24.393,18.748 c-12.863,0-24.234-5.649-24.316-20.001h14.589V314.845z"/>
                    <path fill="#66CDE7" d="M321.608,277.668h41.258v11.686h-26.667v11.452h23.059v11.292h-23.059v21.572h-14.591V277.668z"/>
                    <path fill="#66CDE7" d="M369.535,277.668h44.629v11.686h-30.041v9.805h27.452v11.294h-27.452v10.668h30.826v12.548h-45.413 L369.535,277.668L369.535,277.668z"/>
                    <path fill="#66CDE7" d="M423.263,277.668h28.55c9.883,0,19.606,4.472,19.606,15.764c0,6.04-2.9,11.766-8.783,14.042v0.155 c5.96,1.414,7.687,8.078,8.156,13.413c0.159,2.352,0.392,10.587,2.354,12.629h-14.433c-1.257-1.882-1.489-7.373-1.647-8.941 c-0.392-5.648-1.332-11.451-8.156-11.451h-11.058v20.392h-14.589L423.263,277.668L423.263,277.668z M437.852,301.981h12.237 c4.391,0,6.742-2.352,6.742-6.586c0-4.156-3.291-6.042-7.372-6.042h-11.607V301.981z"/>
                  </g>
                  <g>
                    <rect x="44.889" y="179.38" fill="#D92B2B" width="88.3" height="17.682"/>
                    <rect x="44.889" y="243.03" fill="#D92B2B" width="88.3" height="17.681"/>
                    <rect x="44.889" y="211.2" fill="#D92B2B" width="88.3" height="17.682"/>
                  </g>
                </svg>
              </div>
            </div>
            
            {/* LOGISTICS & INFRASTRUCTURE */}
            <div className="flex flex-wrap items-center gap-5 justify-center border-t border-white/5 pt-4 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8">
              
                 {/* XPAY */}
              <div className="flex items-center hover:text-green-600 transition-colors cursor-default" title="Xpay">
                <span className="text-xl font-black  tracking-tighter"><b>X</b>PAY</span>
              </div>

              {/* LEOPARDS - EXACT SVG WITH PREMIUM HOVER */}
              <div className="flex items-center gap-1.5 cursor-default" title="Leopards Courier">
                <svg viewBox="0 0 72 72" className="h-7 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <g id="color">
                    <path fill="#F4AA41" stroke="none" d="M10.921,22.5547l-4.0185,2.0136l-2.5423,1.7802l-0.8686,2.7256l-1.4696,4.1912l1.8157,2.3282l5.8333-1.5797 l1.6224,1.5797l3.6707,1.9249l1.2487,4.3261l-4.0418,3.9438l-1.4167,4.3797l0.539,2.6654l2.8043,2.3565l3.0014-2.8463 c0,0-0.5245-3.0007,0.9404-4.3388c1.4649-1.3381,3.3757-3.7385,3.3757-3.7385v8.4005l0.6012,2.5443l2.2353,0.4577l1.3519-1.8344 l1.4614-12.9224l2.2658,0.2907l5.9944,0.5474l4.2084-2.0965l1.1374,4.6127l3.6984,3.7385l-0.79,4.7548l1.175,2.2688l2.5399-1.4963 l2.3975-4.1153v-3.6284l-4.1458-4.0474l7.6544,5.3456l2.7721,1.7794l0.7162,5.8899l1.9164,0.9706l1.8163-1.4347l-0.7805-9.0342 L57.9183,43.88l-3.4836-5.7002l0.2779-4.3048l-0.5946-5.3399c-3.7098-1.924-7.58-2.9066-11.6334-2.8146l-8.4753-0.0539 l-7.4206,0.5278l-4.8427-1.3913l-6.8252-0.2347l-1.6817-1.3828L10.921,22.5547z"/>
                    <path fill="#FFFFFF" stroke="none" d="M42.2127,37.086c0,0-10.6875-4.6485-14.25-0.211l-0.8976,4.037l4.3849,0.963l7.2002-1.375L42.2127,37.086z"/>
                    <path fill="#FFFFFF" stroke="none" d="M19.921,40.875l-4.9167,2.6667l-3.5503,4.4631v5.4119l4.4253,1.6116l1.4167-2.945 c0,0-0.3051-2.6254,0.7435-3.875c1.0486-1.2496,3.2982-4.125,3.2982-4.125l-0.25-2.2083L19.921,40.875z"/>
                    <path fill="#FFFFFF" stroke="none" d="M40.6294,43.0417c0,0,7.625-1.2709,9.8333,2.6041v3.7292l-3.75,5.6533l-2.2083,0.1827l-1.125-1.5443 l0.99-4.375l-0.6984-1.625l-1.4583-2.5295L40.6294,43.0417z"/>
                    <path fill="#F4AA41" stroke="none" d="M54.046,33.8333c0,0,2.5005,9.2708,6.3755,11.8124c3.875,2.5417,5.7079,2.9792,7.8745,2.5626 c1.8129-0.3486,1.5833-2.5626,1.5833-2.5626H67.796l-6.0833-3.2291l-1.5719-3.2761l-0.7198-2.8489l-1.0833-4.0282L54.874,29.049 l-2.0363-1.1324L54.046,33.8333z"/>
                  </g>
                  <g id="line">
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M14.3304,24.5107h6.2586c0.7536,0,1.4984,0.1615,2.1843,0.4735l0.9154,0.4165c1.3718,0.6241,2.8873,0.8609,4.3831,0.6759 c5.4788-0.6773,18.8505-0.9925,23.8963,1.3062c6.9315,3.1578,6.4836,7.3762,7.3482,9.6455 c0.8646,2.2692,2.9583,9.0061,9.6667,8.5999"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M18.1805,35.1274c0.4163,2.1503,1.4556,4.6774,3.6201,7.4476v11.1514c0,1.1046,0.8954,2,2,2h0.1891 c1.0865,0,1.9746-0.8635,1.9993-1.9497c0.0903-3.9687,1.4782-15.2085,2.4732-16.836c0,0-0.6371-2.5625-1.25-4.25"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M12.2006,35.0056c0.415,0.6388,1.6554,1.4664,2.4862,1.8528c0.4386,0.204,0.753,0.6061,0.8782,1.0733l1.2429,4.6375 c0,0-7.3532,3.9727-4.451,10.976c0.2972,0.7173,1.0845,1.4253,2.1262,1.5869c1.0894,0.169,3.0014-0.6707,2.3248-2.6707"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M27.9975,40.6854c0,0,7.5589,2.9477,14.0283-2.9477c0,0,0.1031,1.7447,6.2829,6.0852c0,0,3.7501,2.8987,7.6317,4.7127 l0.5507,5.6552c0.0906,0.9305,1.1792,1.5357,2.1141,1.5357h0c1.0579,0,1.892-0.9006,1.8109-1.9555l-0.615-7.9988 c-0.0424-0.5518-0.4406-0.9553-0.9528-1.1649c-1.3235-0.5416-3.4173-4.1666-4.7819-7.2291l-0.4167-3.316"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M38.567,40.0831c0,0,1.352,4.1254,6.2702,8.5451l-0.8725,4.0737c-0.2501,1.1677,0.6401,2.2688,1.8343,2.2688h0 c0.7351,0,1.4005-0.426,1.7053-1.0949c0.6068-1.3321,1.3466-3.5208,2.0204-4.5392"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M13.8249,26.0657c1.7351-2.7653-1.6752-4.625-3.754-2.9065c-1.5286,1.2637-2.3807,1.2238-2.3807,1.2238 c-3.8209,1.0685-3.5524,3.9198-3.5524,3.9198l-1.6985,4.6446c-0.0943,0.3356,0.0237,0.6948,0.2985,0.9092l1.6702,1.3022 c0.5103,0.3978,1.188,0.4859,1.7866,0.2402c1.6796-0.6895,5.3397-2.6848,5.3397-5.6474"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M21.8006,44.2085c0,0-2.9432,1.5902-4.3161,3.7385"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M49.1796,35.6907c-0.8284,0-1.5-0.6716-1.5-1.5c0-0.8284,0.6716-1.5,1.5-1.5c0.3365,0,0.6472,0.1108,0.8975,0.298"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M32.1366,32.2635c-0.8284,0-1.5-0.6716-1.5-1.5s0.6716-1.5,1.5-1.5c0.3365,0,0.6472,0.1108,0.8975,0.298"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M40.4841,32.8772c-0.6478-0.5164-0.7544-1.4601-0.238-2.1079c0.5164-0.6478,1.4601-0.7544,2.1079-0.238 c0.2632,0.2098,0.437,0.4901,0.5161,0.7924"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M17.5144,32.1c-0.6478-0.5164-0.7544-1.4601-0.238-2.1079c0.5164-0.6478,1.4601-0.7544,2.1079-0.238 c0.2632,0.2098,0.437,0.4901,0.5161,0.7924"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M34.3948,35.5775c0.5438-0.6249,1.4913-0.6907,2.1162-0.1468c0.6249,0.5438,0.6907,1.4913,0.1468,2.1162 c-0.2209,0.2539-0.5085,0.4155-0.814,0.4814"/>
                    <path fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M22.0056,34.7229c0.5438-0.6249,1.4913-0.6907,2.1162-0.1468c0.6249,0.5438,0.6907,1.4913,0.1468,2.1162 c-0.2209,0.2539-0.5085,0.4155-0.814,0.4814"/>
                  </g>
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Leopards</span>
              </div>

              {/* SUPABASE (Official Path) */}
              <div className="flex items-center gap-1.5 hover:text-[#3ECF8E] transition-colors cursor-default" title="Powered by Supabase">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001 2.011a2.003 2.003 0 0 0-1.637.848l-7.462 10.36a2 2 0 0 0 1.625 3.167h5.186v5.602a2 2 0 0 0 3.14 1.638l8.281-6.626a2 2 0 0 0-1.25-3.562h-5.698l1.455-7.14a2.002 2.002 0 0 0-1.656-2.428 1.986 1.986 0 0 0-.317-.024z"/>
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Supabase</span>
              </div>

              {/* GEMINI */}
              <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-default" title="AI by Google Gemini">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/>
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Gemini AI</span>
              </div>

            </div>

          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Bottom Row: Copyright & Dev Credit */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} CARTIO. All rights reserved.
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold text-center md:text-right">
              Developed by <span className="text-white">AHMAD KHALID</span> |{' '}
              <a href="https://www.linkedin.com/in/m-ahmad-khalid-bb0514377" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a> |{' '}
              <a href="https://github.com/MAhmadK5" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">GitHub</a>
            </p>
          </div>
          
        </div>

      </div>
    </footer>
  );
}