"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentSubmit: (comment: string) => void;
  isLoading?: boolean;
  status?: string; // Add status prop to determine dialog content
}

export function CommentDialog({
  open,
  onOpenChange,
  onCommentSubmit,
  isLoading = false,
  status = "Rescheduled", 
}: CommentDialogProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onCommentSubmit(comment);
      setComment("");
    }
  };

  const getDialogContent = () => {
    switch (status) {
      case "Returned By Customer":
        return {
          title: "Add Return Comment",
          placeholder: "Enter the reason for the return...",
        };
      case "Rescheduled":
      default:
        return {
          title: "Add Reschedule Comment",
          placeholder: "Enter the reason for rescheduling...",
        };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              id="comment"
              placeholder={dialogContent.placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setComment(""); 
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !comment.trim()}
            >
              {isLoading ? "Submitting..." : "Submit Comment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}