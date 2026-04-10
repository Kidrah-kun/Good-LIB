import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Users, Clock, Shield, ArrowRight, Zap, Star, LayoutGrid, Layers, Globe, Menu, X } from "lucide-react";
import LiquidEther from "../components/LiquidEther";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const Landing = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, loading, navigate]);

    const features = [
        {
            title: "Vast Collection",
            description: "Browse and borrow from a curated collection spanning every genre known to humanity.",
            icon: BookOpen,
            colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
            rowSpan: "row-span-1",
            bg: "bg-teal-900/10"
        },
        {
            title: "Lightning Fast",
            description: "Built on modern edge infrastructure for millisecond response times.",
            icon: Zap,
            colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
            rowSpan: "row-span-1",
            bg: "bg-blue-900/10"
        },
        {
            title: "Global Community",
            description: "Join millions of passionate readers sharing reviews and curated lists.",
            icon: Globe,
            colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
            rowSpan: "row-span-2",
            bg: "bg-indigo-900/10"
        },
        {
            title: "Secure Access",
            description: "Enterprise-grade encryption protecting your personal data and read history.",
            icon: Shield,
            colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
            rowSpan: "row-span-1",
            bg: "bg-purple-900/10"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-[#000000] relative text-white overflow-x-hidden">
            {/* Full-page fixed internal background */}
            <div className="fixed inset-0 z-0 touch-none">
                <LiquidEther
                    colors={['#0d9488', '#0f766e', '#115e59']}
                    mouseForce={25}
                    cursorSize={120}
                    isViscous
                    viscous={30}
                    iterationsViscous={4}
                    iterationsPoisson={4}
                    resolution={0.25}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.3}
                    autoIntensity={1.8}
                    takeoverDuration={0.25}
                    autoResumeDelay={2000}
                    autoRampDuration={0.6}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at top, transparent 0%, #000000 100%), linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 80%, #000000 100%)`
                    }}
                />
            </div>

            {/* Navbar */}
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-4 inset-x-0 mx-auto w-[92%] sm:w-[95%] max-w-5xl bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/[0.08] rounded-2xl md:rounded-full z-[100] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
                <div className="px-3 sm:px-5 h-12 sm:h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer pl-1 min-w-0 flex-shrink">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30 group-hover:bg-teal-500/40 transition-all shadow-[0_0_15px_rgba(13,148,136,0.3)] flex-shrink-0">
                            <BookOpen className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-base font-bold tracking-tighter text-white truncate">GoodLIB</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/login" className="text-sm font-semibold text-neutral-400 hover:text-white px-4 py-2 transition-colors">
                            Log In
                        </Link>
                        <Link to="/register" className="relative group overflow-hidden rounded-full p-[1px]">
                            <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundSize: '200% 200%', animation: 'gradient 3s linear infinite' }} />
                            <div className="relative bg-[#0a0a0a] rounded-full px-5 py-1.5 text-sm font-semibold text-white transition-colors group-hover:bg-transparent backdrop-blur-sm">
                                Get Started
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/[0.05] overflow-hidden bg-[#0a0a0a]/90 rounded-b-2xl"
                        >
                            <div className="flex flex-col p-4 gap-3">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                    Log In
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-teal-400 bg-teal-500/10 rounded-xl border border-teal-500/20 active:scale-95 transition-all text-center">
                                    Get Started Free
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Content Layer */}
            <div className="relative z-10 pt-40 pb-20">
                {/* Hero section */}
                <div className="px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-5xl mx-auto text-center"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(13,148,136,0.15)]">
                            <SparklesIcon className="h-3.5 w-3.5 text-teal-400" />
                            <span className="text-teal-300 text-xs font-bold tracking-widest uppercase">The future of reading is here</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] perspective-1000 px-4 sm:px-0">
                            <span className="text-white drop-shadow-sm">Redefining the</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-teal-500 via-teal-400 to-emerald-300">
                                modern library.
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-sm md:text-lg text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed px-6">
                            A breathtakingly fast, beautiful platform to manage your books, track your reading, and discover new worlds.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="group relative w-full sm:w-auto overflow-hidden rounded-full p-[1px]"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full opacity-100" />
                                <div className="relative flex items-center justify-center gap-2 px-8 py-4 bg-transparent rounded-full text-white font-bold text-base shadow-[0_0_30px_rgba(13,148,136,0.4)] group-hover:shadow-[0_0_50px_rgba(13,148,136,0.6)] transition-all">
                                    Start Exploring Now
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            <Link
                                to="/catalog"
                                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all border border-white/10 backdrop-blur-xl group"
                            >
                                <LayoutGrid className="h-4 w-4 text-neutral-300 group-hover:text-white transition-colors" />
                                Browse Catalog
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Animated Bento Grid Features */}
                <div className="py-48 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16 md:mb-24"
                    >
                        <h2 className="text-3xl md:text-7xl font-black text-white mb-6 tracking-tighter italic">Everything you need.</h2>
                        <p className="text-neutral-400 text-base md:text-xl font-medium tracking-tight px-4">Powerful features wrapped in an elegant, expansive interface.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 auto-rows-[340px]">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={cn(
                                    "relative overflow-hidden rounded-[2.5rem] p-8 border border-white/[0.05] group",
                                    feature.colSpan,
                                    feature.rowSpan,
                                    "bg-[#111111] hover:border-white/[0.12] transition-colors"
                                )}
                            >
                                <div className={cn("absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity", feature.bg)} />
                                <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-700 pointer-events-none">
                                    <feature.icon className="w-64 h-64 text-white" />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-end">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 group-hover:bg-teal-500/30 transition-colors shadow-inner">
                                        <feature.icon className="h-6 w-6 text-white drop-shadow-sm" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight drop-shadow-sm">{feature.title}</h3>
                                    <p className="text-neutral-400 font-medium leading-relaxed max-w-[90%]">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="py-24 px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] rounded-[3rem] p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center backdrop-blur-2xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50" />
                            
                            {[
                                { val: "10K+", label: "Books Cataloged" },
                                { val: "99.9%", label: "Uptime" },
                                { val: "2M+", label: "Pages Read" }
                            ].map((stat, i) => (
                                <div key={i} className="relative">
                                    <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-3 tracking-tighter italic">
                                        {stat.val}
                                    </div>
                                    <div className="text-sm text-teal-400 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

function SparklesIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

export default Landing;
