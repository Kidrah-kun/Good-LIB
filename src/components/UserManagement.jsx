import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Users, UserPlus, X, Upload, Trash2, ShieldCheck, ShieldOff, Crown, Search } from "lucide-react";

const UserManagement = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [userToPromote, setUserToPromote] = useState(null);
    const [showDemoteModal, setShowDemoteModal] = useState(false);
    const [userToDemote, setUserToDemote] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/user/all");
            setUsers(data.users);
            setIsMaster(data.requestingUserIsMaster);
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
            toast.success("User promoted to admin!");
            setShowPromoteModal(false); setUserToPromote(null);
            fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || "Failed to promote user"); }
    };

    const handleDemoteClick = (user) => { setUserToDemote(user); setShowDemoteModal(true); };
    const handleDemoteConfirm = async () => {
        try {
            await axiosInstance.put(`/user/demote-to-user/${userToDemote._id}`);
            toast.success("Admin demoted to user!");
            setShowDemoteModal(false); setUserToDemote(null);
            fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || "Failed to demote admin"); }
    };

    const filteredUsers = users.filter(u => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term) || u.role?.toLowerCase().includes(term);
    });

    const adminCount = users.filter(u => u.role === "Admin").length;
    const userCount = users.filter(u => u.role === "User").length;

    // Permission helpers
    const canDeleteUser = (targetUser) => {
        if (targetUser.isMaster) return false; // never delete master
        if (targetUser._id === currentUser?._id) return false; // can't delete self
        if (targetUser.role === "Admin") return isMaster; // only master can delete admins
        return true; // any admin can delete regular users
    };

    const canPromoteUser = (targetUser) => {
        return targetUser.role === "User";
    };

    const canDemoteUser = (targetUser) => {
        if (!isMaster) return false; // only master can demote
        if (targetUser.isMaster) return false; // can't demote master
        return targetUser.role === "Admin";
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Users</h1>
                    <p className="text-lg text-neutral-400 font-medium tracking-tight">
                        {users.length} total members · {adminCount} staff · {userCount} patrons
                        {isMaster && <span className="ml-3 text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full text-xs uppercase tracking-widest border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">★ Master System Account</span>}
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-3">
                    <UserPlus className="h-5 w-5" /><span className="font-bold">Add New Admin</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5 group-focus-within:text-teal-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search members by name, email, or access level..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-14 py-5 text-lg placeholder:text-neutral-600"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400">{searchTerm ? "No users match your search" : "No users found"}</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Member Profile</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em] hidden sm:table-cell">Contact Address</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Authorization</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em] hidden md:table-cell">Registered</th>
                                    <th className="px-6 py-5 text-left text-xs font-black text-neutral-500 uppercase tracking-[0.2em] w-32">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                  <img
                                                      src={user.avatar?.url}
                                                      alt={user.name}
                                                      className="h-11 w-11 rounded-2xl object-cover bg-neutral-800 border border-white/10 ring-4 ring-white/[0.02]"
                                                      onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.style.display = 'none';
                                                          e.target.nextSibling.style.display = 'flex';
                                                      }}
                                                  />
                                                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 items-center justify-center text-sm font-black text-white hidden border border-teal-400/20">
                                                      {user.name.charAt(0).toUpperCase()}
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-white tracking-tight">{user.name}</span>
                                                    {user.isMaster && <Crown className="h-4 w-4 text-amber-400 fill-amber-400/20" title="Master Account" />}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-base text-neutral-400 font-medium hidden sm:table-cell tracking-tight">{user.email}</td>
                                        <td className="px-6 py-5">
                                            <span className={`badge ${user.role === "Admin" ? "badge-purple" : "badge-blue"}`}>{user.role}</span>
                                        </td>
                                        <td className="px-6 py-5 text-base text-neutral-500 font-medium hidden md:table-cell tracking-tight">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {canPromoteUser(user) && (
                                                    <button onClick={() => handlePromoteClick(user)} className="p-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-teal-500/10 transition-all border border-transparent hover:border-teal-500/20" title="Promote to Admin">
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {canDemoteUser(user) && (
                                                    <button onClick={() => handleDemoteClick(user)} className="p-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-500/20" title="Demote to User">
                                                        <ShieldOff className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {canDeleteUser(user) && (
                                                    <button onClick={() => handleDeleteClick(user)} className="p-2.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20" title="Delete Account">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-2 border-t border-neutral-800 bg-neutral-900/50">
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">
                            Showing {filteredUsers.length} of {users.length} users
                        </span>
                    </div>
                </div>
            )}

            {/* Add Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); resetForm(); }}>
                    <div className="card p-6 max-w-sm w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required placeholder="Full name" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Email *</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" required placeholder="admin@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Password *</label>
                                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" required minLength={8} maxLength={16} placeholder="8-16 characters" />
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}>
                    <div className="card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-2">Delete {userToDelete.role === "Admin" ? "Admin" : "User"}</h2>
                        <p className="text-sm text-neutral-400 mb-5">
                            Delete <span className="text-white font-medium">{userToDelete.name}</span>
                            {userToDelete.role === "Admin" && <span className="text-amber-400"> (Admin)</span>}? This cannot be undone.
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowPromoteModal(false); setUserToPromote(null); }}>
                    <div className="card p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-teal-600/10 flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="h-8 w-8 text-teal-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-3">Promote to Admin</h2>
                        <p className="text-base text-neutral-400 mb-8">
                            Give <span className="text-white font-medium">{userToPromote.name}</span> full admin privileges?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={handlePromoteConfirm} className="flex-1 btn-primary text-base py-3">Promote</button>
                            <button onClick={() => { setShowPromoteModal(false); setUserToPromote(null); }} className="flex-1 btn-secondary text-base py-3">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Demote Modal — Master Only */}
            {showDemoteModal && userToDemote && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowDemoteModal(false); setUserToDemote(null); }}>
                    <div className="card p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center mx-auto mb-3">
                            <ShieldOff className="h-5 w-5 text-amber-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">Demote Admin</h2>
                        <p className="text-sm text-neutral-400 mb-5">
                            Remove admin privileges from <span className="text-white font-medium">{userToDemote.name}</span>? They will become a regular user.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handleDemoteConfirm} className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">Demote</button>
                            <button onClick={() => { setShowDemoteModal(false); setUserToDemote(null); }} className="flex-1 btn-secondary text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
