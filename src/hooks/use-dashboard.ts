import { DashboardService } from "@/services/dashboard.service";
import { OrderTrackingResponse } from "@/types/dashboard/stats";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = (id: number) => {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<OrderTrackingResponse>({
      queryKey: ["dashboard-stats", id],
      queryFn: () => DashboardService.getDashboardStats(id),
      retry: 1,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    });

  return {
    stats: data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useDashboardData = (id: number) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard-data", id],
    queryFn: () => DashboardService.getDashboardData(id),
    retry: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    dashboardData: data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useOrderChartData = (id: number) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["order-chart-data", id],
    queryFn: () => DashboardService.getOrderChartData(id),
    retry: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    orderChartData: data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};
