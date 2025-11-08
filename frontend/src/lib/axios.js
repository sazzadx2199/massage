import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:3000/api";
  }
  // Use environment variable for production backend URL
  return import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "/api";
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
