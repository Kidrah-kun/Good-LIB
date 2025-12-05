import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/password/forget", { email });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900 px-4">
      <div className="glass-panel p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Forgot Password</h2>
        <p className="text-center text-gray-400 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
