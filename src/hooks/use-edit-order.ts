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
    onSuccess: () => {
      toast.success("Order edited successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to edit order: ${error.message}`);
    },
  });

  return { mutate, isPending, isError, error };
};
