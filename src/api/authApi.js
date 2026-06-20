import axiosInstance from "./axiosConfig";


// ================= LOGIN =================
export const login = (loginData) => {

  return axiosInstance.post("/auth/login", loginData);

};


// ================= REGISTER =================
export const register = (registerData) => {

  return axiosInstance.post("/auth/register", registerData);

};


// ================= EMAIL OTP =================

// Send Email OTP
export const sendEmailOtp = (email) => {

  return axiosInstance.post("/auth/send-email-otp", {
    email: email
  });

};


// Verify Email OTP
export const verifyEmailOtp = (email, otp) => {

  return axiosInstance.post("/auth/verify-email-otp", {
    email: email,
    otp: otp
  });

};


// Register Aadhaar record
export const registerAadhaar = (aadhaarData) => {

  return axiosInstance.post("/auth/register-aadhaar", aadhaarData);

};


// ================= AADHAAR OTP =================

// Send Aadhaar OTP
export const sendAadhaarOtp = (aadhaarNumber) => {

  return axiosInstance.post("/auth/send-aadhaar-otp", {
    aadhaarNumber: aadhaarNumber
  });

};


// Verify Aadhaar OTP
export const verifyAadhaarOtp = (aadhaarNumber, otp) => {

  return axiosInstance.post("/auth/verify-aadhaar-otp", {
    aadhaarNumber: aadhaarNumber,
    otp: otp
  });

};



// ================= RESET PASSWORD =================

export const resetPassword = (resetData) => {

  return axiosInstance.post("/auth/reset-password", resetData);

};

// ================= CURRENT USER =================

export const getCurrentUser = () => {

  return axiosInstance.get("/auth/me");

};
