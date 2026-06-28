import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  YdmLogisticsSettings,
  YdmLogisticsSettingsPayload,
} from "@/types/logistics-settings";
import { LogisticsSettingsService } from "@/services/logistics-settings.service";

const QUERY_KEY = ["logisticsSettings"] as const;

/** Fetch the current logistics settings */
export function useLogisticsSettings() {
  return useQuery<YdmLogisticsSettings | null, Error>({
    queryKey: QUERY_KEY,
    queryFn: () => LogisticsSettingsService.get(),
    staleTime: 1000 * 60 * 5,
  });
}

/** Save mutation — always POSTs to /api/logistics/settings/ */
export function useLogisticsSettingsMutations(options?: {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}) {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (payload: YdmLogisticsSettingsPayload) =>
      LogisticsSettingsService.save(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      options?.onSuccess?.();
    },
    onError: (err: Error) => {
      console.error("Failed to save logistics settings:", err);
      options?.onError?.(err);
    },
  });

  return { saveMutation };
}
