import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Users, UserPlus, X, Upload, Trash2 } from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/user/all");
            setUsers(data.users);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
                toast.error("Only JPG, PNG, and WEBP formats are allowed");
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!avatarFile) {
            toast.error("Please upload an avatar image");
            return;
        }

        if (formData.password.length < 8 || formData.password.length > 16) {
            toast.error("Password must be between 8 and 16 characters");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("avatar", avatarFile);

            await axiosInstance.post("/user/add/new-admin", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Admin added successfully!");
            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add admin");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
        });
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/user/delete-user/${userToDelete._id}`);
            toast.success("User deleted successfully!");
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete user");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <UserPlus className="h-5 w-5" />
                    <span>Add Admin</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No users found</p>
                </div>
            ) : (
                <div className="glass-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Avatar
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.avatar?.url ? (
                                                <img
                                                    src={user.avatar.url}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "Admin"
                                                    ? "bg-purple-500/20 text-purple-300"
                                                    : "bg-blue-500/20 text-blue-300"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.accountVerified
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                            >
                                                {user.accountVerified ? "Verified" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.role !== "Admin" && (
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Add New Admin</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Avatar Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Avatar *
                                </label>
                                <div className="flex items-center space-x-4">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-slate-700 flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-center hover:bg-slate-700 transition-colors">
                                            <span className="text-sm text-gray-300">Choose File</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG, or WEBP (Max 5MB)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field"
                                    required
                                    minLength={8}
                                    maxLength={16}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be 8-16 characters
                                </p>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button type="submit" className="btn-primary flex-1">
                                    Add Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">Delete User Account</h2>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-white">{userToDelete.name}</span>'s account?
                            This action cannot be undone.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setUserToDelete(null);
                                }}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
