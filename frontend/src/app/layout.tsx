import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'IceCream Hub | Premium Desserts',
  description: 'Gourmet ice cream delivered to your door.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-black text-white">
        <Navbar />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <footer className="py-12 border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 font-light tracking-widest text-sm">
              &copy; {new Date().getFullYear()} <span className="text-brand-400 font-bold border-b border-brand-500/30 pb-1">IceCream Hub</span>. 
              <br className="sm:hidden" /> 
              <span className="mx-2 hidden sm:inline">|</span> 
              Website Rights Reserved by <span className="text-white font-medium bg-brand-500/10 px-2 py-0.5 rounded">Akhil</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
