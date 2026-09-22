import axiosInstance from "./axiosConfig";
import { logApiError } from "./errorHandler";

// Profile endpoints
export const getCustomerProfile = async () => {
  try {
    console.log("📡 Fetching customer profile...");
    const response = await axiosInstance.get("/customers/profile");
    console.log("✅ Profile loaded successfully:", response.data);
    return response;
  } catch (error) {
    logApiError("/customers/profile", error, { method: "GET" });
    throw error;
  }
};

export const updateCustomerProfile = async (profile) => {
  try {
    console.log("📡 Updating customer profile...", profile);
    const response = await axiosInstance.put("/customers/profile", profile);
    console.log("✅ Profile updated successfully:", response.data);
    return response;
  } catch (error) {
    logApiError("/customers/profile", error, { method: "PUT", payload: profile });
    throw error;
  }
};

// Dashboard endpoints
export const getDashboardData = () => axiosInstance.get("/dashboard/customer");

export const getDashboardMetrics = () => axiosInstance.get("/dashboard/customer/metrics");

export const getRecentBookings = (limit = 5) => 
  axiosInstance.get("/dashboard/customer/recent-bookings", { params: { limit } });

export const getSavedVendors = (limit = 6) => 
  axiosInstance.get("/dashboard/customer/saved-vendors", { params: { limit } });

export const getDashboardInsights = () => axiosInstance.get("/dashboard/customer/insights");
