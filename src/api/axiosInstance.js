import axios from "axios";

// Use Vite env variable in production/deploy, fall back to local server for dev
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
