"use client";

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      { q: "How long does delivery take?", a: "Standard delivery across Pakistan takes 7 business days." },
      { q: "Is there a Delivery Fee ?", a: "YES- (TCS) charges Rupees 250 for a single delivery...But the delivery charges are complementary, 'If the order amount is above Rupees 3000'" },
      { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, we offer Cash on Delivery nationwide for all orders under Rs. 10,000 to ensure maximum trust and convenience." },
      { q: "Can I change my shipping address?", a: "You can update your shipping address within 12 hours of placing the order by contacting our Support Desk via WhatsApp (Preferred) or EMAIL." }
    ]
  },
  {
    category: "Products & AI",
    questions: [
      { q: "What is 'AI Synthesis' in the product descriptions?", a: "We are using GEMINI ENGINE in the website to help customers by getting information for the items listed in CARTIO shop. Incoming Update : We will use advanced AI algorithms to aggregate thousands of global reviews, giving you a 99% accurate summary of build quality, material feel, and overall asset integrity." },
      { q: "Are the products authentic?", a: "100%. Every asset on Cartio is sourced directly from verified manufacturers and passes a strict 3-point quality check before being shipped." }
    ]
  },
  {
    category: "Returns,Exchange & Refunds",
    questions: [
      { q: "What is your return policy?", a: "We don't offer a refund till now. Soon we are going to support that . Sorry for any Inconvenience. Although there is exchange possible If the product is damaged, we will replace it for you completely." },
      { q: "How do I initiate a return?", a: "Not supporting Returns till now. Coming Soon! " }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggleFAQ = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-4xl mx-auto animate-fade-in">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Frequently Asked Questions</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">Everything you need to know about <i> <b> Cartio </b> </i> logistics, Product verification, and support services.</p>
      </div>

      <div className="space-y-12">
        {faqs.map((section, sIndex) => (
          <div key={sIndex}>
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-blue-500/50"></span>
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((faq, qIndex) => {
                const index = `${sIndex}-${qIndex}`;
                const isOpen = openIndex === index;
                
                return (
                  <div 
                    key={qIndex} 
                    className={`border transition-all duration-300 rounded-2xl overflow-hidden ${isOpen ? 'bg-zinc-900/80 border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/40'}`}
                  >
                    <button 
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                    >
                      <h3 className={`font-bold text-sm md:text-base transition-colors ${isOpen ? 'text-white' : 'text-zinc-300'}`}>
                        {faq.q}
                      </h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 border ${isOpen ? 'bg-blue-500 text-white border-blue-500 rotate-180' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 bg-gradient-to-br from-blue-900/20 to-orange-900/20 border border-white/10 rounded-3xl text-center backdrop-blur-sm">
        <h3 className="text-xl font-black text-white mb-2 tracking-widest uppercase">Still need help?</h3>
        <p className="text-zinc-400 text-sm mb-6">Our Support Desks are online 12 hours-Replies in 20-30 mintues to assist you.</p>
        <Link href="/" className="inline-block px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
          Contact Support
        </Link>
      </div>
      
    </div>
  );
}