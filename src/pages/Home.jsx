import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooksRequest, getAllBooksSuccess, getAllBooksFailure } from "../store/slices/bookSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Search, BookOpen, DollarSign, Filter, ArrowUpDown, X, Calendar, Hash, Tag, Info, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'Fantasy', 'Mystery', 'Self-Help', 'Business', 'Other'];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
      fetchBooks();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, itemsPerPage, selectedCategory, sortOption]);

  const fetchBooks = async () => {
    dispatch(getAllBooksRequest());
    try {
      const [sortBy, order] = sortOption.split('-');
      const params = new URLSearchParams({ page: currentPage, limit: itemsPerPage, sortBy, order });
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await axiosInstance.get(`/book/all?${params.toString()}`);
      dispatch(getAllBooksSuccess(data.books));
      setPagination(data.pagination);
    } catch (err) {
      dispatch(getAllBooksFailure(err.response?.data?.message || "Failed to fetch books"));
      toast.error("Failed to load books");
    }
  };

  const handleBorrow = async (bookId) => {
    if (!isAuthenticated) {
      toast.info("Please log in to borrow books");
      navigate("/login");
      return;
    }
    try {
      await axiosInstance.post("/borrow/borrow-book", { bookId });
      toast.success("Book borrowed!");
      setSelectedBook(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow book");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Book Catalog</h1>
            <p className="text-sm text-neutral-500">
              {pagination.total} book{pagination.total !== 1 ? 's' : ''} available
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden btn-secondary !py-2 !px-3 flex items-center gap-1.5 text-xs ${showFilters ? '!border-teal-600/30 !text-teal-400' : ''}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 !py-3 text-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className={`space-y-4 ${showFilters ? '' : 'hidden md:block'}`}>
          <div className="card p-4 space-y-4">
            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-teal-600 text-white"
                        : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & Per Page */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500" />
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Sort</span>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                  className="input-field !py-2 text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:w-36">
                <div className="mb-1.5">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Per page</span>
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="input-field !py-2 text-sm"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm mb-1">No books found</p>
            <p className="text-neutral-600 text-xs">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="card-hover p-5 flex flex-col cursor-pointer group"
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1 truncate group-hover:text-teal-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-purple text-[10px]">{book.category || 'Other'}</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />{book.price}
                        </span>
                      </div>
                    </div>
                    <span className={`badge text-[10px] ml-2 whitespace-nowrap ${
                      book.availability ? "badge-green" : "badge-red"
                    }`}>
                      {book.availability ? "Available" : "Out"}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 mb-4 line-clamp-2 flex-1">{book.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <span className="text-xs text-neutral-600">Qty: {book.quantity}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBorrow(book._id); }}
                      disabled={!book.availability}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        book.availability
                          ? "bg-teal-600 hover:bg-teal-700 text-white"
                          : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                      }`}
                    >
                      {book.availability ? "Borrow" : "Unavailable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

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

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedBook(null)}>
          <div className="card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white mb-1">{selectedBook.title}</h2>
                <p className="text-sm text-neutral-400">{selectedBook.author}</p>
              </div>
              <button onClick={() => setSelectedBook(null)} className="p-1 text-neutral-500 hover:text-white transition-colors ml-3 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-purple">{selectedBook.category || "Other"}</span>
                <span className={`badge ${selectedBook.availability ? "badge-green" : "badge-red"}`}>
                  {selectedBook.availability ? "Available" : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed">{selectedBook.description}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-[10px] uppercase tracking-wider font-medium">Price</span>
                  </div>
                  <p className="text-sm font-semibold text-white">${selectedBook.price}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <Hash className="h-3 w-3" />
                    <span className="text-[10px] uppercase tracking-wider font-medium">Quantity</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{selectedBook.quantity}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBorrow(selectedBook._id)}
              disabled={!selectedBook.availability}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedBook.availability
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              {selectedBook.availability ? "Borrow This Book" : "Currently Unavailable"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
