
"use client";
import React, { useState, useEffect } from "react";
import { TrackingLanding } from "./tracking-landing";
import { OrderDetails } from "./order-details";
import { useOrderTracking } from "@/hooks/use-order-tracking";

type ViewMode = 'landing' | 'details';

interface OrderTrackingAppProps {
  initialView?: ViewMode;
  initialOrderCode?: string;
}

export const OrderTrackingApp: React.FC<OrderTrackingAppProps> = ({
  initialView = 'landing',
  initialOrderCode
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>(initialView);
  const {
    data: orderData,
    isLoading,
    hasError,
    error,
    hasData,
    trackOrder,
    clearTracking,
    refreshOrder
  } = useOrderTracking();

  // Handle initial order code if provided
  useEffect(() => {
    if (initialOrderCode && !orderData) {
      trackOrder(initialOrderCode);
      setCurrentView('details');
    }
  }, [initialOrderCode, orderData, trackOrder]);

  // Switch to details view when order data is loaded
  useEffect(() => {
    if (hasData && currentView === 'landing') {
      setCurrentView('details');
    }
  }, [hasData, currentView]);

  const handleBackToSearch = () => {
    setCurrentView('landing');
    clearTracking();
  };

  const handleTrackingFound = () => {
    if (hasData) {
      setCurrentView('details');
    }
  };

  if (currentView === 'details' && orderData) {
    return (
      <OrderDetails
        orderData={orderData}
        onBack={handleBackToSearch}
        onRefresh={refreshOrder}
        isRefreshing={isLoading}
      />
    );
  }

  return (
    <TrackingLanding
      onTrackingFound={handleTrackingFound}
    />
  );
};

export default OrderTrackingApp;