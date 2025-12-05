import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooksRequest, getAllBooksSuccess, getAllBooksFailure } from "../store/slices/bookSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Search, BookOpen, User as UserIcon, DollarSign, Filter, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'Fantasy', 'Mystery', 'Self-Help', 'Business', 'Other'];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'author-asc', label: 'Author (A-Z)' },
  { value: 'author-desc', label: 'Author (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, loading } = useSelector((state) => state.book);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState("createdAt-desc");
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchBooks();
  }, [currentPage, itemsPerPage, selectedCategory, sortOption]);

  const fetchBooks = async () => {
    dispatch(getAllBooksRequest());
    try {
      const [sortBy, order] = sortOption.split('-');
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order,
      });

      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const { data } = await axiosInstance.get(`/book/all?${params.toString()}`);
      dispatch(getAllBooksSuccess(data.books));
      setPagination(data.pagination);
    } catch (err) {
      dispatch(getAllBooksFailure(err.response?.data?.message || "Failed to fetch books"));
      toast.error("Failed to load books");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleBorrow = async (bookId) => {
    if (!isAuthenticated) {
      toast.info("Please login to borrow books");
      navigate("/login");
      return;
    }
    try {
      await axiosInstance.post("/borrow/borrow-book", { bookId });
      toast.success("Book borrowed successfully!");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow book");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="glass-panel p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to GoodLIB
          </h1>
          <p className="text-gray-400 text-lg">
            Discover, borrow, and enjoy thousands of books at your fingertips
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-panel p-6 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </form>

          {/* Category Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Items Per Page */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-medium text-gray-300">Sort By</span>
              </div>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:w-48">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-300">Items Per Page</span>
              </div>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            Showing {books.length} of {pagination.total} books
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No books found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="glass-panel p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span>{book.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                          {book.category || 'Other'}
                        </span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>${book.price}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${book.availability
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {book.availability ? "Available" : "Unavailable"}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Qty: {book.quantity}</span>
                    <button
                      onClick={() => handleBorrow(book._id)}
                      disabled={!book.availability}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${book.availability
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {book.availability ? "Borrow" : "Not Available"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.pages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
