"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { useAuth, Role } from "@/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useRiderCommissionStats,
  useRiderPackageStats,
  useRiderCommissionPayments,
} from "@/hooks/use-riders";
import { useYDMRiderOrders, useYDMRiderOrderMutations } from "@/hooks/use-ydm-riders";
import { useOrderFilters } from "@/hooks/use-order-filter";
import DateRangePicker from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { YDMRiderOrderList } from "@/components/ydm-rider/rider-order-list";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AllOrdersPageContent() {
  const pathname = usePathname();
  const { user, requireAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    requireAuth(pathname);
  }, [user, pathname]);

  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam === "all" || tabParam === "commission"
      ? tabParam
      : "all";

  const setActiveTab = (tab: "all" | "commission") => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);

  const activeStartDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const activeEndDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { filters, handleFiltersChange } = useOrderFilters();

  // Fetch all orders for rider
  const {
    data: ordersResponse,
    isLoading: loading,
    error,
    refetch
  } = useYDMRiderOrders({
    page: filters.page,
    pageSize: filters.pageSize,
    search: filters.search,
    orderStatus: filters.orderStatus,
    startDate: activeStartDate,
    endDate: activeEndDate,
    enabled: activeTab === "all",
  });

  // Fetch package stats for rider
  const { data: packageData, isLoading: isPackageStatsLoading } = useRiderPackageStats(
    undefined,
    activeStartDate,
    activeEndDate,
    activeTab === "all"
  );

  // Fetch commission stats for rider
  const { data: commissionData, isLoading: isCommissionLoading } = useRiderCommissionStats(
    undefined,
    undefined,
    undefined,
    activeTab === "commission"
  );

  const [paymentsPage, setPaymentsPage] = useState(1);
  const paymentsPageSize = 10;

  // Fetch payouts history for rider
  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
    error: paymentsError,
  } = useRiderCommissionPayments(
    undefined,
    paymentsPage,
    paymentsPageSize,
    activeTab === "commission"
  );

  const { updateOrderStatusMutation, verifyOrderMutation } = useYDMRiderOrderMutations({
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["rider-package-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rider-commission-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rider-commission-payments"] });
    },
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string, comment?: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        newStatus,
        comment
      });
    } catch (err) {
      throw err;
    }
  };

  const handleVerifyOrder = async (orderCode: string) => {
    try {
      await verifyOrderMutation.mutateAsync(orderCode);
    } catch (err) {
      throw err;
    }
  };

  const orders = ordersResponse?.results || [];
  const totalCount = ordersResponse?.count || 0;
  const errorMessage = error?.message || updateOrderStatusMutation.error?.message || verifyOrderMutation.error?.message || null;

  return (
    <RoleGuard allowedRoles={[Role.YDM_Rider]}>
      <div className="max-w-7xl px-4 mx-auto p-4 space-y-6">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            All Rider Performance & Commission
          </h1>
          <p className="text-sm text-gray-500">
            Track orders history, delivery performance, and commission tracking.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "commission"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Commission Tracking
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "all" && (
          <div className="space-y-6">
            {/* Date and Status filter */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Filter Orders</h3>
                <p className="text-xs text-gray-500 mt-0.5">Filter by date range and delivery status.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                />
                <Select
                  value={filters.orderStatus}
                  onValueChange={(val) => handleFiltersChange({ orderStatus: val })}
                >
                  <SelectTrigger className="w-full sm:w-48 bg-white border border-gray-200 text-sm font-medium text-gray-700 cursor-pointer">
                    <SelectValue placeholder="All Orders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="all">All Orders</SelectItem>
                    <SelectItem className="cursor-pointer" value="Out For Delivery">Out For Delivery</SelectItem>
                    <SelectItem className="cursor-pointer" value="Delivered">Delivered</SelectItem>
                    <SelectItem className="cursor-pointer" value="Rescheduled">Rescheduled</SelectItem>
                    <SelectItem className="cursor-pointer" value="Return Pending">Return Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Delivery Performance */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                Delivery Performance
              </h2>
              {isPackageStatsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Assigned</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.packages_assigned || 0}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Delivered</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.packages_delivered || 0}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Lifetime Delivered</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.total_packages_delivered_lifetime || 0}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Lifetime Cancelled</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.total_packages_cancelled_lifetime || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Orders List */}
            <YDMRiderOrderList
              orders={orders}
              loading={loading || updateOrderStatusMutation.isPending || verifyOrderMutation.isPending}
              error={errorMessage}
              totalCount={totalCount}
              currentPage={filters.page}
              pageSize={filters.pageSize}
              onFiltersChange={handleFiltersChange}
              onStatusUpdate={handleStatusUpdate}
              onVerifyOrder={handleVerifyOrder}
            />
          </div>
        )}

        {activeTab === "commission" && (
          <div className="space-y-6">
            {/* Financial Performance */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                Financial Performance
              </h2>
              {isCommissionLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Remaining Balance</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      Rs.{" "}
                      {(commissionData?.remaining_balance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Lifetime Earned</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      Rs.{" "}
                      {(commissionData?.lifetime_commission_earned || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Lifetime Paid</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      Rs.{" "}
                      {(commissionData?.lifetime_commission_paid || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Paid Commission History */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                Paid Commission History
              </h2>
              {isPaymentsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : isPaymentsError ? (
                <p className="text-sm text-red-500">
                  Failed to load commission history: {paymentsError?.message}
                </p>
              ) : !paymentsData?.results || paymentsData.results.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No paid commission history found.</p>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">S.N.</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Paid At</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentsData.results.map((payment, index) => {
                          const serialNumber =
                            (paymentsPage - 1) * paymentsPageSize + index + 1;
                          
                          let formattedDate = payment.paid_at;
                          try {
                            formattedDate = format(new Date(payment.paid_at), "yyyy-MM-dd hh:mm a");
                          } catch (e) {
                            // fallback
                          }

                          return (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium text-gray-600">
                                {serialNumber}
                              </TableCell>
                              <TableCell className="font-medium text-gray-900">
                                Rs. {parseFloat(payment.amount).toLocaleString(undefined, {
                                  minimumFractionDigits: 1,
                                  maximumFractionDigits: 2,
                                })}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {formattedDate}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {payment.remarks || "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {Math.ceil(paymentsData.count / paymentsPageSize) > 1 && (
                    <div className="flex items-center justify-between py-2">
                      <div className="text-xs text-gray-500">
                        Showing {(paymentsPage - 1) * paymentsPageSize + 1} to{" "}
                        {Math.min(
                          paymentsPage * paymentsPageSize,
                          paymentsData.count,
                        )}{" "}
                        of {paymentsData.count} payments
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPaymentsPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={paymentsPage === 1}
                          className="h-8 text-xs gap-1"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" /> Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPaymentsPage((prev) =>
                              Math.min(
                                prev + 1,
                                Math.ceil(paymentsData.count / paymentsPageSize),
                              ),
                            )
                          }
                          disabled={
                            paymentsPage ===
                            Math.ceil(paymentsData.count / paymentsPageSize)
                          }
                          className="h-8 text-xs gap-1"
                        >
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

export default function AllOrdersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl px-4 mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
      </div>
    }>
      <AllOrdersPageContent />
    </Suspense>
  );
}
