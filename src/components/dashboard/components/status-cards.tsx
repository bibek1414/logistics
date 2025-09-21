"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useRouter } from "next/navigation";

export function StatusCards({ id }: { id: number }) {
  const { stats, isLoading: isLoadingStats } = useDashboardStats(id);
  const router = useRouter();
  if (isLoadingStats) {
    return <div>Loading...</div>;
  }

  // Helper function to format amount
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };
  const statusMapping: Record<string, string> = {
    "Order Placed": "Order Placed",
    "Order Verified": "Verified",
    "Out For Delivery": "Out For Delivery",
    Rescheduled: "Rescheduled",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
    "Pending RTV": "Return Pending",
  };

  const handleStatusClick = (status: string) => {
    const filterValue = statusMapping[status] || status;
    const ordersUrl = `/dashboard/${id}/orders?status=${encodeURIComponent(
      filterValue
    )}`;
    router.push(ordersUrl);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Order Processing Card */}
      <Card className="bg-primary text-white shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-center text-white font-semibold text-sm">
            ORDER PROCESSING
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium opacity-90">
            <div>STATUS</div>
            <div>NOS</div>
            <div>AMOUNT</div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Sent to YDM")}
            >
              <div className="text-xs">Order Placed</div>
              <div>
                {stats?.data?.order_processing?.["Order Placed"]?.nos || 0}
              </div>
              <div>
                {formatAmount(
                  stats?.data?.order_processing?.["Order Placed"]?.amount || 0
                )}
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Verified")}
            >
              <div className="text-xs">Order Verified</div>
              <div>
                {stats?.data?.order_processing?.["Order Verified"]?.nos || 0}
              </div>
              <div>
                {formatAmount(
                  stats?.data?.order_processing?.["Order Verified"]?.amount || 0
                )}
              </div>
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
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium opacity-90">
            <div>STATUS</div>
            <div>NOS</div>
            <div>AMOUNT</div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Out For Delivery")}
            >
              <div className="text-xs">Out For Delivery</div>
              <div>
                {stats?.data?.order_dispatched?.["Out For Delivery"]?.nos || 0}
              </div>
              <div>
                {formatAmount(
                  stats?.data?.order_dispatched?.["Out For Delivery"]?.amount ||
                    0
                )}
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Rescheduled")}
            >
              <div className="text-xs">Rescheduled</div>
              <div>
                {stats?.data?.order_dispatched?.["Rescheduled"]?.nos || 0}
              </div>
              <div>
                {formatAmount(
                  stats?.data?.order_dispatched?.["Rescheduled"]?.amount || 0
                )}
              </div>
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
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium opacity-90">
            <div>STATUS</div>
            <div>NOS</div>
            <div>AMOUNT</div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Delivered")}
            >
              <div className="text-xs">Delivered</div>
              <div>{stats?.data?.order_status?.["Delivered"]?.nos || 0}</div>
              <div>
                {formatAmount(
                  stats?.data?.order_status?.["Delivered"]?.amount || 0
                )}
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Cancelled")}
            >
              <div className="text-xs">Cancelled</div>
              <div>{stats?.data?.order_status?.["Cancelled"]?.nos || 0}</div>
              <div>
                {formatAmount(
                  stats?.data?.order_status?.["Cancelled"]?.amount || 0
                )}
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-2"
              onClick={() => handleStatusClick("Return Pending")}
            >
              <div className="text-xs">Pending RTV</div>
              <div>{stats?.data?.order_status?.["Pending RTV"]?.nos || 0}</div>
              <div>
                {formatAmount(
                  stats?.data?.order_status?.["Pending RTV"]?.amount || 0
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
