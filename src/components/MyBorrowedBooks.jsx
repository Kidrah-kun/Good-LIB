import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyBorrowedBooksRequest,
  getMyBorrowedBooksSuccess,
  getMyBorrowedBooksFailure,
  returnBookRequest,
  returnBookSuccess,
  returnBookFailure,
} from "../store/slices/borrowSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Calendar, BookOpen, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { borrowedBooks, loading } = useSelector((state) => state.borrow);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchBorrowedBooks();
  }, [isAuthenticated]);

  const fetchBorrowedBooks = async () => {
    dispatch(getMyBorrowedBooksRequest());
    try {
      const { data } = await axiosInstance.get("/borrow/my-borrowed-books");
      dispatch(getMyBorrowedBooksSuccess(data.borrowedBooks));
    } catch (err) {
      dispatch(getMyBorrowedBooksFailure(err.response?.data?.message || "Failed to fetch borrowed books"));
      toast.error("Failed to load borrowed books");
    }
  };

  const handleReturn = async (borrowId) => {
    dispatch(returnBookRequest());
    try {
      await axiosInstance.put(`/borrow/return-book/${borrowId}`);
      dispatch(returnBookSuccess("Book returned successfully"));
      toast.success("Book returned successfully!");
      fetchBorrowedBooks();
    } catch (err) {
      dispatch(returnBookFailure(err.response?.data?.message || "Return failed"));
      toast.error(err.response?.data?.message || "Failed to return book");
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">My Borrowed Books</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : borrowedBooks.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">You haven't borrowed any books yet</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {borrowedBooks.map((borrow) => (
            <div
              key={borrow._id}
              className={`glass-panel p-6 ${isOverdue(borrow.dueDate) && !borrow.returned
                  ? "border-red-500/50"
                  : "border-white/10"
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {borrow.bookTitle || "Book Title"}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Borrowed: {formatDate(borrow.borrowedDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {formatDate(borrow.dueDate)}</span>
                    </div>
                    {borrow.returnedDate && (
                      <div className="flex items-center text-green-400 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Returned: {formatDate(borrow.returnedDate)}</span>
                      </div>
                    )}
                    {borrow.fine > 0 && (
                      <div className="flex items-center text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Fine: ${borrow.fine}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {borrow.returned ? (
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium">
                      Returned
                    </span>
                  ) : isOverdue(borrow.dueDate) ? (
                    <>
                      <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium">
                        Overdue
                      </span>
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        className="btn-primary"
                      >
                        Return Book
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      className="btn-primary"
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrowedBooks;
