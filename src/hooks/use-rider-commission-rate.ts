import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { RiderCommissionRate } from "@/types/rider";
import { RiderCommissionRateService } from "@/services/rider-commission-rate.service";

const QUERY_KEY = ["riderCommissionRates"] as const;

/** Fetch all commission rate slabs */
export function useRiderCommissionRates() {
  return useQuery<RiderCommissionRate[], Error>({
    queryKey: QUERY_KEY,
    queryFn: () => RiderCommissionRateService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

/** Create, update, and delete mutations */
export function useRiderCommissionRateMutations(options?: {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: (payload: Omit<RiderCommissionRate, "id">) =>
      RiderCommissionRateService.create(payload),
    onSuccess: () => {
      invalidate();
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      console.error("Failed to create commission rate:", err);
      options?.onError?.(err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Omit<RiderCommissionRate, "id">>;
    }) => RiderCommissionRateService.update(id, payload),
    onSuccess: () => {
      invalidate();
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      console.error("Failed to update commission rate:", err);
      options?.onError?.(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => RiderCommissionRateService.delete(id),
    onSuccess: () => {
      invalidate();
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      console.error("Failed to delete commission rate:", err);
      options?.onError?.(err);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
