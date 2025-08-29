"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search, Clock, Phone } from "lucide-react";
import { useRiders, useDebouncedRiderSearch } from "@/hooks/use-riders";
import { useState } from "react";

interface SearchableAgentSelectProps {
  orderId?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  assignedRiderPhone?: string | null;
}

export function SearchableAgentSelect({
  orderId,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Assign Agent",
  assignedRiderPhone,
}: SearchableAgentSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: riders, isLoading: isLoadingRiders } = useRiders();
  const { filteredRiders, isSearching } = useDebouncedRiderSearch(
    riders,
    searchTerm
  );

  const getAssignedRiderName = (riderId: string) => {
    if (!riders) return null;
    const rider = riders.find((r) => r.id.toString() === riderId);
    return rider ? `${rider.first_name} ${rider.last_name}` : null;
  };

  const getAssignedRiderByPhone = (phone?: string | null) => {
    if (!phone || !riders) return null;
    const rider = riders.find((r) => r.phone_number === phone);
    return rider || null;
  };

  if (isLoadingRiders) {
    return (
      <div className="w-full min-w-[120px] h-8 bg-gray-100 rounded flex items-center justify-center">
        <Clock className="w-3 h-3 animate-spin" />
        <span className="ml-1 text-xs">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={`w-full min-w-[120px] h-8 text-xs ${
            orderId
              ? "bg-white text-black border-green-500 cursor-pointer"
              : "bg-white cursor-pointer"
          }`}
        >
          {disabled ? (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Assigning...</span>
            </div>
          ) : value ? (
            <span>✓ {getAssignedRiderName(value)}</span>
          ) : getAssignedRiderByPhone(assignedRiderPhone) ? (
            <span>
              ✓{" "}
              {`${getAssignedRiderByPhone(assignedRiderPhone)!.first_name} ${
                getAssignedRiderByPhone(assignedRiderPhone)!.last_name
              }`}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <Input
                placeholder="Search riders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs"
                onClick={(e) => e.stopPropagation()}
              />
              {isSearching && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Clock className="w-3 h-3 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>
          {filteredRiders.length === 0 ? (
            <div className="p-2 text-xs text-gray-500 text-center">
              {searchTerm ? "No riders found" : "No riders available"}
            </div>
          ) : (
            filteredRiders.map((rider) => (
              <SelectItem key={rider.id} value={rider.id.toString()}>
                <div className="flex items-center justify-between w-full cursor-pointer">
                  <span>
                    {rider.first_name} {rider.last_name}
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {rider.phone_number || "N/A"}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
