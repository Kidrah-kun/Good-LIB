import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest, registerSuccess, registerFailure, clearErrors, loginSuccess } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import emailjs from "@emailjs/browser";
import { ArrowLeft, Eye, EyeOff, BookOpen, Shield, RotateCw } from "lucide-react";

const EMAILJS_SERVICE_ID = "service_jimeixf";
const EMAILJS_TEMPLATE_ID = "template_rserrul";
const EMAILJS_PUBLIC_KEY = "rHqgF67qQjyOCmwrP";

const Register = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [userId, setUserId] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTPEmail = async (email, name, passcode) => {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        email: email,
        passcode: passcode,
        time: "15 minutes",
      }, EMAILJS_PUBLIC_KEY);
    } catch (err) {
      console.error("EmailJS error:", err);
      // Don't block registration if email fails — user can resend
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerRequest());
    try {
      const { data } = await axiosInstance.post("/auth/register", formData);
      setUserId(data.userId);
      // Send OTP via EmailJS
      await sendOTPEmail(data.email, data.name, data.otp);
      setStep(2);
      setResendCooldown(60);
      toast.success("OTP sent to your email!");
      dispatch(registerSuccess());
    } catch (err) {
      dispatch(registerFailure(err.response?.data?.message || "Registration Failed"));
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length === 6) {
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return toast.error("Please enter the complete 6-digit OTP");
    }
    dispatch(registerRequest());
    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", {
        userId,
        otp: otpString,
      });
      dispatch(loginSuccess(data.user));
      toast.success("Account verified! Welcome!");
      navigate("/dashboard");
    } catch (err) {
      dispatch(registerFailure(err.response?.data?.message || "Verification failed"));
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    try {
      const { data } = await axiosInstance.post("/auth/resend-otp", { userId });
      await sendOTPEmail(data.email, data.name, data.otp);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

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
              {step === 1 ? (
                <>
                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create account</h1>
                  <p className="text-sm text-neutral-400">Get started with your library membership.</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Verify email</h1>
                  <p className="text-sm text-neutral-400">
                    Enter the 6-digit code sent to{" "}
                    <span className="text-teal-400">{formData.email}</span>
                  </p>
                </>
              )}
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20"
                      placeholder="Your full name"
                      required
                    />
                    <div className="absolute inset-0 -z-10 bg-teal-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">Email</label>
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
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest pl-1">Password</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-300 group-hover:border-white/20 pr-10"
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
                          "Continue"
                        )}
                      </div>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {/* OTP Input */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pl-1">
                    <Shield className="h-4 w-4 text-teal-400" />
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                      One-Time Password
                    </label>
                  </div>
                  <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold bg-[#111111] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30 transition-all shadow-inner"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group overflow-hidden rounded-xl pt-0.5 mt-4"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center w-full px-4 py-3.5 bg-transparent rounded-xl text-white font-semibold shadow-[0_0_20px_rgba(13,148,136,0.3)] group-hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] transition-shadow">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Verify & Create Account"
                      )}
                    </div>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-teal-400 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${resendCooldown > 0 ? "" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
                  className="w-full text-center text-sm font-medium text-neutral-500 hover:text-white transition-colors pt-2"
                >
                  ← Use a different email
                </button>
              </form>
            )}

            {step === 1 && (
              <div className="text-center text-sm text-neutral-500 pt-5 mt-2 border-t border-white/[0.05]">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:text-teal-400 transition-colors font-medium hover:underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
