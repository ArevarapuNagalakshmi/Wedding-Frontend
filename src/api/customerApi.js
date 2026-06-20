import axiosInstance from "./axiosConfig";

export const getCustomerProfile = () => axiosInstance.get("/customers/profile");

export const updateCustomerProfile = (profile) => axiosInstance.put("/customers/profile", profile);
