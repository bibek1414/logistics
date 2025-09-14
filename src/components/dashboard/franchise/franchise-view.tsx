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
} from "lucide-react";
import { useAssignRider, useReassignRider } from "@/hooks/use-riders";
import { useVerifyOrder } from "@/hooks/use-verify-order";

import { OrderFilters } from "./components/order-filters";
import { BulkAssignment } from "./components/bulk-assignment";
import { BulkVerification } from "./components/bulk-verification";
import { OrdersTable } from "./components/orders-table";
import { useFranchise } from "@/hooks/use-franchises";
import { FranchiseFilters } from "@/services/franchise";
import { useDebounce } from "@/hooks/use-debounce";

export default function FranchiseView({ id }: { id: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchOrder, setSearchOrder] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [filterDeliveryType, setFilterDeliveryType] = useState("all");
  const [filterIsAssigned, setFilterIsAssigned] = useState("all");
  const debouncedSearchOrder = useDebounce(searchOrder, 500);

  // Build filters for API
  const filters: FranchiseFilters = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      search: debouncedSearchOrder || undefined,
      orderStatus: filterStatus !== "all" ? filterStatus : undefined,
      deliveryType:
        filterDeliveryType !== "all" ? filterDeliveryType : undefined,
      startDate: dateRange.from || undefined,
      endDate: dateRange.to || undefined,
      isAssigned: filterIsAssigned !== "all" ? filterIsAssigned : undefined,
    }),
    [
      currentPage,
      pageSize,
      debouncedSearchOrder,
      filterStatus,
      filterDeliveryType,
      dateRange,
      filterIsAssigned,
    ]
  );

  // Fetch data using the hook
  const { franchise, isLoading, isError, error } = useFranchise(id, filters);

  const { mutate: assignRider } = useAssignRider();
  const { mutate: reassignRider } = useReassignRider();
  const { mutate: verifyOrder, isLoading: isVerifyingOrder } = useVerifyOrder();
  const [orderAssignments, setOrderAssignments] = useState<
    Record<string, string>
  >({});
  const [assigningOrders, setAssigningOrders] = useState<Set<string>>(
    new Set()
  );
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(
    null
  );
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkAssignAgent, setBulkAssignAgent] = useState("");
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);
  const [verifyingOrders, setVerifyingOrders] = useState<Set<string>>(
    new Set()
  );
  const [isBulkVerifying, setIsBulkVerifying] = useState(false);

  const orders = franchise?.results || [];
  const totalCount = franchise?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleAssignOrder = async (orderId: string, riderId: string) => {
    if (!riderId) return;

    setAssigningOrders((prev) => new Set([...prev, orderId]));

    try {
      const order = orders.find((o) => o.id.toString() === orderId);
      const hasExistingAssignment = Boolean(
        orderAssignments[orderId] || order?.ydm_rider
      );

      await new Promise((resolve) => {
        const mutation = hasExistingAssignment ? reassignRider : assignRider;
        mutation(
          { orders: [orderId], rider: riderId },
          {
            onSuccess: () => {
              setOrderAssignments((prev) => ({ ...prev, [orderId]: riderId }));
              setAssignmentSuccess(orderId);
              setTimeout(() => setAssignmentSuccess(null), 2000);
              resolve(true);
            },
            onError: (error) => {
              console.error(
                hasExistingAssignment
                  ? "Re-assignment failed:"
                  : "Assignment failed:",
                error
              );
              resolve(false);
            },
          }
        );
      });
    } finally {
      setAssigningOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleBulkAssignment = async () => {
    if (!bulkAssignAgent || selectedOrders.size === 0) return;

    setIsBulkAssigning(true);

    try {
      const orderIds = Array.from(selectedOrders);
      const toReassign: string[] = [];
      const toAssign: string[] = [];

      orderIds.forEach((oid) => {
        const order = orders.find((o) => o.id.toString() === oid);
        const hasExisting = Boolean(orderAssignments[oid] || order?.ydm_rider);
        if (hasExisting) {
          toReassign.push(oid);
        } else {
          toAssign.push(oid);
        }
      });

      await new Promise((resolve) => {
        const done: { count: number } = { count: 0 };
        const totalMutations =
          (toAssign.length ? 1 : 0) + (toReassign.length ? 1 : 0);

        const finalize = () => {
          done.count += 1;
          if (done.count >= totalMutations || totalMutations === 0) {
            resolve(true);
          }
        };

        if (toAssign.length) {
          assignRider(
            { orders: toAssign, rider: bulkAssignAgent },
            {
              onSuccess: finalize,
              onError: (error) => {
                console.error("Bulk assignment (assign) failed:", error);
                finalize();
              },
            }
          );
        }

        if (toReassign.length) {
          reassignRider(
            { orders: toReassign, rider: bulkAssignAgent },
            {
              onSuccess: finalize,
              onError: (error) => {
                console.error("Bulk assignment (reassign) failed:", error);
                finalize();
              },
            }
          );
        }
      });

      const newAssignments = { ...orderAssignments };
      selectedOrders.forEach((orderId) => {
        newAssignments[orderId] = bulkAssignAgent;
      });
      setOrderAssignments(newAssignments);
      setAssignmentSuccess(`${selectedOrders.size} orders`);
      setSelectedOrders(new Set());
      setBulkAssignAgent("");
      setTimeout(() => setAssignmentSuccess(null), 2000);
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const handleVerifyOrder = async (orderId: string, status: string) => {
    setVerifyingOrders((prev) => new Set([...prev, orderId]));

    try {
      await new Promise((resolve) => {
        verifyOrder(
          { order_ids: [parseInt(orderId)], status },
          {
            onSuccess: () => {
              setAssignmentSuccess(
                `Order ${orderId} ${status.toLowerCase()} successfully!`
              );
              setTimeout(() => setAssignmentSuccess(null), 2000);
              resolve(true);
            },
            onError: (error) => {
              console.error("Verification failed:", error);
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
              setAssignmentSuccess(
                `${
                  selectedOrders.size
                } orders ${status.toLowerCase()} successfully!`
              );
              setSelectedOrders(new Set());
              setTimeout(() => setAssignmentSuccess(null), 2000);
              resolve(true);
            },
            onError: (error) => {
              console.error("Bulk verification failed:", error);
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

  const hasActiveFilters = () => {
    return (
      searchOrder !== "" ||
      filterStatus !== "all" ||
      dateRange.from !== "" ||
      dateRange.to !== "" ||
      filterDeliveryType !== "all" ||
      filterIsAssigned !== "all"
    );
  };

  const clearAllFilters = () => {
    setSearchOrder("");
    setFilterStatus("all");
    setDateRange({ from: "", to: "" });
    setFilterDeliveryType("all");
    setFilterIsAssigned("all");
    setCurrentPage(1);
  };

  if (isError) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading orders</div>
          <div className="text-sm text-gray-600">{error?.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <BulkAssignment
            selectedOrders={selectedOrders}
            bulkAssignAgent={bulkAssignAgent}
            setBulkAssignAgent={setBulkAssignAgent}
            isBulkAssigning={isBulkAssigning}
            handleBulkAssignment={handleBulkAssignment}
          />
        </div>

        <BulkVerification
          selectedOrders={selectedOrders}
          isBulkVerifying={isBulkVerifying}
          onBulkVerify={handleBulkVerification}
        />

        {assignmentSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm font-medium">
              {assignmentSuccess.includes("orders")
                ? `${assignmentSuccess} assigned successfully!`
                : `Order ${assignmentSuccess} assigned successfully!`}
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
                  <Package className="w-5 h-5 text-primary" />
                  Order Assignment Center
                </CardTitle>
              </div>
              <OrderFilters
                searchOrder={searchOrder}
                setSearchOrder={setSearchOrder}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                dateRange={dateRange}
                setDateRange={setDateRange}
                filterDeliveryType={filterDeliveryType}
                setFilterDeliveryType={setFilterDeliveryType}
                hasActiveFilters={hasActiveFilters}
                clearAllFilters={clearAllFilters}
                filterIsAssigned={filterIsAssigned}
                setFilterIsAssigned={setFilterIsAssigned}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
              Showing {orders.length} of {totalCount} orders
              {(dateRange.from || dateRange.to) && (
                <span>
                  {" • Date: "}
                  {dateRange.from && dateRange.to
                    ? `${dateRange.from} to ${dateRange.to}`
                    : dateRange.from
                    ? `from ${dateRange.from}`
                    : `until ${dateRange.to}`}
                </span>
              )}
              {filterDeliveryType !== "all" && ` • ${filterDeliveryType}`}
              {filterStatus !== "all" && ` • Status: ${filterStatus}`}
              {filterIsAssigned !== "all" && ` • Assigned: ${filterIsAssigned}`}
            </div>

            {isLoading ? (
              <div className="p-6 flex items-center justify-center min-h-[200px]">
                <Clock className="w-5 h-5 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-600">Loading orders...</span>
              </div>
            ) : (
              <OrdersTable
                orders={orders}
                currentPage={currentPage}
                pageSize={pageSize}
                selectedOrders={selectedOrders}
                toggleOrderSelection={toggleOrderSelection}
                toggleAllOrders={toggleAllOrders}
                orderAssignments={orderAssignments}
                assigningOrders={assigningOrders}
                handleAssignOrder={handleAssignOrder}
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
