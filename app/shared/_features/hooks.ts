import { MeResponse } from "@/app/lib/type";
import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { fetchMe } from "./api";

type UseFetchMe = {
  axios: AxiosInstance;
};

export const useFetchMe = ({ axios }: UseFetchMe) => {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: () => fetchMe(axios),
    staleTime: 60 * 1000 * 60,
    retry: 3,
  });
};
