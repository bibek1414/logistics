"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard";

export function SidebarStats({ id }: { id: number }) {
  const { dashboardData, isLoading: isLoadingDashboardData } =
    useDashboardData(id);

  if (isLoadingDashboardData) {
    return <div>Loading...</div>;
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `Rs.${amount.toLocaleString()}`;
  };

  const data = dashboardData?.data;

  return (
    <div className="space-y-4">
      {/* Order Summary */}
      <Card className="shadow-lg border-0 rounded-xl">
        <CardContent className="p-4 space-y-2.5">
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Total Orders:</span>
              <span className="font-semibold">
                {data?.overall_statistics?.["Total Orders"]?.nos || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Total COD:</span>
              <span className="font-semibold">
                {formatCurrency(
                  data?.overall_statistics?.["Total COD"]?.amount || 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Total RTV:</span>
              <span className="font-semibold">
                {data?.overall_statistics?.["Total RTV"]?.nos || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Total Delivery Charge:
              </span>
              <span className="font-semibold">
                {formatCurrency(
                  data?.overall_statistics?.["Total Delivery Charge"]?.amount ||
                    0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Total Pending COD:
              </span>
              <span className="font-semibold">
                {formatCurrency(
                  data?.overall_statistics?.["Total Pending COD"]?.amount || 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Last COD Payment:
              </span>
              <span className="font-semibold">26-Aug-2025</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <Card className="shadow-lg border-0 rounded-xl">
        <CardContent className="p-4 space-y-2.5">
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Todays Orders:</span>
              <span className="font-semibold">
                {data?.todays_statistics?.["Todays Orders"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Todays Delivery:
              </span>
              <span className="font-semibold">
                {data?.todays_statistics?.["Todays Delivery"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Todays Rescheduled:
              </span>
              <span className="font-semibold">
                {data?.todays_statistics?.["Todays Rescheduled"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Todays Cancellation:
              </span>
              <span className="font-semibold">
                {data?.todays_statistics?.["Todays Cancellation"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Open Tickets:</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Performance */}
      <Card className="shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Delivery Performance %
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <div className="flex justify-between items-center text-sm py-1">
            <span className="font-medium text-slate-700">Delivered:</span>
            <span className="font-semibold text-emerald-600">
              {data?.delivery_performance?.["Delivered Percentage"]?.toFixed(
                2
              ) || 0.0}{" "}
              %
            </span>
          </div>
          <div className="flex justify-between items-center text-sm py-1">
            <span className="font-medium text-slate-700">Cancelled:</span>
            <span className="font-semibold text-red-500">
              {data?.delivery_performance?.["Cancelled Percentage"]?.toFixed(
                2
              ) || 0.0}{" "}
              %
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
