import axios from "axios";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAuthStorage,
} from "./tokenService";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: getRefreshToken(),
        });

        setAuthStorage({
          accessToken: refreshResponse.data.accessToken,
          refreshToken: refreshResponse.data.refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAuthStorage();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
