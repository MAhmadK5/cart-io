import type { Metadata } from 'next';
// ✨ CHANGED TO STANDARD ALUMNI SANS FOR READABILITY AND THICKNESS ✨
import { Alumni_Sans } from 'next/font/google'; 
import './globals.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import AiChat from '../components/AiChat';
import Cart from '../components/Cart';
import { CartProvider } from '../context/CartContext';
import WhatsAppButton from '../components/WhatsAppButton';
import BackButton from '../components/BackButton';

// Initialize Alumni Sans with bold weights for readability!
const alumniSans = Alumni_Sans({ 
  weight: ['400'],
  subsets: ['latin'] 
});

export const metadata: Metadata = {
  title: 'CARTIO | Ultimate Luxury',
  description: 'Elevating your everyday essentials. A curated premium lifestyle brand.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Increased base text size, added font-semibold (weight 600) and tracking-wider */}
      <body className={`${alumniSans.className} font-semibold tracking-wider bg-zinc-950 min-h-[100dvh] text-zinc-100 selection:bg-purple-500/30 selection:text-white flex flex-col overflow-x-hidden w-full text-xl md:text-2xl`}>
        
        <CartProvider>
          <Header />
          
          
          <main className="flex-grow pt-32">
            {children}
          </main>
          
          <Footer />
          <Cart />
          
          <WhatsAppButton />
          <AiChat />
        </CartProvider>

      </body>
    </html>
  );
}