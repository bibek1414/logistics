import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderCommentAPI } from "@/services/order-comment";
import { CreateOrderCommentRequest, OrderComment } from "@/types/order-comment";

export const useCreateOrderComment = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderComment, Error, CreateOrderCommentRequest>({
    mutationFn: (request) => OrderCommentAPI.createOrderComment(request),
    onSuccess: (newComment, variables) => {
      // Invalidate and refetch the comments for this order
      queryClient.invalidateQueries({
        queryKey: ["orderComments", variables.order],
      });
    },
  });
};
