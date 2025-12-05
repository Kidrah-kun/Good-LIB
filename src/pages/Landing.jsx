import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Users, Clock, Shield, Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        // Only redirect if not loading and user is authenticated
        if (!loading && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, loading, navigate]);
    const features = [
        {
            icon: BookOpen,
            title: "Vast Collection",
            description: "Access thousands of books across all genres and categories",
            color: "from-indigo-500 to-purple-500",
        },
        {
            icon: Clock,
            title: "Easy Borrowing",
            description: "Borrow and return books with just a few clicks",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Join a community of passionate readers and book lovers",
            color: "from-pink-500 to-rose-500",
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Your data is safe with our advanced security measures",
            color: "from-rose-500 to-orange-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-8 w-8 text-indigo-500" />
                            <span className="text-xl font-bold text-white tracking-wide">GoodLIB</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span className="text-indigo-300 text-sm font-medium">Welcome to the Future of Reading</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Your Digital Library
                            </span>
                            <br />
                            <span className="text-white">Awaits</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                            Discover, borrow, and enjoy thousands of books at your fingertips. Join our community of readers and embark on endless literary adventures.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center space-x-2"
                            >
                                <span>Start Reading Now</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/catalog"
                                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all border border-slate-700"
                            >
                                Browse Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose GoodLIB?</h2>
                        <p className="text-gray-400 text-lg">Everything you need for a seamless reading experience</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="glass-panel p-6 hover:border-indigo-500/50 transition-all duration-300 group"
                                >
                                    <div className={`w - 12 h - 12 rounded - lg bg - gradient - to - r ${feature.color} p - 3 mb - 4 group - hover: scale - 110 transition - transform`}>
                                        <Icon className="h-full w-full text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                10,000+
                            </div>
                            <div className="text-gray-400 text-lg">Books Available</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                5,000+
                            </div>
                            <div className="text-gray-400 text-lg">Active Readers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                                50+
                            </div>
                            <div className="text-gray-400 text-lg">Categories</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass-panel p-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Join thousands of readers who have already discovered the joy of digital reading
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/50"
                        >
                            <span>Create Free Account</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    <p>&copy; 2024 GoodLIB. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
