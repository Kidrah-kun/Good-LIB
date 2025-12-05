import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Clock, TrendingUp, User, BookOpen, Calendar, AlertCircle } from "lucide-react";

const BorrowManagement = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("active"); // "active" or "all"

    useEffect(() => {
        fetchBorrows();
    }, []);

    const fetchBorrows = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/borrow/borrowed-books-by-users");
            setBorrows(data.borrows || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch borrows");
            console.error("Fetch borrows error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (borrowId) => {
        if (!window.confirm("Mark this book as returned?")) return;

        try {
            await axiosInstance.put(`/borrow/return-borrowed-book/${borrowId}`);
            toast.success("Book marked as returned!");
            fetchBorrows();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to return book");
        }
    };

    const activeBorrows = borrows.filter(b => !b.returned);
    const allBorrows = borrows;

    const isOverdue = (dueDate, returned) => {
        if (returned) return false;
        return new Date() > new Date(dueDate);
    };

    const getDaysOverdue = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const displayBorrows = activeTab === "active" ? activeBorrows : allBorrows;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Borrow Management</h1>
                <p className="text-gray-400">Monitor and manage all book borrows</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Active Borrows</h3>
                    <p className="text-3xl font-bold text-white">{activeBorrows.length}</p>
                </div>

                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Borrows</h3>
                    <p className="text-3xl font-bold text-white">{allBorrows.length}</p>
                </div>

                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Overdue Books</h3>
                    <p className="text-3xl font-bold text-white">
                        {activeBorrows.filter(b => isOverdue(b.dueDate, b.returned)).length}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab("active")}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "active"
                            ? "text-indigo-400 border-b-2 border-indigo-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Active Borrows ({activeBorrows.length})
                </button>
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "all"
                            ? "text-indigo-400 border-b-2 border-indigo-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    All Borrows ({allBorrows.length})
                </button>
            </div>

            {/* Borrows Table */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : displayBorrows.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                        {activeTab === "active" ? "No active borrows" : "No borrows found"}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        {activeTab === "active"
                            ? "All books have been returned"
                            : "No books have been borrowed yet"}
                    </p>
                </div>
            ) : (
                <div className="glass-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Book
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Borrowed Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    {activeTab === "active" && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {displayBorrows.map((borrow) => {
                                    const overdue = isOverdue(borrow.dueDate, borrow.returned);
                                    const daysOverdue = getDaysOverdue(borrow.dueDate);

                                    return (
                                        <tr key={borrow._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User className="h-5 w-5 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {borrow.userName || "Unknown User"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {borrow.userEmail || ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-sm text-white">{borrow.bookTitle}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {new Date(borrow.borrowedDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className={overdue ? "text-red-400 font-semibold" : "text-gray-400"}>
                                                        {new Date(borrow.dueDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {overdue && (
                                                    <div className="text-xs text-red-400 mt-1">
                                                        {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {borrow.returned ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400">
                                                        Returned
                                                    </span>
                                                ) : overdue ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400">
                                                        Overdue
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-400">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            {activeTab === "active" && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {!borrow.returned && (
                                                        <button
                                                            onClick={() => handleReturn(borrow._id)}
                                                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                        >
                                                            Mark Returned
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowManagement;
