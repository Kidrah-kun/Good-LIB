import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutRequest, logoutSuccess } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Menu, X, Book, User, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Book className="h-8 w-8 text-indigo-500" />
                            <span className="text-xl font-bold text-white tracking-wide">GoodLIB</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/catalog" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Catalog
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                    <Link to="/my-books" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        My Books
                                    </Link>
                                    {user?.role === "Admin" && (
                                        <Link to="/admin/books" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Manage Books
                                        </Link>
                                    )}

                                    {/* User Menu Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <User className="h-5 w-5" />
                                            <span>{user?.name}</span>
                                        </button>

                                        {isMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-lg py-1 z-50">
                                                {user?.role === "Admin" && (
                                                    <>
                                                        <Link
                                                            to="/admin/books"
                                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            Manage Books
                                                        </Link>
                                                        <Link
                                                            to="/admin/users"
                                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            Manage Users
                                                        </Link>
                                                    </>
                                                )}
                                                <Link
                                                    to="/password/change"
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Change Password
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-800 border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/catalog"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Catalog
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/my-books"
                                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Books
                                </Link>
                                <Link
                                    to="/password/change"
                                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Change Password
                                </Link>
                                {user?.role === "Admin" && (
                                    <Link
                                        to="/admin/books"
                                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Manage Books
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
