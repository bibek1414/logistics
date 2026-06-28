"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import DateRangePicker from "@/components/ui/date-range-picker";

interface OrderFiltersProps {
  searchOrder: string;
  setSearchOrder: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  dateRange: { from?: Date; to?: Date } | undefined;
  setDateRange: (value: { from?: Date; to?: Date } | undefined) => void;
  filterDeliveryType: string;
  setFilterDeliveryType: (value: string) => void;
  hasActiveFilters: () => boolean;
  clearAllFilters: () => void;
  filterIsAssigned: string;
  setFilterIsAssigned: (value: string) => void;
  showPendingOrders: boolean;
  setShowPendingOrders: (value: boolean) => void;
}

export function OrderFilters({
  searchOrder,
  setSearchOrder,
  filterStatus,
  setFilterStatus,
  dateRange,
  setDateRange,
  filterDeliveryType,
  setFilterDeliveryType,
  hasActiveFilters,
  clearAllFilters,
  filterIsAssigned,
  setFilterIsAssigned,
  showPendingOrders,
  setShowPendingOrders,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by order code, customer name, or phone..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select
            value={filterDeliveryType}
            onValueChange={setFilterDeliveryType}
          >
            <SelectTrigger className="w-full sm:w-48">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Delivery Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Inside valley">Inside Valley</SelectItem>
              <SelectItem value="Outside valley">Outside Valley</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Sent to YDM">Sent to YDM</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Returned By Customer">
                Returned By Customer
              </SelectItem>
              <SelectItem value="Returned By YDM">Returned By YDM</SelectItem>
              <SelectItem value="Return Pending">Return Pending</SelectItem>
              <SelectItem value="Out For Delivery">Out For Delivery</SelectItem>
              <SelectItem value="Rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterIsAssigned} onValueChange={setFilterIsAssigned}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Is Assigned</SelectItem>
              <SelectItem value="true">Assigned</SelectItem>
              <SelectItem value="false">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Pending Orders</span>
          <Switch
            checked={showPendingOrders}
            onCheckedChange={setShowPendingOrders}
          />
        </div>
        {hasActiveFilters() && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800 bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
