import axiosInstance from "./axiosConfig";

// CUSTOMER
export const getAllServices = () => {
  return axiosInstance.get("/services");
};

export const searchServices = (filters) => {
  return axiosInstance.get("/packages/search", { params: filters });
};

export const getServiceById = (serviceId) => {
  return axiosInstance.get(`/services/${serviceId}`);
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
    return await axiosInstance.delete(`/packages/${serviceId}`);
  } catch (err) {
    // fallback: some backends expose services under /services/:id for deletion
    if (err.response && err.response.status === 404) {
      return await axiosInstance.delete(`/services/${serviceId}`);
    }
    throw err;
  }
};
