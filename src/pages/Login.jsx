import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginRequest, loginSuccess, loginFailure } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { ArrowLeft, Eye, EyeOff, BookOpen } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-20 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group text-sm font-medium ml-2"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="p-[1px] relative rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-transparent to-purple-500/20 opacity-30" />
          
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] border border-white/[0.05]">
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shadow-[0_0_15px_rgba(13,148,136,0.15)]">
                  <BookOpen className="h-5 w-5 text-teal-400" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">GoodLIB</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
              <p className="text-sm text-neutral-400">Sign in to your account to continue your journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20"
                    placeholder="you@example.com"
                    required
                  />
                  <div className="absolute inset-0 -z-10 bg-teal-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <div className="absolute inset-0 -z-10 bg-teal-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                </div>
              </div>

              <div className="flex items-center justify-end text-sm pt-1 pb-2">
                <Link to="/password/forgot" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden rounded-xl pt-0.5"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center w-full px-4 py-3.5 bg-transparent rounded-xl text-white font-semibold shadow-[0_0_20px_rgba(13,148,136,0.3)] group-hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] transition-shadow">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Sign In"
                    )}
                  </div>
              </button>

              <div className="text-center text-sm text-neutral-500 pt-4">
                Don't have an account?{" "}
                <Link to="/register" className="text-white hover:text-teal-400 transition-colors font-medium hover:underline underline-offset-4">
                  Create one now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
