import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import AiChat from '../components/AiChat';
import WhatsAppButton from '../components/WhatsAppButton';// ✨ IMPORT THIS ✨
import Cart from '../components/Cart';
import { CartProvider } from '../context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoBAZAAR | Smart Shopping',
  description: 'Premium products, powered by intelligent AI support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 selection:text-white flex flex-col min-h-screen`}>
        
        <CartProvider>
          <Header />
          
          <main className="max-w-6xl mx-auto px-6 flex-grow w-full pt-32 overflow-x-hidden">
            {children}
          </main>

          <Footer />
          <WhatsAppButton /> {/* ✨ HUMAN SUPPORT (Left) ✨ */}
          <AiChat />         {/* ✨ AI ASSISTANT (Right) ✨ */}
          <Cart />
        </CartProvider>
        
      </body>
    </html>
  );
}