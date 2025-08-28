import { useQuery } from "@tanstack/react-query";
import { RiderService } from "@/services/riders.service";
import { RidersResponse } from "@/types/rider";

export const useRiders = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RidersResponse,
    Error
  >({
    queryKey: ["riders"],
    queryFn: () => RiderService.getRiders(),
    retry: 1,
    staleTime: 30 * 1000, // 30s
    gcTime: 5 * 60 * 1000, // 5m
  });

  return { data, isLoading, isError, error, refetch, isRefetching };
};
