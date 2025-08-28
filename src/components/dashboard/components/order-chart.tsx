"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { date: "2025-08-21", value: 74 },
  { date: "2025-08-22", value: 84 },
  { date: "2025-08-23", value: 34 },
  { date: "2025-08-24", value: 103 },
  { date: "2025-08-25", value: 70 },
  { date: "2025-08-26", value: 53 },
  { date: "2025-08-27", value: 86 },
];

export function OrderChart() {
  return (
    <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
      <CardHeader className="bg-primary text-white py-3">
        <CardTitle className="text-center font-semibold text-sm">
          Daily Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value.split("-")[2]}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
