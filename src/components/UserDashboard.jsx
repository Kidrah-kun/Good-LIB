import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { BookOpen, Clock, CheckCircle, AlertCircle, Lock, Trash2, ArrowRight } from "lucide-react";
import { logout } from "../store/actions/authActions";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBorrowed: 0, currentlyBorrowed: 0, returned: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get("/borrow/my-borrowed-books");
      const bb = data.borrowedBooks;
      setStats({
        totalBorrowed: bb.length,
        currentlyBorrowed: bb.filter(b => !b.returned).length,
        returned: bb.filter(b => b.returned).length,
        overdue: bb.filter(b => !b.returned && new Date(b.dueDate) < new Date()).length,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    try {
      await axiosInstance.delete("/user/delete-account");
      dispatch(logout());
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  const statCards = [
    { title: "Total Borrowed", value: stats.totalBorrowed, icon: BookOpen, color: "bg-teal-600/10 text-teal-400" },
    { title: "Currently Borrowed", value: stats.currentlyBorrowed, icon: Clock, color: "bg-blue-600/10 text-blue-400" },
    { title: "Returned", value: stats.returned, icon: CheckCircle, color: "bg-emerald-600/10 text-emerald-400" },
    { title: "Overdue", value: stats.overdue, icon: AlertCircle, color: "bg-red-600/10 text-red-400" },
  ];

  const quickActions = [
    { label: "Browse Catalog", icon: BookOpen, path: "/catalog", accent: "text-teal-400" },
    { label: "My Borrowed Books", icon: Clock, path: "/my-books", accent: "text-blue-400" },
    { label: "Change Password", icon: Lock, path: "/password/change", accent: "text-amber-400" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-teal-400">
          Welcome back, {user?.name}
        </h1>
        <p className="text-lg text-neutral-400 font-medium tracking-tight">Access your library stats and active borrows below.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="card p-6 group">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4 shadow-inner`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em]">{stat.title}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="card p-10">
              <h2 className="text-xs font-black text-teal-400 mb-8 uppercase tracking-[0.3em]">Services</h2>
              <div className="space-y-3">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => navigate(action.path)}
                      className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-white/[0.04] transition-all group text-left border border-transparent hover:border-white/[0.05]"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center ${action.accent} border border-white/[0.05]`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-base text-neutral-200 font-bold flex-1">{action.label}</span>
                      <ArrowRight className="h-4 w-4 text-neutral-700 group-hover:text-teal-400 transition-all group-hover:translate-x-1" />
                    </button>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-white/[0.05]">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-red-500/10 transition-all group text-left border border-transparent hover:border-red-500/20"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <span className="text-base text-red-400 font-bold">Delete Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card p-10">
              <h2 className="text-xs font-black text-neutral-500 mb-8 uppercase tracking-[0.3em]">Access Profile</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-5 border-b border-white/[0.05]">
                  <span className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-1">Legal Name</span>
                  <span className="text-lg text-white font-black tracking-tight">{user?.name}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b border-white/[0.05]">
                  <span className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-1">Email Address</span>
                  <span className="text-lg text-white font-bold truncate tracking-tight">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-5">
                  <span className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-1">Membership Rank</span>
                  <span className={`badge ${user?.role === "Admin" ? "badge-purple" : "badge-blue"}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-white mb-3">Delete Account</h2>
            <div className="bg-red-600/5 border border-red-600/15 rounded-lg p-3 mb-4">
              <p className="text-xs text-red-400 font-medium mb-1.5">⚠ This action cannot be undone</p>
              <ul className="text-xs text-red-300/70 space-y-0.5 list-disc list-inside">
                <li>All data will be permanently deleted</li>
                <li>Return all borrowed books first</li>
              </ul>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-neutral-400 mb-1.5">
                Type <span className="font-semibold text-white">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="input-field text-sm"
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  deleteConfirmText === "DELETE"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
