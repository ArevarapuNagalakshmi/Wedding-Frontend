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
