import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutRequest, logoutSuccess } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Menu, X, BookOpen, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
        setIsDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        dispatch(logoutRequest());
        try {
            await axiosInstance.get("/auth/logout");
            dispatch(logoutSuccess());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navLink = (to, label) => (
        <Link
            to={to}
            className={cn(
                "relative px-6 py-2.5 text-base font-semibold transition-all rounded-full group",
                isActive(to) ? "text-white" : "text-neutral-400 hover:text-white"
            )}
        >
            {isActive(to) && (
                <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            {label}
        </Link>
    );

    return (
        <motion.nav 
            initial={{ y: -70, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="fixed top-5 left-1/2 w-[90%] max-w-5xl z-50 rounded-xl bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
        >
            <div className="px-5 h-12 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3.5 group shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30 group-hover:bg-teal-500/30 transition-colors shadow-[0_0_20px_rgba(13,148,136,0.2)] group-hover:shadow-[0_0_30px_rgba(13,148,136,0.4)]">
                        <BookOpen className="h-5 w-5 text-teal-400" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter hidden sm:block">GoodLIB</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLink("/catalog", "Catalog")}
                    {isAuthenticated && (
                        <>
                            {navLink("/dashboard", "Dashboard")}
                            {navLink("/my-books", "My Books")}
                            {user?.role === "Admin" && (
                                <>
                                    {navLink("/admin/books", "Books")}
                                    {navLink("/admin/users", "Users")}
                                    {navLink("/admin/borrows", "Borrows")}
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 text-base text-neutral-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                            >
                                {user?.avatar?.url ? (
                                    <img src={user.avatar.url} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(13,148,136,0.5)] border border-teal-300/30">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                <span className="font-semibold pr-1">{user?.name}</span>
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-3 w-60 bg-[#111111]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
                                            <p className="text-xs text-neutral-400">Signed in as</p>
                                            <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                                            <div className="mt-2 inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal-400 ring-1 ring-inset ring-teal-500/20 uppercase tracking-widest">
                                                {user?.role}
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <Link to="/password/change" className="block px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors font-medium">
                                                Change Password
                                            </Link>
                                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-medium">
                                                Log Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-neutral-400 hover:text-white px-4 transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" className="relative group overflow-hidden rounded-full p-[1px]">
                                <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-teal-300 to-teal-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundSize: '200% 200%', animation: 'gradient 3s linear infinite' }} />
                                <div className="relative bg-[#0a0a0a] rounded-full px-5 py-1.5 text-sm font-semibold text-white transition-colors group-hover:bg-opacity-80 backdrop-blur-sm">
                                    Sign Up
                                </div>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="md:hidden text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 mr-1"
                >
                    {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/[0.08] overflow-hidden rounded-b-[2rem]"
                    >
                        <div className="px-4 py-4 space-y-1.5 bg-[#0a0a0a]/90 backdrop-blur-md">
                            <Link to="/catalog" className="block px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Catalog</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="block px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Dashboard</Link>
                                    <Link to="/my-books" className="block px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">My Books</Link>
                                    {user?.role === "Admin" && (
                                        <>
                                            <div className="px-4 pt-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Admin</div>
                                            <Link to="/admin/books" className="block px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Manage Books</Link>
                                            <Link to="/admin/users" className="block px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Manage Users</Link>
                                            <Link to="/admin/borrows" className="block px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Manage Borrows</Link>
                                        </>
                                    )}
                                    <div className="border-t border-white/[0.05] mt-2 pt-2">
                                        <Link to="/password/change" className="block px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Change Password</Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                                            Log Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors">Log In</Link>
                                    <Link to="/register" className="block px-4 py-2.5 text-sm font-bold text-teal-400 hover:bg-teal-500/10 rounded-xl transition-colors">Sign Up for free</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
