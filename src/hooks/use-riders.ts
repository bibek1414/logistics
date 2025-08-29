import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiderService } from "@/services/riders.service";
import { Rider, RidersResponse } from "@/types/rider";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";

export const useRiders = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    RidersResponse,
    Error
  >({
    queryKey: ["riders"],
    queryFn: () => RiderService.getRiders(""), // Load all riders initially
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

// New hook for debounced search with client-side filtering
export const useDebouncedRiderSearch = (
  riders: Rider[] | undefined,
  searchTerm: string
) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // Faster debounce for better UX

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredRiders = useMemo(() => {
    if (!riders) return [];
    if (!debouncedSearchTerm.trim()) return riders;

    return riders.filter(
      (rider) =>
        `${rider.first_name} ${rider.last_name}`
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        rider.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [riders, debouncedSearchTerm]);

  return {
    filteredRiders,
    isSearching: searchTerm !== debouncedSearchTerm,
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
    },
    onError: (error: Error) => {
      toast.error(`Failed to re-assign rider: ${error.message}`);
    },
  });

  return { mutate, isPending, isError, error };
};
