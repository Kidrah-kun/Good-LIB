import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutRequest, logoutSuccess } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Menu, X, BookOpen, ChevronDown } from "lucide-react";

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

    // Close mobile menu on route change
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
            className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isActive(to)
                    ? "text-white bg-neutral-800"
                    : "text-neutral-400 hover:text-white"
            }`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <BookOpen className="h-5 w-5 text-teal-500" />
                        <span className="text-base font-semibold text-white tracking-tight">GoodLIB</span>
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
                    <div className="hidden md:flex items-center gap-2">
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-xs font-medium text-white">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="font-medium">{user?.name}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-52 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-1 z-50">
                                        <div className="px-3 py-2 border-b border-neutral-800">
                                            <p className="text-xs text-neutral-500">{user?.email}</p>
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                Role: <span className="text-teal-400">{user?.role}</span>
                                            </p>
                                        </div>
                                        <Link
                                            to="/password/change"
                                            className="block px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                                        >
                                            Change Password
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-neutral-400 hover:text-white px-3 py-2 transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="md:hidden text-neutral-400 hover:text-white p-1"
                    >
                        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileOpen && (
                <div className="md:hidden border-t border-neutral-800 bg-[#0a0a0a]">
                    <div className="px-4 py-3 space-y-1">
                        <Link to="/catalog" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                            Catalog
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                    Dashboard
                                </Link>
                                <Link to="/my-books" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                    My Books
                                </Link>
                                {user?.role === "Admin" && (
                                    <>
                                        <Link to="/admin/books" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                            Manage Books
                                        </Link>
                                        <Link to="/admin/users" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                            Manage Users
                                        </Link>
                                        <Link to="/admin/borrows" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                            Manage Borrows
                                        </Link>
                                    </>
                                )}
                                <Link to="/password/change" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                    Change Password
                                </Link>
                                <div className="border-t border-neutral-800 pt-1 mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 rounded-md hover:bg-neutral-800"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-neutral-800">
                                    Log In
                                </Link>
                                <Link to="/register" className="block px-3 py-2 text-sm text-teal-400 hover:text-teal-300 rounded-md hover:bg-neutral-800">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
