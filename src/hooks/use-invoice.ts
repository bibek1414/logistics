import {
  createInvoice,
  getInvoices,
  InvoiceFilters,
} from "@/services/invoice.service";
import type { PaginatedInvoiceResponse } from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      toast.success("Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    },
  });
};

export const useGetInvoices = (filters?: InvoiceFilters) => {
  return useQuery<PaginatedInvoiceResponse, Error>({
    queryKey: ["invoices", filters],
    queryFn: () => getInvoices(filters),
    placeholderData: (prev) => prev,
  });
};
