import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { BookOpen, Users, Clock, TrendingUp, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, activeBorrows: 0, totalBorrows: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") { navigate("/"); return; }
    fetchStats();
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const booksRes = await axiosInstance.get("/book/all?page=1&limit=1");
      const usersRes = await axiosInstance.get("/user/all");
      const borrowsRes = await axiosInstance.get("/borrow/borrowed-books-by-users");
      const activeBorrows = borrowsRes.data.borrows?.filter(b => !b.returned).length || 0;
      setStats({
        totalBooks: booksRes.data.pagination?.total || 0,
        totalUsers: usersRes.data.users?.length || 0,
        activeBorrows,
        totalBorrows: borrowsRes.data.borrows?.length || 0,
      });
    } catch (err) {
      try {
        const booksRes = await axiosInstance.get("/book/all?page=1&limit=1");
        const usersRes = await axiosInstance.get("/user/all");
        setStats({ totalBooks: booksRes.data.pagination?.total || 0, totalUsers: usersRes.data.users?.length || 0, activeBorrows: 0, totalBorrows: 0 });
      } catch { /* silent fallback */ }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Books", value: stats.totalBooks, icon: BookOpen, color: "bg-teal-600/10 text-teal-400", path: "/admin/books" },
    { title: "Users", value: stats.totalUsers, icon: Users, color: "bg-violet-600/10 text-violet-400", path: "/admin/users" },
    { title: "Active", value: stats.activeBorrows, icon: Clock, color: "bg-blue-600/10 text-blue-400", path: "/admin/borrows" },
    { title: "Total Borrows", value: stats.totalBorrows, icon: TrendingUp, color: "bg-amber-600/10 text-amber-400", path: "/admin/borrows" },
  ];

  const quickActions = [
    { title: "Manage Books", desc: "Add, edit, or remove books", icon: BookOpen, path: "/admin/books", accent: "text-teal-400" },
    { title: "Manage Users", desc: "View users and manage roles", icon: Users, path: "/admin/users", accent: "text-violet-400" },
    { title: "View Borrows", desc: "Track active borrows", icon: Clock, path: "/admin/borrows", accent: "text-blue-400" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-lg text-neutral-400 font-medium tracking-tight">System overview and library health metrics.</p>
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
                <button
                  key={i}
                  onClick={() => navigate(stat.path)}
                  className="card-hover p-6 text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4 shadow-inner`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em]">{stat.title}</p>
                </button>
              );
            })}
          </div>

          <div>
            <h2 className="text-xs font-black text-teal-400 mb-6 uppercase tracking-[0.3em]">Quick Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="card-hover p-8 text-left group flex items-start gap-4"
                  >
                    <Icon className={`h-7 w-7 ${action.accent} mt-0.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{action.title}</h3>
                      <p className="text-sm text-neutral-500 font-medium leading-relaxed">{action.desc}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-neutral-700 group-hover:text-teal-400 transition-all group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
