import api from "./api";

export const requestSignupOtp = (payload) =>
  api.post("/auth/register/request-otp", payload);

export const verifySignupOtp = (payload) =>
  api.post("/auth/register/verify-otp", payload);

export const loginUser = (payload) => api.post("/auth/login", payload);

export const requestForgotPasswordOtp = (payload) =>
  api.post("/auth/forgot-password/request-otp", payload);

export const resetPassword = (payload) =>
  api.post("/auth/forgot-password/reset", payload);

export const logoutUser = (payload) => api.post("/auth/logout", payload);

export const fetchCurrentUser = () => api.get("/auth/me");
