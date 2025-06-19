import { DataPoint } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createDataPoint, fetchDataPoints } from "./api";

type UseFetchDataTypes = {
  axios: AxiosInstance;
  queryParams?: {
    page?: number;
    limit?: number;
  };
}

export const useFetchDataTypes = ({
  axios, queryParams
}: UseFetchDataTypes) => {
  return useQuery<DataPoint[]>({
    queryKey: ["data-points", queryParams],
    queryFn: () => fetchDataPoints(axios, queryParams),
    staleTime: 60 * 1000 * 5,
    // retry: 3,
  });
};


// interface CreateDataPointProps {
//   axios: AxiosInstance;
// }



// export const useCreateDataPoint = ({ axios }: CreateDataPointProps) => {
//   return useMutation({
//     mutationFn: async (DataPoint) => {
//       const response = await axios.post("/data-point-mgt/data-point", data);
//       return response.data;
//     },
//   });
// };

export const useCreateDataPoint = ({ axios }: {axios: AxiosInstance}) => {
  return useMutation<void, Error, DataPoint>({
    mutationFn: (data: DataPoint) => createDataPoint(axios, data),
  });
};