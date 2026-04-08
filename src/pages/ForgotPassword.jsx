import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import emailjs from "@emailjs/browser";
import { ArrowLeft, BookOpen, Mail } from "lucide-react";

const EMAILJS_SERVICE_ID = "service_jimeixf";
const EMAILJS_PUBLIC_KEY = "rHqgF67qQjyOCmwrP";
// You need to create a "reset password" template in EmailJS with {{to_email}}, {{to_name}}, {{reset_link}}
const EMAILJS_RESET_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID || "";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/password/forget", { email });

      // If a reset template exists, send email via EmailJS
      if (EMAILJS_RESET_TEMPLATE_ID) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_RESET_TEMPLATE_ID, {
          to_email: email,
          reset_link: data.resetUrl,
          to_name: email.split("@")[0],
        }, EMAILJS_PUBLIC_KEY);
      }

      toast.success("Reset link generated!");
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to login</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-semibold text-white">GoodLIB</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Forgot password</h1>
          <p className="text-sm text-neutral-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-teal-600/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-5 w-5 text-teal-400" />
            </div>
            <h3 className="text-sm font-medium text-white mb-1">Check your email</h3>
            <p className="text-xs text-neutral-500 mb-4">
              If an account exists for {email}, we've sent a reset link.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Email</label>
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
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
