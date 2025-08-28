import { useQuery } from "@tanstack/react-query";
import { FranchiseAPI, type FranchiseFilters } from "@/services/franchise";
import type { Franchise } from "@/types/franchise";
import type { SalesResponse } from "@/types/sales";

export const useFranchises = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    Franchise[],
    Error
  >({
    queryKey: ["franchises"],
    queryFn: () => FranchiseAPI.list(),
    retry: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    franchises: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export const useFranchise = (id: number, filters?: FranchiseFilters) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    SalesResponse,
    Error
  >({
    queryKey: ["franchise", id, filters],
    queryFn: () => FranchiseAPI.get(id, filters),
    retry: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    franchise: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};
