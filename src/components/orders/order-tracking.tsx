"use client";
import { useParams, useRouter } from "next/navigation";
import { OrderDetails } from "@/components/orders/order-details";
import { TrackingErrorDisplay } from "../tracking/tracking-error-display";
import { useOrderTracking } from "@/hooks/use-order-tracking";

export default function TrackOrderWithCodePage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params?.orderCode as string;
  const decodedOrderCode = decodeURIComponent(orderCode);

  const { 
    orderData, 
    isLoading, 
    error, 
    hasError,
    hasData,
    isOrderNotFound,
    clearTracking, 
    refreshOrder 
  } = useOrderTracking(decodedOrderCode);

  const handleBackToSearch = () => {
    router.push("/");
    clearTracking();
  };

  const handleRetry = () => {
    refreshOrder();
  };

  // Show error display if there's an error and no data
  if (hasError && !hasData && !isLoading) {
    return (
      <TrackingErrorDisplay
        error={error || "Unknown error occurred"}
        trackingCode={decodedOrderCode}
        isOrderNotFound={isOrderNotFound}
        onRetry={handleRetry}
        onBack={handleBackToSearch}
        isLoading={isLoading}
      />
    );
  }

  // Show order details for successful tracking or loading state
  return (
    <div className="min-h-screen">
      <OrderDetails
        orderData={orderData}
        isLoading={isLoading}
        error={error}
        onBack={handleBackToSearch}
        onRefresh={refreshOrder}
      />
    </div>
  );
}