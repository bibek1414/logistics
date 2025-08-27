import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { OrderTrackingAPI } from "@/services/order-tracking";

export const useOrderTracking = (orderCode?: string) => {
  const router = useRouter();

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["order-tracking", orderCode],
    queryFn: () => OrderTrackingAPI.trackAny(orderCode!),
    enabled: !!orderCode,
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const trackOrder = (trackingCode: string) => {
    if (!trackingCode.trim()) {
      throw new Error("Please enter a tracking number");
    }

    // Navigate to the tracking page with the order code
    router.push(`/track-order/${encodeURIComponent(trackingCode.trim())}`);
  };

  const refreshOrder = () => {
    refetch();
  };

  return {
    orderData: orderData?.data,
    isLoading,
    error:
      error?.message ||
      (orderData && !orderData.success ? orderData.message : null),
    hasError: !!error || (orderData && !orderData.success),
    hasData: orderData?.success && !!orderData.data?.id,
    trackOrder,
    refreshOrder,
  };
};
