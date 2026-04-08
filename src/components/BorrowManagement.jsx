import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Clock, TrendingUp, User, BookOpen, Calendar, AlertCircle, Search, Download } from "lucide-react";

const BorrowManagement = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("active");
    const [searchTerm, setSearchTerm] = useState("");
    const [returningId, setReturningId] = useState(null);

    useEffect(() => { fetchBorrows(); }, []);

    const fetchBorrows = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/borrow/borrowed-books-by-users");
            setBorrows(data.borrows || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch borrows");
        } finally { setLoading(false); }
    };

    const handleReturn = async (borrowId) => {
        setReturningId(borrowId);
        try {
            const { data } = await axiosInstance.put(`/borrow/return-borrowed-book/${borrowId}`);
            toast.success(data.message || "Book returned!");
            fetchBorrows();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to return book");
        } finally {
            setReturningId(null);
        }
    };

    const activeBorrows = borrows.filter(b => !b.returned);
    const returnedBorrows = borrows.filter(b => b.returned);
    const isOverdue = (dueDate, returned) => !returned && new Date() > new Date(dueDate);
    const getDaysOverdue = (dueDate) => {
        const diff = Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const displayBorrows = activeTab === "active"
        ? activeBorrows
        : activeTab === "returned"
        ? returnedBorrows
        : borrows;

    const filteredBorrows = displayBorrows.filter(b => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            b.userName?.toLowerCase().includes(term) ||
            b.userEmail?.toLowerCase().includes(term) ||
            b.bookTitle?.toLowerCase().includes(term)
        );
    });

    const totalFines = borrows.reduce((sum, b) => sum + (b.fine || 0), 0);

    const stats = [
        { title: "Active", value: activeBorrows.length, icon: Clock, color: "bg-blue-600/10 text-blue-400" },
        { title: "Returned", value: returnedBorrows.length, icon: BookOpen, color: "bg-emerald-600/10 text-emerald-400" },
        { title: "Overdue", value: activeBorrows.filter(b => isOverdue(b.dueDate, b.returned)).length, icon: AlertCircle, color: "bg-red-600/10 text-red-400" },
        { title: "Total Fines", value: `$${totalFines.toFixed(2)}`, icon: TrendingUp, color: "bg-amber-600/10 text-amber-400" },
    ];

    const exportCSV = () => {
        const headers = "User,Email,Book,Borrowed,Due,Status,Fine\n";
        const rows = borrows.map(b => 
            `"${b.userName}","${b.userEmail}","${b.bookTitle}","${new Date(b.borrowedDate).toLocaleDateString()}","${new Date(b.dueDate).toLocaleDateString()}","${b.returned ? 'Returned' : 'Active'}","$${b.fine || 0}"`
        ).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `borrows-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-white mb-0.5">Borrows</h1>
                    <p className="text-xs text-neutral-500">Monitor and manage all book borrows.</p>
                </div>
                <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="card p-4">
                            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
                            <p className="text-xs text-neutral-500 font-medium">{s.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
                <input
                    type="text"
                    placeholder="Search by user, email, or book title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 !py-2.5 text-sm"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-neutral-800">
                {[
                    { key: "active", label: "Active", count: activeBorrows.length },
                    { key: "returned", label: "Returned", count: returnedBorrows.length },
                    { key: "all", label: "All", count: borrows.length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                            activeTab === tab.key
                                ? "text-teal-400 border-teal-400"
                                : "text-neutral-500 border-transparent hover:text-white"
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredBorrows.length === 0 ? (
                <div className="card p-12 text-center">
                    <BookOpen className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400">
                        {searchTerm ? "No borrows match your search" : activeTab === "active" ? "No active borrows" : "No borrows found"}
                    </p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Book</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Borrowed</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Due</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Fine</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filteredBorrows.map((borrow) => {
                                    const overdue = isOverdue(borrow.dueDate, borrow.returned);
                                    const daysOver = getDaysOverdue(borrow.dueDate);
                                    return (
                                        <tr key={borrow._id} className="hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="text-sm font-medium text-white">{borrow.userName || "User"}</div>
                                                    <div className="text-[10px] text-neutral-600">{borrow.userEmail || ""}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-white max-w-[160px] truncate">{borrow.bookTitle}</td>
                                            <td className="px-4 py-3 text-sm text-neutral-400">{new Date(borrow.borrowedDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-sm ${overdue ? "text-red-400 font-medium" : "text-neutral-400"}`}>
                                                    {new Date(borrow.dueDate).toLocaleDateString()}
                                                </span>
                                                {overdue && <div className="text-[10px] text-red-500">{daysOver}d overdue</div>}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {borrow.fine > 0 ? (
                                                    <span className="text-amber-400 font-medium">${borrow.fine.toFixed(2)}</span>
                                                ) : (
                                                    <span className="text-neutral-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {borrow.returned ? (
                                                    <span className="badge badge-green">Returned</span>
                                                ) : overdue ? (
                                                    <span className="badge badge-red">Overdue</span>
                                                ) : (
                                                    <span className="badge badge-blue">Active</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {!borrow.returned && (
                                                    <button
                                                        onClick={() => handleReturn(borrow._id)}
                                                        disabled={returningId === borrow._id}
                                                        className="px-3 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        {returningId === borrow._id ? (
                                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        ) : (
                                                            "Return"
                                                        )}
                                                    </button>
                                                )}
                                            </td>
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
