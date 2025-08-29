import { useQuery } from "@tanstack/react-query";
import { SearchMgtResponse } from "./types/types";
import { search } from "./_api";
import { AxiosInstance } from "axios";

export const useSearch = (axios: AxiosInstance, q: string) => {
    return useQuery<SearchMgtResponse>({
        queryKey: ["search-mgt", q],
        queryFn: () => search(axios, q)
    });
};
