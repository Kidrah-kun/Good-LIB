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
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Forgot password</h1>
              <p className="text-sm text-neutral-400">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {sent ? (
              <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center shadow-inner">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
                  <Mail className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Check your email</h3>
                <p className="text-sm text-neutral-400 mb-6 px-2">
                  If an account exists for <span className="text-white font-medium">{email}</span>, we've sent a reset link.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Try another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">Email</label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20"
                      placeholder="you@example.com"
                      required
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
                          "Send Reset Link"
                        )}
                      </div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
