import { OrderTrackingApp } from "@/components/hero-section/order-tracking";
import { useParams } from "next/navigation";

export default function TrackSpecificOrderPage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;

  return (
    <OrderTrackingApp initialView="details" initialOrderCode={orderCode} />
  );
}
