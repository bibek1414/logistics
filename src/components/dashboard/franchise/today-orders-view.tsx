"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useVerifyOrder } from "@/hooks/use-verify-order";

import { OrdersTable } from "./components/orders-table";
import { BulkVerification } from "./components/bulk-verification";
import { useFranchise } from "@/hooks/use-franchises";
import { FranchiseFilters } from "@/services/franchise";
import { useDebounce } from "@/hooks/use-debounce";

export default function TodayOrdersView({ id }: { id: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchOrder, setSearchOrder] = useState("");
  const debouncedSearchOrder = useDebounce(searchOrder, 500);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Build filters for API - only show today's "Sent to YDM" orders
  const filters: FranchiseFilters = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      search: debouncedSearchOrder || undefined,
      orderStatus: "Sent to YDM", // Fixed to only show "Sent to YDM" status
      startDate: today,
      endDate: today,
      isAssigned: undefined,
      deliveryType: undefined,
    }),
    [currentPage, pageSize, debouncedSearchOrder, today]
  );

  // Fetch data using the hook
  const { franchise, isLoading, isError, error } = useFranchise(id, filters);

  const { mutate: verifyOrder, isLoading: isVerifyingOrder } = useVerifyOrder();
  
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [verifyingOrders, setVerifyingOrders] = useState<Set<string>>(
    new Set()
  );
  const [isBulkVerifying, setIsBulkVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(
    null
  );

  const orders = franchise?.results || [];
  const totalCount = franchise?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // All selected orders can be verified since they all have "Sent to YDM" status
  const canBulkVerify = selectedOrders.size > 0;

  const handleVerifyOrder = async (orderId: string, status: string) => {
    setVerifyingOrders((prev) => new Set([...prev, orderId]));

    try {
      await new Promise((resolve) => {
        verifyOrder(
          { order_ids: [parseInt(orderId)], status },
          {
            onSuccess: () => {
              setVerificationSuccess(
                `Order ${orderId} ${status.toLowerCase()} successfully!`
              );
              setTimeout(() => setVerificationSuccess(null), 2000);
              resolve(true);
            },
            onError: (error) => {
              console.error("Verification failed:", error);
              setVerificationSuccess(`Failed to update order ${orderId}`);
              setTimeout(() => setVerificationSuccess(null), 3000);
              resolve(false);
            },
          }
        );
      });
    } finally {
      setVerifyingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleBulkVerification = async (status: string) => {
    if (selectedOrders.size === 0) return;

    setIsBulkVerifying(true);

    try {
      const orderIds = Array.from(selectedOrders).map((id) => parseInt(id));

      await new Promise((resolve) => {
        verifyOrder(
          { order_ids: orderIds, status },
          {
            onSuccess: () => {
              const statusText = status === "Return Pending" ? "marked as return pending" : status.toLowerCase();
              setVerificationSuccess(
                `${selectedOrders.size} orders ${statusText} successfully!`
              );
              setSelectedOrders(new Set());
              setTimeout(() => setVerificationSuccess(null), 2000);
              resolve(true);
            },
            onError: (error) => {
              console.error("Bulk verification failed:", error);
              setVerificationSuccess("Bulk verification failed. Please try again.");
              setTimeout(() => setVerificationSuccess(null), 3000);
              resolve(false);
            },
          }
        );
      });
    } finally {
      setIsBulkVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent to ydm":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "verified":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "returned by customer":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "return pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "returned by ydm":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "out for delivery":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "rescheduled":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleAllOrders = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map((order) => order.id.toString())));
    }
  };

  if (isError) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading today&apos;s orders</div>
          <div className="text-sm text-gray-600">{error?.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Bulk verification controls */}
        {canBulkVerify && (
          <BulkVerification
            selectedOrders={selectedOrders}
            isBulkVerifying={isBulkVerifying}
            onBulkVerify={handleBulkVerification}
          />
        )}

        {/* Success/Error messages */}
        {verificationSuccess && (
          <div className={`border rounded-lg p-3 flex items-center gap-2 ${
            verificationSuccess.includes("Failed") || verificationSuccess.includes("failed")
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}>
            <CheckCircle className={`w-5 h-5 ${
              verificationSuccess.includes("Failed") || verificationSuccess.includes("failed")
                ? "text-red-600"
                : "text-green-600"
            }`} />
            <span className={`text-sm font-medium ${
              verificationSuccess.includes("Failed") || verificationSuccess.includes("failed")
                ? "text-red-800"
                : "text-green-800"
            }`}>
              {verificationSuccess}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today&apos;s Orders - Sent to YDM
                </CardTitle>
              </div>
              
              {/* Simple search for today's orders */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by order code, customer name, or phone..."
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
              Showing {orders.length} of {totalCount} orders sent to YDM today ({today})
            </div>

            {isLoading ? (
              <div className="p-6 flex items-center justify-center min-h-[200px]">
                <Clock className="w-5 h-5 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-600">Loading today&apos;s orders...</span>
              </div>
            ) : (
              <OrdersTable
                orders={orders}
                currentPage={currentPage}
                pageSize={pageSize}
                selectedOrders={selectedOrders}
                toggleOrderSelection={toggleOrderSelection}
                toggleAllOrders={toggleAllOrders}
                orderAssignments={{}} 
                assigningOrders={new Set()} 
                handleAssignOrder={() => {}} 
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                onVerifyOrder={handleVerifyOrder}
                verifyingOrders={verifyingOrders}
              />
            )}

            {totalPages > 1 && !isLoading && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({totalCount} total orders)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}