"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search, Clock, MapPin } from "lucide-react";
import { useRiders } from "@/hooks/use-riders";

interface SearchableAgentSelectProps {
  orderId?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
}

export function SearchableAgentSelect({
  orderId,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Assign Agent",
  searchTerm = "",
  setSearchTerm,
}: SearchableAgentSelectProps) {
  const { data: riders, isLoading } = useRiders();

  const getFilteredAgents = (searchTerm = "") => {
    if (!riders) return [];
    return riders.filter(
      (rider) =>
        searchTerm === "" ||
        `${rider.first_name} ${rider.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        rider.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAssignedRiderName = (riderId: string) => {
    if (!riders) return null;
    const rider = riders.find((r) => r.id.toString() === riderId);
    return rider ? `${rider.first_name} ${rider.last_name}` : null;
  };

  const filteredAgents = getFilteredAgents(searchTerm);

  if (isLoading) {
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
              ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
              : "bg-white"
          }`}
        >
          {disabled ? (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Assigning...</span>
            </div>
          ) : value ? (
            <span>✓ {getAssignedRiderName(value)}</span>
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
                onChange={(e) => setSearchTerm?.(e.target.value)}
                className="pl-7 h-7 text-xs"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          {filteredAgents.length === 0 ? (
            <div className="p-2 text-xs text-gray-500 text-center">
              No riders found
            </div>
          ) : (
            filteredAgents.map((rider) => (
              <SelectItem key={rider.id} value={rider.id.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span>
                    {rider.first_name} {rider.last_name}
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {rider.address}
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
