import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyBorrowedBooksRequest, getMyBorrowedBooksSuccess, getMyBorrowedBooksFailure,
  returnBookRequest, returnBookSuccess, returnBookFailure,
} from "../store/slices/borrowSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Calendar, BookOpen, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { borrowedBooks, loading } = useSelector((state) => state.borrow);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("active");
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    fetchBorrowedBooks();
  }, [isAuthenticated]);

  const fetchBorrowedBooks = async () => {
    dispatch(getMyBorrowedBooksRequest());
    try {
      const { data } = await axiosInstance.get("/borrow/my-borrowed-books");
      dispatch(getMyBorrowedBooksSuccess(data.borrowedBooks));
    } catch (err) {
      dispatch(getMyBorrowedBooksFailure(err.response?.data?.message || "Failed to fetch"));
      toast.error("Failed to load borrowed books");
    }
  };

  const handleReturn = async (borrowId) => {
    setReturningId(borrowId);
    dispatch(returnBookRequest());
    try {
      const { data } = await axiosInstance.put(`/borrow/return-book/${borrowId}`);
      dispatch(returnBookSuccess(data.message));
      toast.success(data.message || "Book returned!");
      fetchBorrowedBooks();
    } catch (err) {
      dispatch(returnBookFailure(err.response?.data?.message || "Return failed"));
      toast.error(err.response?.data?.message || "Failed to return");
    } finally {
      setReturningId(null);
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();
  const fmt = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const activeBooks = borrowedBooks.filter(b => !b.returned);
  const returnedBooks = borrowedBooks.filter(b => b.returned);
  const displayBooks = activeTab === "active" ? activeBooks : returnedBooks;

  const totalFines = borrowedBooks.reduce((sum, b) => sum + (b.fine || 0), 0);
  const overdueCount = activeBooks.filter(b => isOverdue(b.dueDate)).length;

  const stats = [
    { title: "Currently Borrowed", value: activeBooks.length, icon: Clock, color: "bg-blue-600/10 text-blue-400" },
    { title: "Returned", value: returnedBooks.length, icon: CheckCircle, color: "bg-emerald-600/10 text-emerald-400" },
    { title: "Overdue", value: overdueCount, icon: AlertCircle, color: "bg-red-600/10 text-red-400" },
    { title: "Total Fines", value: `$${totalFines.toFixed(2)}`, icon: Calendar, color: "bg-amber-600/10 text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-0.5">My Books</h1>
        <p className="text-xs text-neutral-500">{borrowedBooks.length} total borrow{borrowedBooks.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Stats */}
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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${activeTab === "active" ? "text-teal-400 border-teal-400" : "text-neutral-500 border-transparent hover:text-white"}`}
        >
          Active ({activeBooks.length})
        </button>
        <button
          onClick={() => setActiveTab("returned")}
          className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${activeTab === "returned" ? "text-teal-400 border-teal-400" : "text-neutral-500 border-transparent hover:text-white"}`}
        >
          Returned ({returnedBooks.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-sm text-neutral-400 mb-3">
            {activeTab === "active" ? "No active borrows" : "No returned books yet"}
          </p>
          {activeTab === "active" && (
            <button onClick={() => navigate("/catalog")} className="btn-primary text-sm">
              Browse Catalog
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayBooks.map((borrow) => (
            <div
              key={borrow._id}
              className={`card p-4 transition-all ${isOverdue(borrow.dueDate) && !borrow.returned ? "!border-red-600/30" : ""}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white mb-2">{borrow.bookTitle || "Book"}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />Borrowed: {fmt(borrow.borrowedDate)}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${isOverdue(borrow.dueDate) && !borrow.returned ? "text-red-400" : "text-neutral-500"}`}>
                      <Calendar className="h-3 w-3" />Due: {fmt(borrow.dueDate)}
                    </span>
                    {borrow.returnedDate && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />Returned: {fmt(borrow.returnedDate)}
                      </span>
                    )}
                    {borrow.fine > 0 && (
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        Fine: ${borrow.fine.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {borrow.returned ? (
                    <span className="badge badge-green">Returned</span>
                  ) : isOverdue(borrow.dueDate) ? (
                    <>
                      <span className="badge badge-red">Overdue</span>
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        disabled={returningId === borrow._id}
                        className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1"
                      >
                        {returningId === borrow._id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : "Return"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      disabled={returningId === borrow._id}
                      className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1"
                    >
                      {returningId === borrow._id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : "Return"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrowedBooks;
