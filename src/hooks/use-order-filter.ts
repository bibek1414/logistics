import { useState } from "react";

interface OrderFilters {
  page: number;
  pageSize: number;
  search: string;
  orderStatus: string;
}

export const useOrderFilters = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    pageSize: 25,
    search: "",
    orderStatus: "all",
  });

  const handleFiltersChange = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 when other filters change (except when page itself is changing)
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 25,
      search: "",
      orderStatus: "all",
    });
  };

  return {
    filters,
    handleFiltersChange,
    resetFilters,
  };
};