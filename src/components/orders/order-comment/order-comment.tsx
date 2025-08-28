"use client";
import React, { useState } from "react";
import { useCreateOrderComment } from "@/hooks/use-order-comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface OrderCommentsSectionProps {
  orderId: number;
  orderCode: string;
}

export const OrderCommentsSection: React.FC<OrderCommentsSectionProps> = ({
  orderId,
  orderCode,
}) => {
  const [newComment, setNewComment] = useState("");
  const createCommentMutation = useCreateOrderComment();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        order: orderId,
        comment: newComment.trim(),
      });
      setNewComment(""); // Clear the form after successful submission
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder={`Add a comment for order ${orderCode}...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            disabled={createCommentMutation.isPending}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || createCommentMutation.isPending}
              size="sm"
            >
              {createCommentMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Add Comment
            </Button>
          </div>
        </form>

        {createCommentMutation.isError && (
          <div className="mt-2 text-sm text-red-600">
            Failed to add comment. Please try again.
          </div>
        )}

        {createCommentMutation.isSuccess && (
          <div className="mt-2 text-sm text-green-600">
            Comment added successfully!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
