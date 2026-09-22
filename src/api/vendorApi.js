import axiosInstance from "./axiosConfig";

export const getVendorProfile = () => {
  return axiosInstance.get("/vendors/profile");
};

export const getVendorById = (vendorId) => {
  return axiosInstance.get(`/vendors/${vendorId}`);
};

export const updateVendorProfile = (data) => {
  return axiosInstance.put("/vendors/profile", data);
};

export const createVendorProfile = (data) => {
  return axiosInstance.post("/vendors", data);
};

export const uploadPortfolioFiles = (formData) => {
  return axiosInstance.post("/vendors/profile/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getVendorBookings = () => {
  return axiosInstance.get("/vendor/bookings");
};
