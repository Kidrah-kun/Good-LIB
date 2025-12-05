import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Lock } from "lucide-react";

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
            toast.error("New password and confirm password do not match");
            return;
        }
        if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
            toast.error("Password must be between 8 and 16 characters");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axiosInstance.put("/auth/password/update", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmPassword,
            });
            toast.success(data.message || "Password changed successfully");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4 py-12">
            <div className="glass-panel p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
                        <Lock className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Change Password</h1>
                    <p className="text-gray-400">
                        Enter your current password and new password
                    </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="Enter new password"
                                required
                                minLength={8}
                                maxLength={16}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field pl-10"
                                placeholder="Confirm new password"
                                required
                                minLength={8}
                                maxLength={16}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary"
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
