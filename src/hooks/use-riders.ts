import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiderService } from "@/services/riders.service";
import { RidersResponse } from "@/types/rider";
import { toast } from "sonner";

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

export const useAssignRider = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ orders, rider }: { orders: string[]; rider: string }) =>
      RiderService.assignRider(orders, rider),
    onSuccess: () => {
      toast.success("Rider assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign rider: ${error.message}`);
    },
  });

  return { mutate, isPending, isError, error };
};
