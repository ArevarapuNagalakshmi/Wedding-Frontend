import axiosInstance from "./axiosConfig";

export const bookService = (bookingData) => {
  return axiosInstance.post("/bookings", bookingData);
};

export const getMyBookings = () => {
  return axiosInstance.get("/bookings/my");
};

export const getAllBookings = () => {
  return axiosInstance.get("/admin/bookings");
};
