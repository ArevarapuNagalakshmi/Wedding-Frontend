import axiosInstance from "./axiosConfig";

export const getBlockedDates = (vendorId) => {
  return axiosInstance.get(`/availability/vendor/${vendorId}`);
};
