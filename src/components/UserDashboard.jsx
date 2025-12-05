import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { BookOpen, Clock, CheckCircle, AlertCircle, Lock, Trash2 } from "lucide-react";
import { logout } from "../store/actions/authActions";

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    returned: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get("/borrow/my-borrowed-books");
      const borrowedBooks = data.borrowedBooks;

      // Filter for currently borrowed (not returned)
      const currentlyBorrowed = borrowedBooks.filter(b => !b.returned).length;
      // Filter for returned books
      const returned = borrowedBooks.filter(b => b.returned).length;
      // Filter for overdue (not returned and past due date)
      const overdue = borrowedBooks.filter(
        b => !b.returned && new Date(b.dueDate) < new Date()
      ).length;

      setStats({
        totalBorrowed: borrowedBooks.length,
        currentlyBorrowed,
        returned,
        overdue,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }

    try {
      await axiosInstance.delete("/user/delete-account");
      dispatch(logout());
      navigate("/");
      window.location.reload(); // Force reload to clear all state
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  const statCards = [
    {
      title: "Total Borrowed",
      value: stats.totalBorrowed,
      icon: BookOpen,
      color: "bg-indigo-500/20 text-indigo-400",
    },
    {
      title: "Currently Borrowed",
      value: stats.currentlyBorrowed,
      icon: Clock,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      title: "Returned",
      value: stats.returned,
      icon: CheckCircle,
      color: "bg-green-500/20 text-green-400",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "bg-red-500/20 text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400">Here's your reading overview</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="glass-panel p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full btn-primary text-left flex items-center justify-between"
                >
                  <span>Browse Catalog</span>
                  <BookOpen className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate("/my-books")}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>My Borrowed Books</span>
                  <Clock className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate("/password/change")}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>Change Password</span>
                  <Lock className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-left flex items-center justify-between border border-red-600/30"
                >
                  <span>Delete Account</span>
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-white mb-4">Account Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Role</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user?.role === "Admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                    }`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Your Account</h2>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm font-semibold mb-2">⚠️ Warning: This action cannot be undone!</p>
                <ul className="text-red-300 text-sm space-y-1 list-disc list-inside">
                  <li>All your data will be permanently deleted</li>
                  <li>You must return all borrowed books first</li>
                  <li>You cannot recover your account after deletion</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type <span className="font-bold text-white">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Type DELETE"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE"}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${deleteConfirmText === "DELETE"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Delete My Account
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
