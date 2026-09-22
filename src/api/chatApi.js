import axiosInstance from "./axiosConfig";

export const sendChatMessage = (receiverId, content) => {
  return axiosInstance.post("/chat/send", {
    receiverId,
    content,
  });
};

export const getChatHistory = (otherUserId) => {
  return axiosInstance.get("/chat/history", {
    params: { otherUserId },
  });
};
