import { AxiosInstance } from "axios";

export const search = async (
  axios: AxiosInstance,
  q: string,
) => {
  try {
    const params = {
        q: q
    }
    const url = `https://big-cradle-be-1.onrender.com/search-mgt`;

    const res = await axios.get(url, { params });
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "An unexpected error occurred";

    return Promise.reject({ message });
  }
};