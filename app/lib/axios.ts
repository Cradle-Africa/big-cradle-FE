
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  getToken,
  // removeUser,
  addToken,
  removeUser,
} from "../utils/user/userData";
import { refreshTokenService } from "../services/user/userService";

// export const BASE_URL = "https://big-cradle-be-dev.onrender.com";
export const BASE_URL = "https://big-cradle-be-1.onrender.com/api/v1";

const apiClient_ = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // <-- required for cookies
});

// === Request Interceptor
apiClient_.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// === Response Interceptor
apiClient_.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshTokenService();
        const newAccessToken = refreshed.accessToken;

        console.log('NEW ACCESS TOKEN:', newAccessToken)
        if (!newAccessToken) {
          throw new Error("Failed to refresh access token");
        }

        console.log("Access token refreshed successfully");

        addToken(newAccessToken);

        // Update Authorization header safely
        (originalRequest.headers as any).set('Authorization', `Bearer ${newAccessToken}`);

        return apiClient_.request(originalRequest);
      } catch (refreshError) {
        removeUser();
        console.log("Failed to refresh Access token", refreshError);
        // alert(refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient_;

export const axiosWithoutAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

