import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  getTotalAmount,
  InvoiceFilters,
  updateInvoice,
} from "@/services/invoice.service";
import type { Invoice, PaginatedInvoiceResponse } from "@/types/invoice";
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

export const useGetTotalAmount = (franchise: number) => {
  return useQuery<number, Error>({
    queryKey: ["total-amount", franchise],
    queryFn: () => getTotalAmount(franchise),
    placeholderData: (prev) => prev,
  });
};

export const useGetInvoiceById = (id: number) => {
  return useQuery<Invoice, Error>({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    placeholderData: (prev) => prev,
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      invoice,
    }: {
      id: number;
      invoice: Record<string, unknown>;
    }) => updateInvoice(id, invoice),
    onSuccess: () => {
      toast.success("Invoice updated successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update invoice: ${error.message}`);
    },
  });
};
