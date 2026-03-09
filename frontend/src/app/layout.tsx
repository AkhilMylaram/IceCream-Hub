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
      <body className="font-sans bg-black text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
