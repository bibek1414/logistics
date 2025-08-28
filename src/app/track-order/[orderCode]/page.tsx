"use client";
import { useParams, useRouter } from "next/navigation";
import { OrderDetails } from "@/components/orders/order-details";
import { useOrderTracking } from "@/hooks/use-order-tracking";

export default function TrackOrderWithCodePage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params?.orderCode as string;

  const decodedOrderCode = decodeURIComponent(orderCode);

  const { orderData, isLoading, error, clearTracking, refreshOrder } =
    useOrderTracking(decodedOrderCode);

  const handleBackToSearch = () => {
    router.push("/");
    clearTracking();
  };

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
