import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBooksRequest, getAllBooksSuccess, getAllBooksFailure,
  deleteBookRequest, deleteBookSuccess, deleteBookFailure,
} from "../store/slices/bookSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, BookOpen, X, Search, Download, Upload } from "lucide-react";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.book);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", author: "", description: "", category: "Other", price: "", quantity: "",
  });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    dispatch(getAllBooksRequest());
    try {
      const { data } = await axiosInstance.get("/book/all?page=1&limit=1000");
      dispatch(getAllBooksSuccess(data.books));
    } catch (err) {
      dispatch(getAllBooksFailure(err.response?.data?.message || "Failed to fetch books"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axiosInstance.put(`/book/admin/update/${currentBook._id}`, formData);
        toast.success("Book updated!");
      } else {
        await axiosInstance.post("/book/admin/add", formData);
        toast.success("Book added!");
      }
      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/book/admin/delete/${id}`);
      dispatch(deleteBookSuccess(id));
      toast.success("Book deleted!");
    } catch (err) {
      dispatch(deleteBookFailure(err.response?.data?.message || "Delete failed"));
      toast.error("Failed to delete book");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setCurrentBook(book);
    setFormData({ title: book.title, author: book.author, description: book.description, category: book.category || "Other", price: book.price, quantity: book.quantity });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ title: "", author: "", description: "", category: "Other", price: "", quantity: "" });
    setEditMode(false);
    setCurrentBook(null);
  };

  const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'Fantasy', 'Mystery', 'Self-Help', 'Business', 'Other'];

  const filteredBooks = books.filter(book => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return book.title?.toLowerCase().includes(term) || book.author?.toLowerCase().includes(term) || book.category?.toLowerCase().includes(term);
  });

  const totalValue = books.reduce((sum, b) => sum + ((b.price || 0) * (b.quantity || 0)), 0);
  const outOfStock = books.filter(b => !b.availability).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white mb-0.5">Books</h1>
          <p className="text-xs text-neutral-500">
            {books.length} total · {outOfStock} out of stock · ${totalValue.toFixed(0)} inventory value
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Book</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 !py-2.5 text-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-sm text-neutral-400">{searchTerm ? "No books match your search" : "No books yet"}</p>
          {!searchTerm && (
            <button onClick={() => { resetForm(); setShowModal(true); }} className="mt-3 text-xs text-teal-400 hover:text-teal-300 transition-colors">
              Add your first book →
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-neutral-500 uppercase tracking-wider w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-white max-w-[200px] truncate">{book.title}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400 max-w-[140px] truncate">{book.author}</td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="badge badge-purple">{book.category || 'Other'}</span></td>
                    <td className="px-4 py-3 text-sm text-neutral-400">${book.price}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400">{book.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${book.availability ? "badge-green" : "badge-red"}`}>
                        {book.availability ? "In Stock" : "Out"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(book)} className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors" title="Edit">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          disabled={deletingId === book._id}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-600/10 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === book._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-neutral-800 bg-neutral-900/50">
            <span className="text-[10px] text-neutral-600 uppercase tracking-wider">
              Showing {filteredBooks.length} of {books.length} books
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">{editMode ? "Edit Book" : "Add Book"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 text-neutral-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required placeholder="e.g. The Great Gatsby" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Author *</label>
                <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="input-field" required placeholder="e.g. F. Scott Fitzgerald" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field resize-none" rows="3" required placeholder="Brief description of the book..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field" required>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Price ($) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field" required min="0" step="0.01" placeholder="9.99" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Quantity *</label>
                  <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="input-field" required min="0" placeholder="10" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 text-sm">{editMode ? "Save Changes" : "Add Book"}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
