import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogisticsAPI, type LogisticsExportFilters } from "@/services/logistics-export";

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    
    if (err.response && typeof err.response === 'object') {
      const response = err.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (typeof data.error === 'string') {
          return data.error;
        }
      }
    }
    
    if (typeof err.message === 'string' && err.message.includes('{"error":')) {
      try {
        const match = err.message.match(/\{"error":"([^"]+)"\}/);
        if (match?.[1]) {
          return match[1];
        }
      } catch {
        // Fall through to default handling
      }
    }
    
    const status = err.status;
    const message = typeof err.message === 'string' ? err.message : '';
    
    if (status === 404 || message.includes('404')) {
      return "No orders found for the selected date range and filters.";
    }
    
    if (status === 403 || message.includes('403')) {
      return "You don't have permission to export orders for this franchise.";
    }
    
    if (status === 500 || message.includes('500')) {
      return "Server error occurred. Please try again later.";
    }
    
    if (status === 429 || message.includes('429')) {
      return "Too many requests. Please wait a moment before trying again.";
    }
    
    if (message.includes('NetworkError') || message.includes('fetch')) {
      return "Network error. Please check your connection and try again.";
    }
    
    if (message) {
      return message;
    }
  }
  
  return "Failed to export orders. Please try again.";
};

export const useLogisticsExport = () => {
  return useMutation({
    mutationFn: async (filters: LogisticsExportFilters) => {
      try {
        const blob = await LogisticsAPI.exportOrders(filters);
        return blob;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (blob, variables) => {
      try {
        const filename = `orders-export-franchise-${variables.franchise || 'all'}`;
        LogisticsAPI.downloadCSV(blob, filename);
        
        toast.success("Orders exported successfully!", {
          description: "Your CSV file has been downloaded.",
        });
      } catch (downloadError) {
        console.error("Download failed:", downloadError);
        toast.error("Export completed but download failed", {
          description: "Please try the export again.",
        });
      }
    },
    onError: (error) => {
      console.error("Export failed:", error);
      
      const userFriendlyMessage = getErrorMessage(error);
      
      toast.error("Export Failed", {
        description: userFriendlyMessage,
      });
    },
  });
};