"use client";
import { useParams } from "next/navigation";
import { OrderTrackingApp } from "@/components/orders/order-tracking";

export default function TrackOrderWithCodePage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;

  return (
    <OrderTrackingApp
      initialView="details"
      initialOrderCode={decodeURIComponent(orderCode)}
    />
  );
}
