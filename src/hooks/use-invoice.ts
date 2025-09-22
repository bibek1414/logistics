import { createInvoice } from "@/services/invoice.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
