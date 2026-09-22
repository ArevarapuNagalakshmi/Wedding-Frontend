import axios from "axios";

const apiHost = window.location.hostname || "localhost";
const apiBaseUrl = process.env.REACT_APP_API_URL || `http://${apiHost}:2003/api`;

const axiosInstance = axios.create({

  baseURL: apiBaseUrl,

  headers: {
    "Content-Type": "application/json"
  }

});

axiosInstance.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Auth token attached to request");
    } else {
      console.warn("⚠️ No auth token found in localStorage");
    }

    console.log(`📤 Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);

    return config;

  },

  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }

);

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(

  (response) => {
    console.log(`📥 Response: ${response.status} ${response.config.url}`);
    return response;
  },

  (error) => {
    if (error.response) {
      console.error(`❌ Response error: ${error.response.status} - ${error.response.statusText}`);
      console.error("Error details:", error.response.data);
    } else if (error.request) {
      console.error("❌ No response from server - Network error");
    } else {
      console.error("❌ Error:", error.message);
    }
    return Promise.reject(error);
  }

);

export default axiosInstance;
