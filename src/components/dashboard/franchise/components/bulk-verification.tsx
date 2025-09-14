"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface BulkVerificationProps {
  selectedOrders: Set<string>;
  isBulkVerifying: boolean;
  onBulkVerify: (status: string) => void;
}

export function BulkVerification({
  selectedOrders,
  isBulkVerifying,
  onBulkVerify,
}: BulkVerificationProps) {
  if (selectedOrders.size === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-sm font-medium text-blue-800">
        {selectedOrders.size} order{selectedOrders.size > 1 ? "s" : ""} selected
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => onBulkVerify("Verified")}
          disabled={isBulkVerifying}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Bulk Verify
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onBulkVerify("Cancelled")}
          disabled={isBulkVerifying}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Bulk Cancel
        </Button>
      </div>
    </div>
  );
}
