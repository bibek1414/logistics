import React from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectorProps {
  currentStatus: string;
  orderId: string;
  isUpdating: boolean;
  onStatusChange: (orderId: string, newStatus: string) => void;
  isMobile?: boolean;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  orderId,
  isUpdating,
  onStatusChange,
  isMobile = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "rescheduled":
        return "destructive";
      case "returned by customer":
        return "secondary";
      case "processing":
        return "warning";
      case "out for delivery":
        return "default";
      default:
        return "secondary";
    }
  };

  const statusOptions = [
    { value: "Returned By Customer", label: "Returned By Customer" },
    { value: "Processing", label: "Processing" },
    { value: "Out For Delivery", label: "Out For Delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Rescheduled", label: "Rescheduled" },
  ];

  if (isMobile) {
    return (
      <div className=" xs:flex-row xs:items-center gap-2 mt-3 pt-2 ml-auto">
        <Select
          value={currentStatus}
          onValueChange={(newStatus) => onStatusChange(orderId, newStatus)}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-fit">
            <Badge variant={getStatusColor(currentStatus)} className="text-xs">
              {isUpdating ? "Updating..." : currentStatus}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={(newStatus) => onStatusChange(orderId, newStatus)}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-auto cursor-pointer">
        <Badge variant={getStatusColor(currentStatus)}>
          {isUpdating ? "Updating..." : currentStatus}
        </Badge>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};