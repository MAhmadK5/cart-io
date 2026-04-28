"use client";

import { useRouter, usePathname } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // 🧠 SMART LOGIC: Hide the back button if we are on the Homepage or Admin screen
  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-28 left-4 md:left-8 z-[9000] flex items-center justify-center w-10 h-10 bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-400 rounded-full hover:bg-white hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group"
      aria-label="Go Back"
    >
      {/* Arrow Icon that slides slightly left on hover */}
      <svg 
        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
  );
}