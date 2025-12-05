import axiosInstance from "../../api/axiosInstance";
import {
    loginRequest,
    loginSuccess,
    loginFailure,
    loadUserRequest,
    loadUserSuccess,
    loadUserFailure,
    logoutRequest,
    logoutSuccess,
    logoutFailure,
} from "../slices/authSlice";

export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        const { data } = await axiosInstance.get("/auth/me");
        dispatch(loadUserSuccess(data.user));
    } catch (error) {
        // Don't treat "no token" as an error - just means user isn't logged in
        dispatch(loadUserFailure(error.response?.data?.message || "Not authenticated"));
    }
};

export const login = (email, password) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const { data } = await axiosInstance.post("/auth/login", { email, password });
        dispatch(loginSuccess(data.user));
    } catch (err) {
        dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    }
};

export const logout = () => async (dispatch) => {
    dispatch(logoutRequest());
    try {
        await axiosInstance.get("/auth/logout");
        dispatch(logoutSuccess());
    } catch (err) {
        dispatch(logoutFailure(err.response?.data?.message || "Logout failed"));
    }
};
