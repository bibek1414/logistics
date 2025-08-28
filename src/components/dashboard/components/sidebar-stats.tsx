"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SidebarStats() {
  return (
    <div className="space-y-4">
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
        Create Order
      </Button>

      {/* Order Summary */}
      <Card className="shadow-lg border-0 rounded-xl">
        <CardContent className="p-4 space-y-2.5">
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Total Orders:</span>
              <span className="font-semibold">503</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Total COD:</span>
              <span className="font-semibold">Rs.972,110</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">Total RTV:</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Total Delivery Charge:
              </span>
              <span className="font-semibold">Rs.46,210</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Total Pending COD:
              </span>
              <span className="font-semibold">Rs.825,800</span>
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
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Todays Delivery:
              </span>
              <span className="font-semibold">10</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Todays Rescheduled:
              </span>
              <span className="font-semibold">14</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-slate-700">
                Todays Cancellation:
              </span>
              <span className="font-semibold">1</span>
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
            <span className="font-semibold text-emerald-600">96.56 %</span>
          </div>
          <div className="flex justify-between items-center text-sm py-1">
            <span className="font-medium text-slate-700">Cancelled:</span>
            <span className="font-semibold text-red-500">3.44 %</span>
          </div>
        </CardContent>
      </Card>

      {/* Station Order Status */}
      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-primary text-white py-3">
          <CardTitle className="text-center text-sm font-semibold">
            Station Order Status (%)
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
