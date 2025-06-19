import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getToken, removeUser } from "../utils/user/userData";
const BASE_URL = "https://big-cradle-be-1.onrender.com/api/v1";
// const BASE_URL = "";

const apiClient_ = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient_.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            throw new Error('No authentication token found');
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);


apiClient_.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            removeUser();
        }
        return Promise.reject(error);
    }
);

export default apiClient_;
