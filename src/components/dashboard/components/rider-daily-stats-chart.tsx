"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import { useRiderDailyStats } from "@/hooks/use-riders";
import { format, subDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    let formattedDate = label || "";
    try {
      if (label) {
        const date = new Date(label);
        formattedDate = date.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    } catch (e) {
      // fallback
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40">
        <div className="text-sm font-semibold text-gray-900 mb-2 border-b pb-1">
          {formattedDate}
        </div>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-8 text-xs"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700">{entry.name}:</span>
              </div>
              <span className="font-medium text-gray-900">
                {entry.value || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function RiderDailyStatsChart({ riderPhone }: { riderPhone: string }) {
  // Default to last 7 days
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(() => {
    const to = new Date();
    const from = subDays(to, 7);
    return { from, to };
  });

  const startDateStr = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDateStr = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { data, isLoading, isError, error, refetch, isRefetching } = useRiderDailyStats(
    riderPhone,
    startDateStr,
    endDateStr,
    !!riderPhone
  );

  const handleClearDates = () => {
    setDateRange(undefined);
  };

  return (
    <Card className="border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 bg-gray-50/50">
        <div>
          <CardTitle className="text-base font-bold text-gray-900">
            Rider Daily Performance
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Daily delivered and returned order counts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          {dateRange && (dateRange.from || dateRange.to) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearDates}
              className="h-10 text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6 relative">
        {isRefetching && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            Loading chart...
          </div>
        ) : isError ? (
          <div className="h-64 flex flex-col items-center justify-center text-red-500 gap-2">
            <span>Failed to load chart data: {error?.message || "Unknown error"}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            No delivery data found for the selected period
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => {
                    try {
                      const dateParts = value.split("-");
                      if (dateParts.length === 3) {
                        const d = new Date(value);
                        return format(d, "MMM dd");
                      }
                    } catch (e) {
                      // ignore
                    }
                    return value;
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="delivered_count"
                  fill="#10B981"
                  name="Delivered Orders"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="returned_count"
                  fill="#EF4444"
                  name="Returned Orders"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
