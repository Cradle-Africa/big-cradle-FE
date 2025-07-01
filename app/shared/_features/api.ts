import { AxiosInstance } from "axios";

export const fetchMe = async (axios: AxiosInstance) => {
  try {
    const res = await axios.get(`/authentication/me`);
    return res.data;
  } catch (error: any) {
    let message =  error?.response?.message;
    const customError = new Error(message);
    throw customError;
  }
};