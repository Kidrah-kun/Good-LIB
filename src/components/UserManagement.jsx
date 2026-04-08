import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Users, UserPlus, X, Upload, Trash2, ShieldCheck } from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [userToPromote, setUserToPromote] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/user/all");
            setUsers(data.users);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch users");
        } finally { setLoading(false); }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
                toast.error("Only JPG, PNG, and WEBP formats allowed");
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!avatarFile) { toast.error("Please upload an avatar"); return; }
        if (formData.password.length < 8 || formData.password.length > 16) { toast.error("Password must be 8–16 characters"); return; }
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("email", formData.email);
            fd.append("password", formData.password);
            fd.append("avatar", avatarFile);
            await axiosInstance.post("/user/add/new-admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Admin added!");
            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || "Failed to add admin"); }
    };

    const resetForm = () => { setFormData({ name: "", email: "", password: "" }); setAvatarFile(null); setAvatarPreview(null); };

    const handleDeleteClick = (user) => { setUserToDelete(user); setShowDeleteModal(true); };
    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/user/delete-user/${userToDelete._id}`);
            toast.success("User deleted!");
            setShowDeleteModal(false); setUserToDelete(null);
            fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || "Failed to delete user"); }
    };

    const handlePromoteClick = (user) => { setUserToPromote(user); setShowPromoteModal(true); };
    const handlePromoteConfirm = async () => {
        try {
            await axiosInstance.put(`/user/promote-to-admin/${userToPromote._id}`);
            toast.success("User promoted!");
            setShowPromoteModal(false); setUserToPromote(null);
            fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || "Failed to promote user"); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-white mb-0.5">Users</h1>
                    <p className="text-xs text-neutral-500">{users.length} total</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
                    <UserPlus className="h-4 w-4" /><span>Add Admin</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400">No users found</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                {user.avatar?.url ? (
                                                    <img src={user.avatar.url} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-semibold text-white">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-neutral-400">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${user.role === "Admin" ? "badge-purple" : "badge-blue"}`}>{user.role}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${user.accountVerified ? "badge-green" : "badge-amber"}`}>
                                                {user.accountVerified ? "Verified" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-neutral-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            {user.role !== "Admin" && (
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => handlePromoteClick(user)} className="p-1.5 rounded-md text-neutral-500 hover:text-teal-400 hover:bg-teal-600/10 transition-colors" title="Promote">
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(user)} className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-600/10 transition-colors" title="Delete">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-white">Add Admin</h2>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 text-neutral-500 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Avatar *</label>
                                <div className="flex items-center gap-3">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="h-14 w-14 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center">
                                            <Upload className="h-5 w-5 text-neutral-500" />
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-center hover:bg-neutral-700 transition-colors">
                                            <span className="text-xs text-neutral-300">Choose File</span>
                                        </div>
                                        <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleAvatarChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Email *</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Password *</label>
                                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" required minLength={8} maxLength={16} />
                                <p className="text-[10px] text-neutral-600 mt-1">8–16 characters</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary flex-1 text-sm">Add Admin</button>
                                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1 text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card p-6 max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-white mb-2">Delete User</h2>
                        <p className="text-sm text-neutral-400 mb-5">
                            Delete <span className="text-white font-medium">{userToDelete.name}</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handleDeleteConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Delete</button>
                            <button onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }} className="flex-1 btn-secondary text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Promote Modal */}
            {showPromoteModal && userToPromote && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card p-6 max-w-sm w-full text-center">
                        <div className="w-10 h-10 rounded-full bg-teal-600/10 flex items-center justify-center mx-auto mb-3">
                            <ShieldCheck className="h-5 w-5 text-teal-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">Promote to Admin</h2>
                        <p className="text-sm text-neutral-400 mb-5">
                            Give <span className="text-white font-medium">{userToPromote.name}</span> full admin privileges?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handlePromoteConfirm} className="flex-1 btn-primary text-sm">Promote</button>
                            <button onClick={() => { setShowPromoteModal(false); setUserToPromote(null); }} className="flex-1 btn-secondary text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
