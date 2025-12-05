import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    totalBorrows: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/");
      return;
    }
    fetchStats();
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      // Fetch books with pagination to get total count
      const booksRes = await axiosInstance.get("/book/all?page=1&limit=1");

      // Fetch users
      const usersRes = await axiosInstance.get("/user/all");

      // Fetch borrows for all users (admin endpoint)
      const borrowsRes = await axiosInstance.get("/borrow/borrowed-books-by-users");

      const activeBorrows = borrowsRes.data.borrows?.filter(b => !b.returned).length || 0;

      setStats({
        totalBooks: booksRes.data.pagination?.total || 0,
        totalUsers: usersRes.data.users?.length || 0,
        activeBorrows,
        totalBorrows: borrowsRes.data.borrows?.length || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
      // If admin borrow endpoint fails, try to get at least books and users
      try {
        const booksRes = await axiosInstance.get("/book/all?page=1&limit=1");
        const usersRes = await axiosInstance.get("/user/all");

        setStats({
          totalBooks: booksRes.data.pagination?.total || 0,
          totalUsers: usersRes.data.users?.length || 0,
          activeBorrows: 0,
          totalBorrows: 0,
        });
      } catch (fallbackErr) {
        console.error("Fallback fetch also failed", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-indigo-500/20 text-indigo-400",
      onClick: () => navigate("/admin/books"),
      clickable: true,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-green-500/20 text-green-400",
      onClick: () => navigate("/admin/users"),
      clickable: true,
    },
    {
      title: "Active Borrows",
      value: stats.activeBorrows,
      icon: Clock,
      color: "bg-blue-500/20 text-blue-400",
      onClick: () => navigate("/admin/borrows"),
      clickable: true,
    },
    {
      title: "Total Borrows",
      value: stats.totalBorrows,
      icon: TrendingUp,
      color: "bg-purple-500/20 text-purple-400",
      onClick: () => navigate("/admin/borrows"),
      clickable: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">System overview and statistics</p>
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
              const CardWrapper = stat.clickable ? "button" : "div";

              return (
                <CardWrapper
                  key={index}
                  onClick={stat.clickable ? stat.onClick : undefined}
                  className={`glass-panel p-6 ${stat.clickable
                    ? "cursor-pointer hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                    : ""
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {stat.clickable && (
                      <span className="text-xs text-gray-500">Click to view</span>
                    )}
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </CardWrapper>
              );
            })}
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/admin/books")}
                className="glass-panel p-6 hover:border-indigo-500/50 transition-all duration-300 group text-left"
              >
                <BookOpen className="h-8 w-8 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-1">Manage Books</h3>
                <p className="text-sm text-gray-400">Add, edit, or remove books</p>
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                className="glass-panel p-6 hover:border-indigo-500/50 transition-all duration-300 group text-left"
              >
                <Users className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-1">Manage Users</h3>
                <p className="text-sm text-gray-400">View users and add admins</p>
              </button>
              <button
                onClick={() => navigate("/catalog")}
                className="glass-panel p-6 hover:border-indigo-500/50 transition-all duration-300 group text-left"
              >
                <BookOpen className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-1">View Catalog</h3>
                <p className="text-sm text-gray-400">Browse all books</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
