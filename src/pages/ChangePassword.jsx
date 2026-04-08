import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Lock, ArrowLeft } from "lucide-react";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
            toast.error("Password must be 8–16 characters");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axiosInstance.put("/auth/password/update", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmPassword,
            });
            toast.success(data.message || "Password changed!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-6 group text-sm"
            >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Dashboard</span>
            </button>

            <div className="mb-6">
                <div className="w-10 h-10 rounded-lg bg-teal-600/10 flex items-center justify-center mb-4">
                    <Lock className="h-5 w-5 text-teal-400" />
                </div>
                <h1 className="text-xl font-semibold text-white mb-1">Change password</h1>
                <p className="text-sm text-neutral-500">Update your account password.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                        Current Password
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter current password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                        New Password
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="8–16 characters"
                        required
                        minLength={8}
                        maxLength={16}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Repeat new password"
                        required
                        minLength={8}
                        maxLength={16}
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
                        "Update Password"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
