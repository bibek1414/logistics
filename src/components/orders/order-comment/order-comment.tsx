"use client";
import React, { useState } from "react";
import { useCreateOrderComment } from "@/hooks/use-order-comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        order: orderId,
        comment: newComment.trim(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="space-y-3">
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
