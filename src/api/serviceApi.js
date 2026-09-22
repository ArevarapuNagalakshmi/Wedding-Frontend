import axiosInstance from "./axiosConfig";

// CUSTOMER
export const getAllServices = () => {
  return axiosInstance.get("/services");
};

export const searchServices = (filters = {}) => {
  // Map frontend filter keys to backend search parameter names
  const params = {};

  if (filters.q) params.name = filters.q;
  if (filters.name) params.name = filters.name;
  if (filters.city) params.city = filters.city;
  if (filters.category) params.category = filters.category;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.minRating) params.minRating = filters.minRating;
  if (filters.availableDate) params.availableDate = filters.availableDate;

  return axiosInstance.get("/packages/search", { params });
};

export const getServiceById = (serviceId) => {
  return axiosInstance.get(`/services/${serviceId}`);
};

export const getPackagesByVendor = (vendorId) => {
  return axiosInstance.get(`/packages/vendor/${vendorId}`);
};

// VENDOR
export const getMyServices = (vendorId) => {
  return axiosInstance.get(`/packages/vendor/${vendorId}`);
};

export const addService = (vendorId, serviceData) => {
  return axiosInstance.post(`/packages/vendor/${vendorId}`, serviceData);
};

export const updateService = (serviceId, serviceData) => {
  return axiosInstance.put(`/packages/${serviceId}`, serviceData);
};

export const deleteService = async (serviceId) => {
  try {
    const response = await axiosInstance.delete(`/packages/${serviceId}`);
    return response;
  } catch (err) {
    // Try alternative endpoint if first one fails
    if (err.response && err.response.status === 404) {
      try {
        return await axiosInstance.delete(`/services/${serviceId}`);
      } catch (fallbackErr) {
        throw fallbackErr;
      }
    }
    throw err;
  }
};
