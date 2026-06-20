import axiosInstance from "./axiosConfig";

export const getAllVendors = () => {
  return axiosInstance.get("/admin/vendors");
};

export const approveVendor = (vendorId) => {
  return axiosInstance.put(`/admin/vendors/${vendorId}/approve`);
};

export const rejectVendor = (vendorId) => {
  return axiosInstance.put(`/admin/vendors/${vendorId}/reject`);
};
