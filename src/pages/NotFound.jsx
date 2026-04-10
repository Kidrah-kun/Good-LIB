import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
            <div className="text-center relative z-10 p-12 rounded-2xl bg-[#0a0a0a]/60 backdrop-blur-md border border-white/[0.05] shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-teal-600/10 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-8 w-8 text-teal-400" />
                </div>
                <h1 className="text-7xl font-bold text-white mb-2">404</h1>
                <p className="text-lg text-neutral-500 mb-1">Page not found</p>
                <p className="text-sm text-neutral-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
