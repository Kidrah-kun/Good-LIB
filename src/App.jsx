import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./store/actions/authActions";
import { ConfigProvider, theme } from "antd";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";
import UserDashboard from "./components/UserDashboard";
import Layout from "./components/Layout";
import BookManagement from "./components/BookManagement";
import MyBorrowedBooks from "./components/MyBorrowedBooks";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import UserManagement from "./components/UserManagement";
import BorrowManagement from "./components/BorrowManagement";
import GlobalBackground from "./components/GlobalBackground";

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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          // Primary accent — matches var(--accent) teal-600
          colorPrimary: '#0d9488',
          colorPrimaryHover: '#0f766e',
          colorPrimaryActive: '#115e59',
          colorPrimaryBg: 'rgba(13, 148, 136, 0.12)',
          colorPrimaryBgHover: 'rgba(13, 148, 136, 0.18)',

          // Surfaces — matches var(--bg-*)
          colorBgContainer: '#161616',
          colorBgElevated: '#1a1a1a',
          colorBgLayout: '#0a0a0a',
          colorBgSpotlight: '#111111',

          // Borders — matches var(--border)
          colorBorder: '#262626',
          colorBorderSecondary: '#1f1f1f',

          // Text — matches var(--text-*)
          colorText: '#fafafa',
          colorTextSecondary: '#a1a1a1',
          colorTextTertiary: '#737373',
          colorTextQuaternary: '#525252',

          // Status colors
          colorError: '#ef4444',
          colorErrorHover: '#dc2626',
          colorSuccess: '#22c55e',
          colorWarning: '#f59e0b',
          colorInfo: '#0d9488',

          // Typography — matches body font
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 13.5,

          // Shape
          borderRadius: 6,
          borderRadiusLG: 10,
          borderRadiusSM: 4,

          // Spacing
          controlHeight: 36,
          controlHeightLG: 44,
          controlHeightSM: 28,
        },
        components: {
          Button: {
            primaryShadow: 'none',
            defaultBg: '#262626',
            defaultBorderColor: '#3a3a3a',
            defaultColor: '#e5e5e5',
          },
          Input: {
            activeBg: '#171717',
            hoverBg: '#171717',
            activeBorderColor: 'rgba(13, 148, 136, 0.5)',
            hoverBorderColor: '#3a3a3a',
            colorBgContainer: '#171717',
          },
          Select: {
            colorBgContainer: '#171717',
            optionActiveBg: 'rgba(13, 148, 136, 0.12)',
            optionSelectedBg: 'rgba(13, 148, 136, 0.18)',
          },
          Table: {
            headerBg: '#111111',
            headerColor: '#737373',
            rowHoverBg: 'rgba(38, 38, 38, 0.5)',
            borderColor: '#262626',
            colorBgContainer: '#161616',
          },
          Modal: {
            contentBg: '#161616',
            headerBg: '#161616',
            titleColor: '#fafafa',
          },
          Card: {
            colorBgContainer: '#161616',
            colorBorderSecondary: '#262626',
          },
          Menu: {
            darkItemBg: '#0a0a0a',
            darkItemSelectedBg: 'rgba(13, 148, 136, 0.12)',
          },
          Tag: {
            defaultBg: 'rgba(13, 148, 136, 0.12)',
            defaultColor: '#5eead4',
          },
          Tooltip: {
            colorBgSpotlight: '#1a1a1a',
            colorTextLightSolid: '#fafafa',
          },
          Pagination: {
            itemActiveBg: '#0d9488',
            itemBg: 'transparent',
          },
        },
      }}
    >

    <Router>
      <GlobalBackground />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          backgroundColor: "#161616",
          border: "1px solid #262626",
          color: "#fafafa",
          fontSize: "15px",
          fontFamily: "Inter, sans-serif",
        }}
        progressStyle={{ background: "#0d9488" }}
      />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </ConfigProvider>
  );
};

export default App;
