// import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
// import { getToken, removeUser } from "../utils/user/userData";
// export const BASE_URL = "https://big-cradle-be-1.onrender.com/api/v1";
// // const BASE_URL = "";

// const apiClient_ = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// apiClient_.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const token = getToken();
//         if (token) {
//             config.headers.set('Authorization', `Bearer ${token}`);
//         } else {
//             throw new Error('No authentication token found');
//         }
//         return config;
//     },
//     (error: AxiosError) => Promise.reject(error)
// );


// apiClient_.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             removeUser();
//         }
//         return Promise.reject(error);
//     }
// );

// export default apiClient_;

// export const axiosWithoutAuth = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });




// axios/index.ts

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  getToken,
  getRefreshToken,
  getUser,
  removeUser,
  addToken,
} from "../utils/user/userData";
import { refreshTokenService } from "../services/user/userService";

export const BASE_URL = "https://big-cradle-be-1.onrender.com/api/v1";

const apiClient_ = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
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
        const refreshToken = getRefreshToken();
        const user = getUser();
        if (!refreshToken || !user?.email) throw new Error("Missing refresh token or email");

        const refreshed = await refreshTokenService(user.email, refreshToken);
        const newAccessToken = refreshed.tokens.accessToken;

        addToken(newAccessToken);

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient_.request(originalRequest);
      } catch (refreshError) {
        removeUser();
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
});
