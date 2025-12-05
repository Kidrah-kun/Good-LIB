import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    books: [],
    book: null,
    loading: false,
    error: null,
};

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        getAllBooksRequest: (state) => {
            state.loading = true;
        },
        getAllBooksSuccess: (state, action) => {
            state.loading = false;
            state.books = action.payload;
        },
        getAllBooksFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getBookDetailsRequest: (state) => {
            state.loading = true;
        },
        getBookDetailsSuccess: (state, action) => {
            state.loading = false;
            state.book = action.payload;
        },
        getBookDetailsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addBookRequest: (state) => {
            state.loading = true;
        },
        addBookSuccess: (state, action) => {
            state.loading = false;
            state.books.push(action.payload);
        },
        addBookFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateBookRequest: (state) => {
            state.loading = true;
        },
        updateBookSuccess: (state, action) => {
            state.loading = false;
            state.books = state.books.map((book) =>
                book._id === action.payload._id ? action.payload : book
            );
        },
        updateBookFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteBookRequest: (state) => {
            state.loading = true;
        },
        deleteBookSuccess: (state, action) => {
            state.loading = false;
            state.books = state.books.filter((book) => book._id !== action.payload);
        },
        deleteBookFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
    },
});

export const {
    getAllBooksRequest,
    getAllBooksSuccess,
    getAllBooksFailure,
    getBookDetailsRequest,
    getBookDetailsSuccess,
    getBookDetailsFailure,
    addBookRequest,
    addBookSuccess,
    addBookFailure,
    updateBookRequest,
    updateBookSuccess,
    updateBookFailure,
    deleteBookRequest,
    deleteBookSuccess,
    deleteBookFailure,
    clearErrors,
} = bookSlice.actions;

export default bookSlice.reducer;
