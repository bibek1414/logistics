"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useLogisticsExport } from "@/hooks/use-logistics-export";
import { LogisticsExportFilters } from "@/services/logistics-export";

interface OrderSummaryProps {
  franchiseId: number;
  franchiseName?: string;
}

export function OrderSummary({ franchiseId, franchiseName }: OrderSummaryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<LogisticsExportFilters>({
    franchise: franchiseId,
    startDate: "",
    endDate: "",
    orderStatus: "all",
    
  });

  const exportMutation = useLogisticsExport();

  const handleExport = async () => {
    if (!filters.startDate || !filters.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    // Remove "all" values before sending to API
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "all" && value !== "") {
        acc[key as keyof LogisticsExportFilters] = value;
      }
      return acc;
    }, {} as LogisticsExportFilters);

    // Always include franchise ID
    cleanFilters.franchise = franchiseId;

    exportMutation.mutate(cleanFilters, {
      onSuccess: () => {
        setIsDialogOpen(false);
        // Reset filters to default
        setFilters({
          franchise: franchiseId,
          startDate: "",
          endDate: "",
         orderStatus: "all",
        });
      },
    });
  };

  const updateFilter = (key: keyof LogisticsExportFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  // Get 30 days ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const setQuickDateRange = (days: number) => {
    const endDate = today;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          Order Summary & Export
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Export orders data for {franchiseName || `Franchise ${franchiseId}`}
        </p>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Export Orders Data</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Date Range Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Date Range *</Label>
                
                {/* Quick Date Range Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(7)}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(30)}
                  >
                    Last 30 days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(90)}
                  >
                    Last 90 days
                  </Button>
                </div>

                {/* Custom Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => updateFilter("startDate", e.target.value)}
                      max={today}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => updateFilter("endDate", e.target.value)}
                      max={today}
                      min={filters.startDate}
                    />
                  </div>
                </div>
              </div>
    <div>
                    <Label htmlFor="orderStatus">Order Status</Label>
                    <Select 
                      value={filters.orderStatus} 
                      onValueChange={(value) => updateFilter("orderStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Sent to YDM">Sent to YDM</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Returned by Customer">Returned by Customer</SelectItem>
                        <SelectItem value="Return Pending">Return Pending</SelectItem>
                        <SelectItem value="Returned by YDM">Returned by YDM</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

              {/* Export Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={exportMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={exportMutation.isPending || !filters.startDate || !filters.endDate}
                >
                  {exportMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </>
                  )}
                </Button>
              </div>

            
              
              {exportMutation.isSuccess && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                  Orders exported successfully! Download should start automatically.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}