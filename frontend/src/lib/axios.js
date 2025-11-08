import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:3000/api";
  }
  
  // Production: Use environment variable or show error
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  
  // Fallback: Try to use relative path (won't work if backend is separate)
  console.error("⚠️ VITE_API_URL not set! Add it in Vercel environment variables.");
  return "/api";
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
