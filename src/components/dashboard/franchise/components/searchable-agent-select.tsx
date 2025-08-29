"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search, Clock, Phone } from "lucide-react";
import { useRiders } from "@/hooks/use-riders";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: riders, isLoading: isLoadingRiders } =
    useRiders(debouncedSearchTerm);

  const getAssignedRiderName = (riderId: string) => {
    if (!riders) return null;
    const rider = riders.find((r) => r.id.toString() === riderId);
    return rider ? `${rider.first_name} ${rider.last_name}` : null;
  };

  const getAssignedRiderByPhone = (phone?: string | null) => {
    if (!phone || !riders) return null;
    return riders.find((r) => r.phone_number === phone) || null;
  };

  const isRiderAssigned = value || getAssignedRiderByPhone(assignedRiderPhone);

  useEffect(() => {
    if (open) {
      // Defer to next tick to ensure content is mounted
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      // If data refresh causes re-render, keep focus on the input
      const id = requestAnimationFrame(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open, riders, isLoadingRiders]);

  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger
          className={`w-full min-w-[120px] h-8 text-xs ${
            isRiderAssigned
              ? "bg-green-200 text-black border-green-500 cursor-pointer"
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
          {/* Search input */}
          <div
            className="p-2 border-b"
            onPointerDown={(e) => e.stopPropagation()} // Prevent dropdown from closing
          >
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <Input
                ref={inputRef}
                placeholder="Search riders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs"
                onClick={(e) => e.stopPropagation()} // Prevent closing on click
                onKeyDown={(e) => e.stopPropagation()} // Prevent Radix from handling keys
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              />
              {isLoadingRiders && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Clock className="w-3 h-3 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Riders list */}
          {riders?.length === 0 ? (
            <div className="p-2 text-xs text-gray-500 text-center">
              {searchTerm ? "No riders found" : "No riders available"}
            </div>
          ) : (
            riders?.map((rider) => (
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
