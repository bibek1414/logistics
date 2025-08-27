"use client";
import React, { useState, useEffect } from "react";
import { TrackingLanding } from "../hero-section/tracking-landing";
import { OrderDetails } from "@/components/orders/order-details";
import { useOrderTracking } from "@/hooks/use-order-tracking";

type ViewMode = "landing" | "details";

interface OrderTrackingAppProps {
  initialView?: ViewMode;
  initialOrderCode?: string;
}

export const OrderTrackingApp: React.FC<OrderTrackingAppProps> = ({
  initialView = "landing",
  initialOrderCode,
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>(initialView);
  const { orderData, isLoading, error, clearTracking, refreshOrder } =
    useOrderTracking(initialOrderCode);

  useEffect(() => {
    if (initialOrderCode && initialView === "details") {
      setCurrentView("details");
    }
  }, [initialOrderCode, initialView]);

  const handleBackToSearch = () => {
    setCurrentView("landing");
    clearTracking();
  };

  const handleTrackingFound = () => {
    setCurrentView("details");
  };

  if (currentView === "details") {
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

  return (
    <div className="min-h-screen">
      <TrackingLanding onTrackingFound={handleTrackingFound} />
    </div>
  );
};
