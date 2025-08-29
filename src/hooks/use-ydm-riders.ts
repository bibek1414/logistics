import { useQuery } from "@tanstack/react-query";
import { YDMRiderOrdersAPI } from "@/services/ydm-riders";
import { SalesResponse } from "@/types/sales";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateOrderStatusParams {
  orderId: string;
  newStatus: string;
   comment?: string;
}

interface UseYDMRiderOrderMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
interface UseYDMRiderOrdersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  orderStatus?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export const useYDMRiderOrders = ({
  page = 1,
  pageSize = 25,
  search = "",
  orderStatus = "all",
  startDate,
  endDate,
  enabled = true,
}: UseYDMRiderOrdersOptions) => {
  const { user } = useAuth();

  // Query is enabled if user exists and enabled is true
  const queryEnabled = enabled && !!user;

  return useQuery<SalesResponse, Error>({
    queryKey: [
      "ydmRiderOrders",
      user?.id, // Use user ID instead of riderId
      page,
      pageSize,
      search,
      orderStatus,
      startDate,
      endDate,
    ],
    queryFn: () =>
      YDMRiderOrdersAPI.getYDMRiderOrders({
        page,
        pageSize,
        search,
        orderStatus,
        startDate,
        endDate,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: queryEnabled,
  });
};

export const useYDMRiderOrderMutations = ({
  onSuccess,
  onError,
}: UseYDMRiderOrderMutationsOptions = {}) => {
  const queryClient = useQueryClient();

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus, comment }: UpdateOrderStatusParams) =>
      YDMRiderOrdersAPI.updateOrderStatus(orderId, newStatus, comment), // Pass comment to API
    onSuccess: () => {
      // Invalidate and refetch orders data
      queryClient.invalidateQueries({
        queryKey: ["ydmRiderOrders"],
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to update order status:", error);
      onError?.(error);
    },
  });

  return {
    updateOrderStatusMutation,
  };
};
