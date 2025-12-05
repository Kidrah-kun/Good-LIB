import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import borrowReducer from "./slices/borrowSlice";
// import userReducer from "./slices/userSlice"; // Will implement later if needed for dashboard specific data

export const store = configureStore({
    reducer: {
        auth: authReducer,
        book: bookReducer,
        borrow: borrowReducer,
        // user: userReducer,
    },
});
