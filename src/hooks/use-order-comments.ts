import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderComment } from "@/services/order-comment";
import { CreateOrderCommentRequest, OrderComment } from "@/types/order-comment";

export const useCreateOrderComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderComment,
    onSuccess: (newComment: OrderComment) => {
      queryClient.invalidateQueries({
        queryKey: ["order-tracking"],
      });
    },
  });
};
