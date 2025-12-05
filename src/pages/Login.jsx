import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginRequest, loginSuccess, loginFailure } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Mail, Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginRequest());
    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      dispatch(loginSuccess(data.user));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4 py-12">
      <div className="glass-panel p-8 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/password/forgot" className="text-indigo-400 hover:text-indigo-300">
              Forgot Password?
            </Link>
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
