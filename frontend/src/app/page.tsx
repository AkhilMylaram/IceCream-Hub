'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Star, ChevronDown, PlayCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    // Strict Routing: Authenticated users should never see the promotion page.
    const userStr = localStorage.getItem('user');
    if (userStr) {
      router.push('/products');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020205]">
        <div className="flex flex-col items-center">
            <div className="h-1 w-48 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ x: '-100%' }} 
                  animate={{ x: '100%' }} 
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-full bg-white w-1/2 rounded-full blur-[2px]"
                />
            </div>
            <p className="text-gray-500 mt-4 text-sm font-semibold tracking-widest uppercase">Initializing Vault...</p>
        </div>
      </div>
    );
  }

  const flavors = [
    { name: 'Vanilla Dream', img: '/images/flavor_vanilla_dream_new.png', desc: 'Madagascar vanilla beans slow-churned to absolute perfection with 24k gold flakes.', color: 'from-amber-200 to-amber-500' },
    { name: 'Mint Symphony', img: '/images/mint.png', desc: 'Fresh garden mint folded seamlessly with rich dark Ecuadorian chocolate shards.', color: 'from-emerald-300 to-emerald-600' },
    { name: 'Midnight Espresso', img: '/images/espresso.png', desc: 'Cold-pressed Arabica layers spun intricately into a velvet twilight swirl.', color: 'from-zinc-400 to-zinc-700' },
    { name: 'Artisan Mango', img: '/images/mango.png', desc: 'Alphonso mangos whipped passionately into an airy, tropical luminous cloud.', color: 'from-orange-300 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* HEADER NAV */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md border-b border-white/5"
      >
        <div className="text-xl font-black tracking-tighter mix-blend-difference z-50">
          IceCream<span className="text-pink-500">Hub</span>
        </div>
        <Link href="/auth" className="text-sm font-semibold tracking-widest uppercase hover:text-pink-400 transition-colors z-50">
          Sign In
        </Link>
      </motion.nav>

      {/* SECTION 1: HYPER-CINEMATIC HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div style={{ opacity: heroOpacity, y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center object-cover"
            style={{ backgroundImage: 'url("/images/floating_ice_cream_hero_new.png")' }}
          />
          {/* Gradients to blend into dark bg — keep light so image is clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020205]/20 via-transparent to-[#020205]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative z-10 w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between text-left mt-16"
        >
            <div className="md:w-[60%] space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-pink-300 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase shadow-inner backdrop-blur-md"
                >
                <Sparkles className="w-3 h-3 text-pink-400" />
                The New Standard of Dessert
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
                Taste <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 pr-2 pb-4 inline-block drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                    The Future.
                </span>
                </h1>
                
                <p className="text-lg md:text-2xl max-w-lg font-light leading-relaxed tracking-wide text-gray-300">
                Experience the world's most luxurious, avant-garde ice cream flavors—designed for the ultimate connoisseurs. 
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/auth" className="group relative inline-flex items-center justify-center px-10 py-5 font-bold tracking-widest uppercase text-white rounded-full bg-white/5 border border-white/20 hover:border-pink-500 hover:bg-white/10 transition-all duration-500 overflow-hidden shadow-[0_0_40px_rgba(236,72,153,0)] hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-cyan-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg xl:blur-xl"></span>
                      <span className="relative flex items-center gap-3">
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                  </Link>
                  <button className="group inline-flex items-center justify-center px-8 py-5 font-bold tracking-widest uppercase text-white rounded-full transition-all duration-300 hover:text-pink-400 cursor-pointer">
                    <span className="flex items-center gap-3">
                      <PlayCircle className="w-6 h-6" /> Explore Story
                    </span>
                  </button>
                </div>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hidden md:flex"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase font-semibold">Scroll</span>
            <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
        </motion.div>
      </section>

      {/* SECTION 2: THE COLLECTION */}
      <section className="relative py-20 px-6 md:px-12 max-w-[1400px] mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
        >
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold tracking-widest uppercase text-sm mb-4">
              <span className="h-[2px] w-12 bg-pink-500 inline-block"></span>
              The Collection
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Iconic Flavors</h2>
          </div>
          <p className="text-xl text-gray-400 max-w-md font-light">
            Meticulously engineered blends to transcend mere taste and evoke pure ecstasy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flavors.map((flavor, idx) => (
            <motion.div 
              key={flavor.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="group relative h-[450px] rounded-[2rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden hover:from-white/30 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-[#06060c] group-hover:bg-[#0a0a14] transition-colors duration-500 rounded-[2rem]"></div>
              
              {/* Dynamic Glow */}
              <div className={`absolute -inset-24 bg-gradient-to-r ${flavor.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}></div>
              
              <div className="relative p-8 h-full flex flex-col items-center text-center justify-between z-10">
                <div className="w-full h-48 relative flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 ease-out">
                  <div className="absolute w-32 h-32 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>
                  <img src={flavor.img} alt={flavor.name} className="relative w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] z-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{flavor.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{flavor.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: IMMERSIVE BRAND PHILOSOPHY */}
      <section className="relative py-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-transparent to-[#020205]"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] border border-white/5 shadow-[0_0_100px_rgba(236,72,153,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"></div>
              <img src="/images/lifestyle_1.png" alt="Artisanal Quality" className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-0 opacity-80"></div>
              
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="glass px-6 py-4 rounded-2xl backdrop-blur-xl border border-white/10 bg-black/40">
                  <p className="text-white font-semibold text-lg">&quot;The definition of decadence.&quot;</p>
                  <p className="text-pink-400 text-sm mt-1 uppercase tracking-widest">— Michelin Guide</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-10"
          >
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-sm uppercase mb-6">
                <ShieldCheck className="w-5 h-5" /> Masterclass Craftsmanship
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                Perfection is <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Our Baseline.</span>
              </h2>
            </div>
            
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              We&apos;ve discarded traditional churning methods in favor of sub-zero cryogenic infusion. By sourcing globally and producing microscopic batches, we ensure every molecular bite delivers euphoric intensity. 
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="group border border-white/10 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
                  <Leaf className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">Pristine Source</h4>
                <p className="text-sm text-gray-400">Untouched, ethically harvested botanicals.</p>
              </div>
              <div className="group border border-white/10 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">Avant-Garde</h4>
                <p className="text-sm text-gray-400">Pushing the boundaries of culinary science.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: THE INVITATION */}
      <section className="relative py-20 flex flex-col items-center text-center px-6 overflow-hidden min-h-[60vh] justify-center">
        {/* Abstract shapes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[800px] h-[800px] bg-gradient-to-r from-pink-600/20 via-purple-600/10 to-cyan-600/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-full relative z-10"
        >
          <div className="relative border border-white/10 rounded-[3rem] p-12 md:p-24 bg-[#05050A]/80 backdrop-blur-2xl shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Hover spotlight effect */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 blur-[80px] rounded-full group-hover:bg-pink-500/40 transition-colors duration-700"></div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">Enter The Vault</h2>
            <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
              Our full menu remains hidden from the public eye. Authenticate your identity to order the universe&apos;s most coveted ice cream.
            </p>
            
            <Link href="/auth" className="relative inline-flex items-center justify-center px-16 py-6 font-black tracking-widest text-white rounded-full bg-white text-black hover:bg-pink-500 hover:text-white transition-all duration-500 hover:scale-105 active:scale-95 text-lg uppercase shadow-[0_0_0_rgba(236,72,153,0)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)]">
              Authenticate
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="relative border-t border-white/10 bg-[#020205] py-16 text-center z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-black tracking-tighter text-white">
                IceCream<span className="text-pink-500">Hub</span>
            </div>
            <p className="text-sm text-gray-600 tracking-widest uppercase border-transparent">
                &copy; {new Date().getFullYear()} The Premium Standard. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-gray-600">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
                <span className="hover:text-white cursor-pointer transition-colors">Manifesto</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
