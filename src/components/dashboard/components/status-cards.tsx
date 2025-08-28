"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Order Processing Card */}
      <Card className="bg-primary text-white shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-center text-white font-semibold text-sm">
            ORDER PROCESSING
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium opacity-90">
            <div>STATUS</div>
            <div>NOS</div>
            <div>AMOUNT</div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Order Placed</div>
              <div>0</div>
              <div>0</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Order Picked</div>
              <div>0</div>
              <div>0</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Order Verified</div>
              <div>0</div>
              <div>0</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1 font-medium">
              <div className="text-xs">Order Processing</div>
              <div>51</div>
              <div>51</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Dispatched Card */}
      <Card className="bg-primary text-white shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-center text-white font-semibold text-sm">
            ORDER DISPATCHED
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium opacity-90">
            <div>STATUS</div>
            <div>NOS</div>
            <div>AMOUNT</div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Received At Branch</div>
              <div>5</div>
              <div>11,550</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Out For Delivery</div>
              <div>40</div>
              <div>110,470</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Rescheduled</div>
              <div>47</div>
              <div>162,540</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Card */}
      <Card className="bg-primary text-white shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-center text-white font-semibold text-sm">
            ORDER STATUS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium opacity-90">
            <div>STATUS</div>
            <div>NOS</div>
            <div>AMOUNT</div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Delivered</div>
              <div>337</div>
              <div>972,110</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Cancelled</div>
              <div>6</div>
              <div>16,550</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-xs">Pending RTV</div>
              <div>5</div>
              <div>14,200</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
