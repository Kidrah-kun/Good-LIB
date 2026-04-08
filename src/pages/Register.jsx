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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Home</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-semibold text-white">GoodLIB</span>
          </div>
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-semibold text-white mb-1">Create account</h1>
              <p className="text-sm text-neutral-500">Get started with your library membership.</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white mb-1">Verify email</h1>
              <p className="text-sm text-neutral-500">
                Enter the 6-digit code sent to{" "}
                <span className="text-teal-400">{formData.email}</span>
              </p>
            </>
          )}
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-teal-400" />
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  One-Time Password
                </label>
              </div>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
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
                    className="w-12 h-14 text-center text-xl font-semibold bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-teal-600/50 focus:ring-1 focus:ring-teal-600/30 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Verify & Create Account"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-teal-400 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCw className={`h-3 w-3 ${resendCooldown > 0 ? "" : "group-hover:rotate-180 transition-transform"}`} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
              className="w-full text-center text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              ← Use a different email
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="mt-6 text-center text-xs text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
