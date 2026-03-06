'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Star } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<{name: string, exp?: number} | null>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  useEffect(() => {
    // Determine if authenticated, but DO NOT STRICTLY REDIRECT. Let them see the immersive brand page.
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {
        console.error("Invalid user formatting");
      }
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050510]">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-1 w-32 bg-indigo-500/30 rounded overflow-hidden">
                <div className="h-full bg-indigo-400 w-1/3 animate-ping"></div>
            </div>
        </div>
      </div>
    );
  }

  const flavors = [
    { name: 'Vanilla Dream', img: '/images/vanilla_ice_cream_1772789459043.png', desc: 'Madagascar vanilla beans slow-churned to perfection.' },
    { name: 'Mint Symphony', img: '/images/mint.png', desc: 'Fresh garden mint folded with rich dark chocolate shards.' },
    { name: 'Midnight Espresso', img: '/images/espresso.png', desc: 'Cold-pressed Arabica layers in a velvet swill.' },
    { name: 'Artisan Mango', img: '/images/mango.png', desc: 'Alphonso mangos whipped into an airy, tropical cloud.' }
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-gray-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-80 animate-slow-zoom"
            style={{ backgroundImage: 'url("/images/floating_ice_cream_hero.png")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-transparent to-[#050510]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/60 via-transparent to-[#050510]/60"></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold tracking-[0.2em] uppercase mb-8 shadow-inner backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {user ? 'Welcome Back' : 'The Pinnacle of Taste'}
          </div>
          
          {user ? (
            <>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] mb-6 leading-[0.9] text-white">
                Welcome <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 pb-4 filter drop-shadow-[0_0_40px_rgba(56,189,248,0.6)]">
                  {user.name} 😂
                </span>
              </h1>
              <p className="mt-2 text-xl max-w-2xl mb-12 font-light leading-relaxed tracking-wide text-gray-300">
                Your premium dashboard is ready. Dive back into the world's most luxurious ice cream catalog and continue exploring artisanal perfection.
              </p>
              
              <Link href="/products" className="group relative inline-flex items-center justify-center px-12 py-5 font-bold tracking-wide text-white rounded-full bg-white/5 border border-white/20 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-500 overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600/40 via-cyan-600/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></span>
                <span className="relative flex items-center gap-3">
                  Explore Catalog
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] mb-6 leading-[0.9] text-white">
                Refined <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 pb-4 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  Excellence.
                </span>
              </h1>
              
              <p className="mt-2 text-xl max-w-2xl mb-12 font-light leading-relaxed tracking-wide text-gray-300">
                An exclusive collection of masterfully crafted, artisanal flavors. Authenticate to access your curated catalog and experience indulgence redefined.
              </p>
              
              <Link href="/auth" className="group relative inline-flex items-center justify-center px-12 py-5 font-bold tracking-wide text-white rounded-full bg-white/5 border border-white/20 hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-500 overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-pink-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></span>
                <span className="relative flex items-center gap-3">
                  Unlock Experience 
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* SECTION 2: FEATURED FLAVORS (Glassmorphism Cards) */}
      <section className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Signature Curations</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Glimpse the artistry behind our most sought-after creations.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {flavors.map((flavor, idx) => (
            <motion.div 
              key={flavor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
              <div className="relative p-8 h-full flex flex-col items-center text-center">
                <div className="w-40 h-40 mb-8 relative drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500">
                  <img src={flavor.img} alt={flavor.name} className="w-full h-full object-contain filter " />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{flavor.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{flavor.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: BRAND STORY / PHILOSOPHY */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col border-white/5 lg:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <img src="/images/lifestyle_1.png" alt="Artisanal Quality" className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-80"></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold tracking-widest text-sm uppercase">
              <ShieldCheck className="w-4 h-4" /> Our Philosophy
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">Zero Compromise. <br/><span className="text-gray-500">Zero Shortcuts.</span></h2>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              We source organic Madagascar vanilla, hand-selected Alpine berries, and single-origin cacao. Every pint is churned slowly in small batches to achieve a density and velvet texture that mass production simply cannot replicate.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="border-l border-indigo-500/50 pl-4">
                <Leaf className="w-6 h-6 text-indigo-400 mb-2" />
                <h4 className="text-white font-bold text-lg">100% Organic</h4>
                <p className="text-sm text-gray-400">Pure, unadulterated nature.</p>
              </div>
              <div className="border-l border-pink-500/50 pl-4">
                <Star className="w-6 h-6 text-pink-400 mb-2" />
                <h4 className="text-white font-bold text-lg">Michelin-grade</h4>
                <p className="text-sm text-gray-400">Crafted by culinary masters.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA & FOOTER */}
      <section className="relative py-40 flex flex-col items-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full relative"
        >
          <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50 rounded-full"></div>
          <div className="relative glass border border-white/10 rounded-[3rem] p-16 backdrop-blur-2xl shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready for the Extraordinary?</h2>
            <p className="text-xl text-gray-400 font-light mb-12">Join the exclusive echelon of connoisseurs. The world's finest ice cream awaits your palette.</p>
            <Link href="/auth" className="inline-flex items-center justify-center px-16 py-6 font-bold tracking-wide text-white rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 text-lg">
              Authenticate Now
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} IceCream Hub. The Absolute Luxury Standard.</p>
      </footer>
    </div>
  );
}
