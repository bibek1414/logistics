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
      case "return pending":
        return "destructive";
      case "out for delivery":
        return "default";
      default:
        return "secondary";
    }
  };

  // Define all possible status options
  const allStatusOptions = [
    { value: "Out For Delivery", label: "Out For Delivery" },
    { value: "Return Pending", label: "Return Pending" },
    { value: "Delivered", label: "Delivered" },
    { value: "Rescheduled", label: "Rescheduled" },
  ];

  // Filter status options based on current status
  const getAvailableStatusOptions = () => {
    const currentStatusLower = currentStatus.toLowerCase();
    
    // If current status is "Return Pending", no status changes allowed
    if (currentStatusLower === "return pending") {
      return [];
    }
    
    // If current status is "Delivered", no status changes allowed
    if (currentStatusLower === "delivered") {
      return [];
    }
    
    // For other statuses, return all options
    return allStatusOptions;
  };

  const availableStatusOptions = getAvailableStatusOptions();
  const isStatusChangeDisabled = availableStatusOptions.length === 0;

  // If no status changes are allowed, just show the current status as a badge
  if (isStatusChangeDisabled) {
    if (isMobile) {
      return (
        <div className="flex xs:flex-row xs:items-center gap-2 mt-3 pt-2">
          <Badge variant={getStatusColor(currentStatus)} className="text-xs">
            {currentStatus}
          </Badge>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor(currentStatus)}>
          {currentStatus}
        </Badge>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex xs:flex-row xs:items-center gap-2 mt-3 pt-2">
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
          <SelectContent align="start">
            {availableStatusOptions.map((option) => (
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
      <SelectContent align="start">
        {availableStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};