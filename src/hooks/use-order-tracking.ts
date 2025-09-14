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
    staleTime: 0, // Always fresh data for tracking
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

  // Enhanced error handling
  const getErrorMessage = () => {
    if (error?.message) {
      return error.message;
    }
    if (response && !response.success) {
      return response.message || "Order not found with the provided tracking code";
    }
    return null;
  };

  const hasError = !!error || (response && !response.success);
  const hasData = response?.success && !!response.data?.id;

  return {
    orderData: (response?.success ? response.data : null) as OrderData | null,
    isLoading: isLoading || isRefetching,
    error: getErrorMessage(),
    hasError,
    hasData,
    isOrderNotFound: hasError && (
      getErrorMessage()?.toLowerCase().includes('not found') || 
      getErrorMessage()?.toLowerCase().includes('order not found')
    ),
    validateTrackingCode,
    refreshOrder,
    clearTracking,
  };
};