import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    borrowedBooks: [],
    loading: false,
    error: null,
    message: null,
};

const borrowSlice = createSlice({
    name: "borrow",
    initialState,
    reducers: {
        borrowBookRequest: (state) => {
            state.loading = true;
        },
        borrowBookSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload;
        },
        borrowBookFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getMyBorrowedBooksRequest: (state) => {
            state.loading = true;
        },
        getMyBorrowedBooksSuccess: (state, action) => {
            state.loading = false;
            state.borrowedBooks = action.payload;
        },
        getMyBorrowedBooksFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        returnBookRequest: (state) => {
            state.loading = true;
        },
        returnBookSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload;
        },
        returnBookFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
    },
});

export const {
    borrowBookRequest,
    borrowBookSuccess,
    borrowBookFailure,
    getMyBorrowedBooksRequest,
    getMyBorrowedBooksSuccess,
    getMyBorrowedBooksFailure,
    returnBookRequest,
    returnBookSuccess,
    returnBookFailure,
    clearErrors,
    clearMessage,
} = borrowSlice.actions;

export default borrowSlice.reducer;
