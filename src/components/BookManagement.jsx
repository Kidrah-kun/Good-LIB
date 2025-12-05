import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBooksRequest,
  getAllBooksSuccess,
  getAllBooksFailure,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailure,
} from "../store/slices/bookSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.book);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "Other",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    dispatch(getAllBooksRequest());
    try {
      // Request all books for admin view with high limit
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
        toast.success("Book updated successfully!");
      } else {
        await axiosInstance.post("/book/admin/add", formData);
        toast.success("Book added successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    dispatch(deleteBookRequest());
    try {
      await axiosInstance.delete(`/book/admin/delete/${id}`);
      dispatch(deleteBookSuccess(id));
      toast.success("Book deleted successfully!");
    } catch (err) {
      dispatch(deleteBookFailure(err.response?.data?.message || "Delete failed"));
      toast.error("Failed to delete book");
    }
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category || "Other",
      price: book.price,
      quantity: book.quantity,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category: "Other",
      price: "",
      quantity: "",
    });
    setEditMode(false);
    setCurrentBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Book Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No books available</p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                        {book.category || 'Other'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      ${book.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {book.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${book.availability
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                          }`}
                      >
                        {book.availability ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="Edit book"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete book"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editMode ? "Edit Book" : "Add New Book"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="Biography">Biography</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editMode ? "Update Book" : "Add Book"}
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
    </div>
  );
};

export default BookManagement;
