import { InviteBusiness } from "@/app/lib/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { inviteBusiness , fetchBusinesses, deleteBusinesse, resetPasswordBusiness } from "./api";
import toast from "react-hot-toast";

type UseFetchBusinesses = {
    axios: AxiosInstance;
    queryParams?: {
        page?: number;
        limit?: number;
        adminUserId?: string | null;
    };
};

export const useFetchBusinesses = ({ axios, queryParams }: UseFetchBusinesses) => {
    return useQuery({
        queryKey: ["businesses", queryParams],
        queryFn: () => fetchBusinesses(axios, queryParams),
        staleTime: 60 * 1000 * 5,
    });
};


export const useInviteBusiness = ({ axios }: {axios: AxiosInstance}) => {
  return useMutation<void, Error, InviteBusiness>({
    mutationFn: (data: InviteBusiness) => inviteBusiness(axios, data),
  });
};

export const useDeleteBusinesses = (axios: any) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (businessUserId: string) => deleteBusinesse(axios, businessUserId),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Business deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error) => {
      console.error("Failed to delete business:", error);
    },
  });
};


export const useBusinessesResetPassword = (axios: any) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (businessUserId: string) => resetPasswordBusiness(axios, businessUserId),
    onSuccess: (data: any) => {
      toast.success(data?.message || "Password reset successfully!");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error) => {
      console.error("Failed to reset the password:", error);
    },
  });
};






