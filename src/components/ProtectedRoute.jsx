import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-3 relative z-10 p-8 rounded-2xl bg-[#0a0a0a]/60 backdrop-blur-md border border-white/[0.05] shadow-2xl">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-neutral-500">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== "Admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
