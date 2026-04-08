import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Users, Clock, Shield, ArrowRight, Zap } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, loading, navigate]);

    const features = [
        {
            icon: BookOpen,
            title: "Vast Collection",
            description: "Browse and borrow from a curated collection spanning every genre.",
        },
        {
            icon: Clock,
            title: "Easy Borrowing",
            description: "Borrow and return with a single click. Track due dates effortlessly.",
        },
        {
            icon: Users,
            title: "Community",
            description: "Join a growing community of readers and book enthusiasts.",
        },
        {
            icon: Shield,
            title: "Reliable",
            description: "Secure accounts with role-based access and data protection.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-teal-500" />
                            <span className="text-base font-semibold text-white tracking-tight">GoodLIB</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm text-neutral-400 hover:text-white px-3 py-2 transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-teal-600/10 border border-teal-600/20 rounded-full px-4 py-1.5 mb-8">
                        <Zap className="h-3.5 w-3.5 text-teal-400" />
                        <span className="text-teal-300 text-xs font-medium tracking-wide">Open source library management</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                        <span className="text-white">Your books,</span>
                        <br />
                        <span className="text-neutral-400">organized.</span>
                    </h1>

                    <p className="text-lg text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        A clean, modern library system for borrowing and managing books. Built for readers and administrators alike.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/register"
                            className="group bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 text-sm"
                        >
                            Create Account
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link
                            to="/catalog"
                            className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-6 py-3 rounded-lg font-medium transition-all border border-neutral-800 text-sm"
                        >
                            Browse Catalog
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-800/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-2xl font-semibold text-white mb-3">Why GoodLIB?</h2>
                        <p className="text-neutral-500 text-sm">Everything you need, nothing you don't.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="card p-5 hover:border-neutral-700 transition-all duration-200 group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-teal-600/10 flex items-center justify-center mb-4 group-hover:bg-teal-600/15 transition-colors">
                                        <Icon className="h-4.5 w-4.5 text-teal-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white mb-1.5">{feature.title}</h3>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="card p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">10K+</div>
                            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Books</div>
                        </div>
                        <div className="md:border-x border-neutral-800">
                            <div className="text-3xl font-bold text-white mb-1">5K+</div>
                            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Readers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">50+</div>
                            <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Categories</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-white mb-3">Ready to start?</h2>
                    <p className="text-neutral-500 text-sm mb-8">
                        Join readers who've already discovered the ease of digital library management.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-sm"
                    >
                        Create Free Account
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-6 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-xs text-neutral-600">&copy; {new Date().getFullYear()} GoodLIB. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
