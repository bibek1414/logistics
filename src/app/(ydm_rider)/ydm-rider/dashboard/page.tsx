"use client";
import React from "react";
import { YDMRiderOrderList } from "@/components/ydm-rider/order-list";
import { useYDMRiderOrders ,useYDMRiderOrderMutations} from "@/hooks/use-ydm-riders";
import { useOrderFilters } from "@/hooks/use-order-filter";

const RiderOrdersPage: React.FC = () => {
  const { filters, handleFiltersChange } = useOrderFilters();
  
  const {
    data: ordersResponse,
    isLoading: loading,
    error,
    refetch
  } = useYDMRiderOrders({
    page: filters.page,
    pageSize: filters.pageSize,
    search: filters.search,
    orderStatus: filters.orderStatus,
  });

  const { updateOrderStatusMutation } = useYDMRiderOrderMutations({
    onSuccess: () => {
      // Refetch orders after successful status update
      refetch();
    },
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string,comment?: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        newStatus,
        comment
      });
    } catch (err) {
      throw err;
    }
  };

  const orders = ordersResponse?.results || [];
  const totalCount = ordersResponse?.count || 0;
  const errorMessage = error?.message || updateOrderStatusMutation.error?.message || null;

  return (
    <div className="max-w-7xl px-4 mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Orders</h1>
      </div>
      
      <YDMRiderOrderList
        orders={orders}
        loading={loading || updateOrderStatusMutation.isPending}
        error={errorMessage}
        totalCount={totalCount}
        currentPage={filters.page}
        pageSize={filters.pageSize}
        onFiltersChange={handleFiltersChange}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default RiderOrdersPage;