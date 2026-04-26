import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AiChat from '@/components/AiChat';
import Cart from '@/components/Cart';

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
    <html lang="en" className="dark overflow-x-hidden">
      <body className={`${inter.className} bg-zinc-950 min-h-screen pt-32 text-zinc-100 selection:bg-blue-500/30 selection:text-white relative flex flex-col overflow-x-hidden w-full`}>
        
        <Header />
        
       <main className="max-w-6xl mx-auto px-6 relative z-10 flex-grow w-full">
          {children}
        </main>

        <Footer />
        <AiChat />
        <Cart />
      </body>
    </html>
  );
}