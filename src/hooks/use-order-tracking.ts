import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderTrackingAPI } from "@/services/order-tracking";
import { OrderData } from "@/types/order";

export const useOrderTracking = (orderCode?: string) => {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["order-tracking", orderCode],
    queryFn: () => OrderTrackingAPI.trackAny(orderCode!),
    enabled: !!orderCode,
    retry: 1,
    staleTime: 0, // Always fresh data for comments
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const validateTrackingCode = (trackingCode: string) => {
    if (!trackingCode.trim()) {
      throw new Error("Please enter a tracking number");
    }
    return trackingCode.trim();
  };

  const refreshOrder = () => {
    refetch();
  };

  const clearTracking = () => {
    queryClient.removeQueries({
      queryKey: ["order-tracking"],
    });
  };

  return {
    orderData: (response?.success ? response.data : null) as OrderData | null,
    isLoading: isLoading || isRefetching,
    error: (error?.message ||
      (response && !response.success ? response.message : null)) as
      | string
      | null,
    hasError: !!error || (response && !response.success),
    hasData: response?.success && !!response.data?.id,
    validateTrackingCode,
    refreshOrder,
    clearTracking,
  };
};
