import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { ArrowLeft, BookOpen, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group text-sm font-medium ml-2"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to login</span>
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
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset password</h1>
              <p className="text-sm text-neutral-400">Choose a new password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20 pr-12"
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
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
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <div className="absolute inset-0 -z-10 bg-teal-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group overflow-hidden rounded-xl pt-[1px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center w-full px-4 py-3.5 bg-[#0a0a0a] group-hover:bg-transparent rounded-xl text-white font-semibold transition-all">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Reset Password"
                      )}
                    </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
