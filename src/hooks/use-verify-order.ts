import { verifyOrders } from "@/services/verify-orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface VerifyOrderParams {
  order_ids: number[];
  status: string;
}

export const useVerifyOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: VerifyOrderParams) => verifyOrders(params),
    onSuccess: () => {
      // Invalidate and refetch franchise data to update the UI
      queryClient.invalidateQueries({ queryKey: ["franchise"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
