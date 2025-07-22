
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders
} from "axios";

import { getToken, addToken,
  removeUser,
} from "../utils/user/userData";
import { refreshTokenService } from "../services/user/userService";

// export const BASE_URL = "https://big-cradle-be-dev.onrender.com/api/v1";
export const BASE_URL = "https://big-cradle-be-1.onrender.com/api/v1";


const apiClient_ = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, //ensures refresh token cookie is sent
});

// === Request Interceptor
apiClient_.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      // Correctly using .set() for AxiosHeaders
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
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
        const { accessToken } = await refreshTokenService();
        if (!accessToken) throw new Error("No access token returned from refresh");
        console.log("new access token -", accessToken);
        
        addToken(accessToken);

        // Use .set if headers is AxiosHeaders instance
        if (originalRequest.headers) {
          if (typeof (originalRequest.headers as AxiosHeaders).set === 'function') {
            // It's an instance of AxiosHeaders – use set method
            (originalRequest.headers as AxiosHeaders).set('Authorization', `Bearer ${accessToken}`);
            console.log("Set new access token -");

          } else {
            // It's a plain object – mutate directly
            (originalRequest.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
            console.log("Set new access token --");

          }
        }

        return apiClient_.request(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh Access token", refreshError);
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
  withCredentials: true,
});