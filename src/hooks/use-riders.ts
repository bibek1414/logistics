import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiderService } from "@/services/riders.service";
import { Rider, RidersResponse, RiderCommissionStats, RiderPackageStats, RiderOrdersResponse, RiderCommissionPaymentsResponse, RiderDailyStats } from "@/types/rider";
import { toast } from "sonner";

export const useRiders = (
  paramsOrSearch?: string | { search?: string; page?: number; pageSize?: number }
) => {
  let search = "";
  let page: number | undefined;
  let pageSize: number | undefined;

  if (typeof paramsOrSearch === "string") {
    search = paramsOrSearch;
  } else if (paramsOrSearch) {
    search = paramsOrSearch.search || "";
    page = paramsOrSearch.page;
    pageSize = paramsOrSearch.pageSize;
  }

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RidersResponse,
    Error
  >({
    queryKey: ["riders", search, page, pageSize],
    queryFn: () => RiderService.getRiders(search, page, pageSize), // Load riders with pagination
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useAssignRider = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ orders, rider }: { orders: string[]; rider: string }) =>
      RiderService.assignRider(orders, rider),
    onSuccess: () => {
      toast.success("Rider assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["franchise"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign rider: ${error.message}`);
    },
  });

  return { mutate, isPending, isError, error };
};

export const useReassignRider = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ orders, rider }: { orders: string[]; rider: string }) =>
      RiderService.reassignRider(orders, rider),
    onSuccess: () => {
      toast.success("Rider re-assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["franchise"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to re-assign rider: ${error.message}`);
    },
  });

  return { mutate, isPending, isError, error };
};

export const useRiderCommissionStats = (
  riderPhone?: string,
  startDate?: string,
  endDate?: string,
  enabled: boolean = true
) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RiderCommissionStats,
    Error
  >({
    queryKey: ["rider-commission-stats", riderPhone, startDate, endDate],
    queryFn: () =>
      RiderService.getRiderCommissionStats(riderPhone, startDate, endDate),
    enabled: enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useRiderPackageStats = (
  riderPhone?: string,
  startDate?: string,
  endDate?: string,
  enabled: boolean = true
) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RiderPackageStats,
    Error
  >({
    queryKey: ["rider-package-stats", riderPhone, startDate, endDate],
    queryFn: () =>
      RiderService.getRiderPackageStats(riderPhone, startDate, endDate),
    enabled: enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useRiderOrders = (
  riderPhone?: string,
  page?: number,
  pageSize?: number,
  startDate?: string,
  endDate?: string,
  orderStatus?: string,
  enabled: boolean = true
) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RiderOrdersResponse,
    Error
  >({
    queryKey: ["rider-orders", riderPhone, page, pageSize, startDate, endDate, orderStatus],
    queryFn: () => RiderService.getRiderOrders(riderPhone, page, pageSize, startDate, endDate, orderStatus),
    enabled: enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useRiderCommissionPayments = (
  riderPhone?: string,
  page?: number,
  pageSize?: number,
  enabled: boolean = true
) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RiderCommissionPaymentsResponse,
    Error
  >({
    queryKey: ["rider-commission-payments", riderPhone, page, pageSize],
    queryFn: () => RiderService.getRiderCommissionPayments(riderPhone, page, pageSize),
    enabled: enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useCreateRiderPayout = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { rider: string; amount: string; remarks: string }
  >({
    mutationFn: (payload) => RiderService.createRiderPayout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-commission-payments"] });
      queryClient.invalidateQueries({ queryKey: ["rider-commission-stats"] });
      toast.success("Payout recorded successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to record payout");
    },
  });
};

export const useRiderDailyStats = (
  riderPhone?: string,
  startDate?: string,
  endDate?: string,
  enabled: boolean = true
) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RiderDailyStats[],
    Error
  >({
    queryKey: ["rider-daily-stats", riderPhone, startDate, endDate],
    queryFn: () =>
      RiderService.getRiderDailyStats(riderPhone, startDate, endDate),
    enabled: enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};


