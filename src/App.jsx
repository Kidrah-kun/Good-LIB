import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./store/actions/authActions";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import UserDashboard from "./components/UserDashboard"; // Using component as page for now
import Layout from "./components/Layout";
import BookManagement from "./components/BookManagement";
import MyBorrowedBooks from "./components/MyBorrowedBooks";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import UserManagement from "./components/UserManagement";
import BorrowManagement from "./components/BorrowManagement";

const DashboardRouter = () => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "Admin" ? <AdminDashboard /> : <UserDashboard />;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/password/change" element={<Layout><ProtectedRoute><ChangePassword /></ProtectedRoute></Layout>} />
        <Route path="/dashboard" element={<Layout><ProtectedRoute><DashboardRouter /></ProtectedRoute></Layout>} />
        <Route path="/admin/books" element={<Layout><ProtectedRoute adminOnly><BookManagement /></ProtectedRoute></Layout>} />
        <Route path="/admin/users" element={<Layout><ProtectedRoute adminOnly><UserManagement /></ProtectedRoute></Layout>} />
        <Route path="/admin/borrows" element={<Layout><ProtectedRoute adminOnly><BorrowManagement /></ProtectedRoute></Layout>} />
        <Route path="/my-books" element={<Layout><ProtectedRoute><MyBorrowedBooks /></ProtectedRoute></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
