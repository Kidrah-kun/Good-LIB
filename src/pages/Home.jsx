import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooksRequest, getAllBooksSuccess, getAllBooksFailure } from "../store/slices/bookSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Search, BookOpen, DollarSign, ArrowUpDown, X, Hash, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'Fantasy', 'Mystery', 'Self-Help', 'Business', 'Other'];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const getGradientForCategory = (category) => {
    const gradients = {
        'Fiction': 'from-[#4338ca] to-[#312e81]',
        'Non-Fiction': 'from-[#0369a1] to-[#0c4a6e]',
        'Science': 'from-[#0f766e] to-[#134e4a]',
        'Technology': 'from-[#334155] to-[#0f172a]',
        'Biography': 'from-[#b45309] to-[#78350f]',
        'Fantasy': 'from-[#a21caf] to-[#701a75]',
        'Mystery': 'from-[#374151] to-[#111827]',
        'Self-Help': 'from-[#15803d] to-[#14532d]',
        'Business': 'from-[#1e40af] to-[#1e3a8a]',
        'Other': 'from-[#14b8a6] to-[#0f766e]'
    };
    return gradients[category] || 'from-[#14b8a6] to-[#0f766e]';
};

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

  const listVariants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
      }
  };

  const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        
        {/* Compact Header & Search */}
        <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/[0.08] rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5 opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-5 items-center justify-between text-center md:text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-0.5 tracking-tight">
                        Discover
                    </h1>
                    <p className="text-[13px] text-neutral-400 font-medium">
                        Explore <span className="text-white font-bold">{pagination.total}</span> works in our collection.
                    </p>
                </div>
                
                <div className="w-full md:max-w-[280px] relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-neutral-500 group-focus-within:text-teal-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search works..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111111]/80 backdrop-blur-md border border-white/[0.08] rounded-lg py-2 pl-10 pr-4 text-[13px] text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-500/40"
                    />
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 shrink-0 space-y-6">
                <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/[0.05] rounded-[2.5rem] p-8 shadow-xl sticky top-32">
                    <h3 className="text-base font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <SlidersHorizontal className="h-5 w-5 text-teal-400" />
                        Refine
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2 pl-1">Category</label>
                            <div className="flex flex-col gap-1">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                                        className={cn(
                                            "w-full text-left px-5 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 border",
                                            selectedCategory === category
                                                ? "bg-teal-500/10 text-teal-300 border-teal-500/30 shadow-[0_0_20px_rgba(13,148,136,0.1)]"
                                                : "bg-transparent text-neutral-500 border-transparent hover:bg-white/[0.04] hover:text-white"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/[0.05]">
                            <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-3 pl-1">Sort Flow</label>
                            <div className="relative">
                                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 pointer-events-none" />
                                <select
                                    value={sortOption}
                                    onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                                    className="w-full bg-[#111111] border border-white/[0.08] rounded-2xl py-4.5 pl-12 pr-4 text-base font-bold text-neutral-300 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 appearance-none cursor-pointer"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin"></div>
                    </div>
                ) : books.length === 0 ? (
                    <div className="bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-16 text-center">
                        <div className="w-16 h-16 bg-neutral-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-8 w-8 text-neutral-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No books found</h3>
                        <p className="text-neutral-500">Try adjusting your search or selecting a different category.</p>
                        <button 
                            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                            className="mt-6 text-sm text-teal-400 font-medium hover:text-teal-300 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <motion.div 
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {books.map((book) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={book._id}
                                    className="group relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden hover:border-teal-500/30 transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
                                    onClick={() => setSelectedBook(book)}
                                >
                                    {/* Faux Cover Image */}
                                    <div className={cn("h-36 relative overflow-hidden bg-gradient-to-br p-5 flex items-end", getGradientForCategory(book.category))}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                        
                                        <div className="relative z-10 w-full transition-transform duration-500 group-hover:-translate-y-1">
                                            <span className="inline-block px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded text-[8px] font-bold text-white/90 uppercase tracking-[0.2em] mb-1.5 border border-white/5">
                                                {book.category || 'Other'}
                                            </span>
                                            <h3 className="text-base font-bold text-white leading-tight line-clamp-2 tracking-tight">
                                                {book.title}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[11px] font-semibold text-neutral-400 truncate tracking-tight">{book.author}</p>
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-sm",
                                                book.availability ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-red-500/10 text-red-400 border-red-500/10"
                                            )}>
                                                {book.availability ? "Available" : "Out"}
                                            </span>
                                        </div>

                                        <p className="text-[13px] text-neutral-500 mb-5 line-clamp-2 flex-1 leading-relaxed">
                                            {book.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                                            <div className="flex items-center gap-1 text-base font-black text-white tracking-tighter">
                                                <DollarSign className="h-3.5 w-3.5 text-teal-400" />
                                                <span>{book.price}</span>
                                            </div>
                                            
                                            <button
                                              onClick={(e) => { e.stopPropagation(); handleBorrow(book._id); }}
                                              disabled={!book.availability}
                                              className={cn(
                                                  "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all",
                                                  book.availability
                                                    ? "text-white bg-teal-500 hover:bg-teal-400"
                                                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                              )}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {book.availability ? <><ShoppingBag className="w-3 h-3"/> Borrow</> : "Out"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {pagination.pages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={pagination.pages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </div>

      {/* Modern Book Detail Modal */}
      <AnimatePresence>
          {selectedBook && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] px-4 py-6" 
                onClick={() => setSelectedBook(null)}
            >
                <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl w-full max-w-[440px] overflow-hidden shadow-2xl relative" 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Cover Image */}
                <div className={cn("h-44 relative overflow-hidden bg-gradient-to-br p-6 flex items-end", getGradientForCategory(selectedBook.category))}>
                    <div className="absolute inset-0 bg-black/20" />
                    <button onClick={() => setSelectedBook(null)} className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors z-20">
                        <X className="h-4 w-4" />
                    </button>
                    <div className="relative z-10 w-full">
                        <span className="inline-block px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md text-[9px] font-bold text-white/90 uppercase tracking-widest mb-2 border border-white/10">
                            {selectedBook.category || 'Other'}
                        </span>
                        <h2 className="text-2xl font-bold text-white leading-tight">{selectedBook.title}</h2>
                    </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-neutral-400">{selectedBook.author}</p>
                    <span className={cn(
                        "px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                        selectedBook.availability ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" : "bg-red-500/10 text-red-400 border-red-500/10"
                    )}>
                      {selectedBook.availability ? "Available" : "Stock Out"}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">{selectedBook.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#111111] border border-white/[0.05] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Price</span>
                      </div>
                      <p className="text-base font-bold text-white">${selectedBook.price}</p>
                    </div>
                    <div className="bg-[#111111] border border-white/[0.05] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                        <Hash className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Stock</span>
                      </div>
                      <p className="text-base font-bold text-white">{selectedBook.quantity}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { handleBorrow(selectedBook._id); }}
                    disabled={!selectedBook.availability}
                    className={cn(
                        "w-full py-3 rounded-lg text-sm font-bold transition-all relative overflow-hidden group",
                        selectedBook.availability
                          ? "bg-teal-500 text-white hover:bg-teal-400"
                          : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    )}
                  >
                    <span className="relative z-10 flex flex-row items-center justify-center gap-2">
                        {selectedBook.availability ?  <><ShoppingBag className="w-4 h-4"/> Borrow Book</> : "Unavailable"}
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </Layout>
  );
};

export default Home;
