import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { EditOrderService } from "@/services/edit-order.service";

export const useEditOrder = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ order_id, data }: { order_id: string; data: any }) =>
      EditOrderService.editOrder(order_id, data),
    onSuccess: (_, variables) => {
      const { data } = variables;

      // Show appropriate success message based on what was updated
      if (data.order_status) {
        toast.success(`Order status updated to ${data.order_status}`);
      } else {
        toast.success("Order updated successfully");
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["franchise"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });

  return { mutate, isPending, isError, error };
};
