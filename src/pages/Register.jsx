import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest, registerSuccess, registerFailure, clearErrors, loginSuccess } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerRequest());
    try {
      const { data } = await axiosInstance.post("/auth/register", formData);
      dispatch(registerSuccess());
      dispatch(loginSuccess(data.user));
      toast.success(data.message || "Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      dispatch(registerFailure(err.response?.data?.message || "Registration Failed"));
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900 px-4">
      <div className="glass-panel p-8 max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={8}
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
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
