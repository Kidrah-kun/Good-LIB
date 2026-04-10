import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-transparent text-white">
            <Navbar />
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
