import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Clock, TrendingUp, User, BookOpen, Calendar, AlertCircle, Search, Download, CheckCircle } from "lucide-react";

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

    const computeAccruedFine = (borrow) => {
        if (borrow.returned) return borrow.fine || 0;
        const dueDate = new Date(borrow.dueDate);
        const today = new Date();
        if (today > dueDate) {
            const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60));
            return lateHours * 0.1; // $0.1 per hour fine rate
        }
        return 0;
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

    const totalFines = borrows.reduce((sum, b) => sum + computeAccruedFine(b), 0);

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
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Access Control</h1>
                    <p className="text-lg text-neutral-400 font-medium tracking-tight">Monitor and manage all active book borrows and return cycles.</p>
                </div>
                <button onClick={exportCSV} className="btn-secondary flex items-center gap-3">
                    <Download className="h-5 w-5" />
                    <span className="font-bold">Export Audit Log</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="card p-8 group">
                            <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mb-6 shadow-inner`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <p className="text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-sm">{s.value}</p>
                            <p className="text-sm text-neutral-400 font-bold uppercase tracking-[0.2em]">{s.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5 group-focus-within:text-teal-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by user identity, email, or digital title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-14 py-5 text-lg placeholder:text-neutral-600 shadow-teal-500/5"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/[0.05]">
                {[
                    { key: "active", label: "Active", count: activeBorrows.length },
                    { key: "returned", label: "Returned", count: returnedBorrows.length },
                    { key: "all", label: "All Records", count: borrows.length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-px relative ${
                            activeTab === tab.key
                                ? "text-teal-400 border-teal-400"
                                : "text-neutral-500 border-transparent hover:text-neutral-300"
                        }`}
                    >
                        {tab.label}
                        <span className="ml-2 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{tab.count}</span>
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
                                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Borrower</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Book Title</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Date Out</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Deadline</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Awaiting Fine</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em] w-32">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filteredBorrows.map((borrow) => {
                                    const overdue = isOverdue(borrow.dueDate, borrow.returned);
                                    const daysOver = getDaysOverdue(borrow.dueDate);
                                    return (
                                        <tr key={borrow._id} className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <div className="text-base font-bold text-white tracking-tight">{borrow.userName || "Unknown Member"}</div>
                                                    <div className="text-xs text-neutral-500 font-medium">{borrow.userEmail || ""}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-base text-white max-w-[200px] truncate font-bold tracking-tight">{borrow.bookTitle}</td>
                                            <td className="px-6 py-5 text-base text-neutral-400 font-medium">{new Date(borrow.borrowedDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                  <span className={`text-base font-bold ${overdue ? "text-red-400" : "text-neutral-300"}`}>
                                                      {new Date(borrow.dueDate).toLocaleDateString()}
                                                  </span>
                                                  {overdue && <div className="text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-500/10 w-fit px-1.5 py-0.5 rounded mt-1 border border-red-500/20">{daysOver} days overdue</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-base">
                                                {computeAccruedFine(borrow) > 0 ? (
                                                    <span className="text-amber-400 font-black tracking-tight">${computeAccruedFine(borrow).toFixed(2)}</span>
                                                ) : (
                                                    <span className="text-neutral-700 font-bold">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {borrow.returned ? (
                                                    <span className="badge badge-green">Returned</span>
                                                ) : overdue ? (
                                                    <span className="badge badge-red">Overdue</span>
                                                ) : (
                                                    <span className="badge badge-blue">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {!borrow.returned && (
                                                    <button
                                                        onClick={() => handleReturn(borrow._id)}
                                                        disabled={returningId === borrow._id}
                                                        className="px-5 py-2.5 text-xs font-black bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest shadow-[0_0_15px_rgba(13,148,136,0.2)]"
                                                    >
                                                        {returningId === borrow._id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                              <CheckCircle className="h-3.5 w-3.5" />
                                                              Return
                                                            </>
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
