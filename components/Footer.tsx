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

            {/* ✨ NEW: HEADQUARTERS & OFFICE ADDRESSES ✨ */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
              
              {/* Headquarters */}
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Headquarters
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light pr-4">
                  Ward No 3, Ali Town,<br/>
                  Chowk Azam, Layyah,<br/>
                  Punjab, Pakistan
                </p>
              </div>

              {/* Office */}
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"></path></svg>
                  Corporate Office
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light pr-4">
                  House 8, Street 46, Alhumd Colony,<br/>
                  Lahore, Punjab,<br/>
                  Pakistan
                </p>
              </div>

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

            {/* ✨ NEW: OPERATIONAL HOURS ✨ */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Operational Hours
              </h4>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-zinc-400 font-light">Monday — Sunday</p>
                <p className="text-sm font-black text-white tracking-widest">06:00 AM <span className="text-zinc-600">—</span> 12:00 AM</p>
              </div>
            </div>

          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-light mb-8">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
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

              {/* M&P COURIER */}
              <div className="flex items-center gap-1.5 cursor-default group" title="M&P Courier">
                <div className="flex items-center text-[#F4AA41] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
                <span className="text-[14px] font-black uppercase tracking-widest mt-0.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 text-[#F4AA41]">
                  M&P
                </span>
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