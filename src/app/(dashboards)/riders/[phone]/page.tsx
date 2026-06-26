"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { useAuth, Role } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
  useRiders,
  useRiderCommissionStats,
  useRiderPackageStats,
  useRiderOrders,
  useRiderCommissionPayments,
} from "@/hooks/use-riders";
import DateRangePicker from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  params: Promise<{
    phone: string;
  }>;
}

export default function RiderStatsPage({ params }: PageProps) {
  const { phone } = use(params);
  const decodedPhone = decodeURIComponent(phone);
  const pathname = usePathname();
  const { user, isLoading: isAuthLoading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth(pathname);
  }, [user, isAuthLoading, pathname]);

  const [activeTab, setActiveTab] = useState<"today" | "all" | "commission">("today");

  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);

  // Active query dates computed from selected tab
  let activeStartDate: string | undefined = undefined;
  let activeEndDate: string | undefined = undefined;

  if (activeTab === "today") {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    activeStartDate = todayStr;
    activeEndDate = todayStr;
  } else if (activeTab === "all") {
    activeStartDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
    activeEndDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
  }

  // Fetch Rider details
  const { data: ridersData, isLoading: isRiderLoading } = useRiders({
    search: decodedPhone,
  });
  const rider =
    ridersData?.results?.find((r) => r.phone_number === decodedPhone) ||
    ridersData?.results?.[0];

  // Fetch stats
  const {
    data: commissionData,
    isLoading: isCommissionLoading,
    isError: isCommissionError,
    error: commissionError,
    refetch: refetchCommission,
  } = useRiderCommissionStats(
    decodedPhone,
    activeStartDate,
    activeEndDate,
    !!decodedPhone,
  );

  const {
    data: packageData,
    isLoading: isPackageLoading,
    isError: isPackageError,
    error: packageError,
    refetch: refetchPackages,
  } = useRiderPackageStats(
    decodedPhone,
    activeStartDate,
    activeEndDate,
    !!decodedPhone,
  );

  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPageSize = 10;

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
    refetch: refetchOrders,
  } = useRiderOrders(
    decodedPhone,
    ordersPage,
    ordersPageSize,
    activeStartDate,
    activeEndDate,
    !!decodedPhone
  );

  const [paymentsPage, setPaymentsPage] = useState(1);
  const paymentsPageSize = 10;

  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
    error: paymentsError,
    refetch: refetchPayments,
  } = useRiderCommissionPayments(
    decodedPhone,
    paymentsPage,
    paymentsPageSize,
    activeTab === "commission"
  );

  const handleRetry = () => {
    refetchCommission();
    refetchPackages();
    refetchOrders();
    refetchPayments();
  };

  const handleClearDates = () => {
    setDateRange(undefined);
  };

  if (isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isStatsLoading =
    isCommissionLoading || isPackageLoading || isRiderLoading;
  const isAnyError = isCommissionError || isPackageError;

  return (
    <RoleGuard allowedRoles={[Role.YDM_Logistics, Role.YDM_Operator]}>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10 bg-white">
        {/* Navigation / Header */}
        <div className="space-y-4">
          <Link
            href="/riders"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Riders
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {rider
                  ? `${rider.first_name} ${rider.last_name}`
                  : "Rider Stats"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Rider phone: {decodedPhone}
              </p>
            </div>

            {/* Dynamic Preset Tabs */}
            <div className="flex space-x-4 border-b border-transparent">
              <button
                onClick={() => {
                  setActiveTab("today");
                  setOrdersPage(1);
                  setPaymentsPage(1);
                }}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none cursor-pointer ${
                  activeTab === "today"
                    ? "border-black text-black font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Today's Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setOrdersPage(1);
                  setPaymentsPage(1);
                }}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none cursor-pointer ${
                  activeTab === "all"
                    ? "border-black text-black font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab("commission");
                  setOrdersPage(1);
                  setPaymentsPage(1);
                }}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none cursor-pointer ${
                  activeTab === "commission"
                    ? "border-black text-black font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Commission Tracking
              </button>
            </div>

            {rider && (
              <div className="text-xs text-gray-500 space-y-1 md:text-right">
                {rider.email && <div>Email: {rider.email}</div>}
                {rider.address && <div>Address: {rider.address}</div>}
                {rider.franchise && <div>Franchise: {rider.franchise}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Date Filter (All Orders tab only) */}
        {activeTab === "all" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="text-sm font-medium text-gray-700">
              Filter by Date Range
            </div>
            <div className="flex items-center gap-2">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              {dateRange?.from && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearDates}
                  className="h-10 text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Data Display */}
        {isStatsLoading ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        ) : isAnyError ? (
          <div className="p-8 border border-red-200 rounded-lg bg-red-50/20 text-center space-y-3">
            <div className="font-semibold text-gray-900">
              Failed to load statistics
            </div>
            <p className="text-sm text-gray-500">
              {commissionError?.message ||
                packageError?.message ||
                "An error occurred while loading rider details."}
            </p>
            <Button onClick={handleRetry} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Financial Performance Section (Commission Tracking only) */}
            {activeTab === "commission" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Financial Performance
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 font-medium">
                        Remaining Balance
                      </div>
                      <div className="text-xl font-bold text-gray-900 mt-1">
                        Rs.{" "}
                        {(commissionData?.remaining_balance || 0).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 1, maximumFractionDigits: 2 },
                        )}
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 font-medium">
                        Lifetime Earned
                      </div>
                      <div className="text-xl font-bold text-gray-900 mt-1">
                        Rs.{" "}
                        {(
                          commissionData?.lifetime_commission_earned || 0
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-500 font-medium">
                        Lifetime Paid
                      </div>
                      <div className="text-xl font-bold text-gray-900 mt-1">
                        Rs.{" "}
                        {(
                          commissionData?.lifetime_commission_paid || 0
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paid Commission History Table */}
                <div className="space-y-4 pt-4">
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
                    <p className="text-sm text-gray-500 py-4">
                      No paid commission history found.
                    </p>
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

            {/* Delivery Performance Section (Today and All Orders) */}
            {(activeTab === "today" || activeTab === "all") && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Delivery Performance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">
                      Assigned
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.packages_assigned || 0}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">
                      Delivered
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.packages_delivered || 0}
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">
                      Lifetime Delivered
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {packageData?.total_packages_delivered_lifetime || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assigned Orders Section (Today and All Orders) */}
            {(activeTab === "today" || activeTab === "all") && (
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Assigned Orders
                </h2>
                {isOrdersLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : isOrdersError ? (
                  <p className="text-sm text-red-500">
                    Failed to load orders: {ordersError?.message}
                  </p>
                ) : !ordersData?.results || ordersData.results.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">
                    No assigned orders found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">S.N.</TableHead>
                            <TableHead>Order Code</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Delivery Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Collection Amount</TableHead>
                            <TableHead className="w-20 text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ordersData.results.map((order, index) => {
                            const serialNumber =
                              (ordersPage - 1) * ordersPageSize + index + 1;
                            const collectionAmount =
                              parseFloat(order.total_amount?.toString() ?? "0") -
                              parseFloat(order.prepaid_amount?.toString() ?? "0");
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium text-gray-600">
                                  {serialNumber}
                                </TableCell>
                                <TableCell className="font-medium">
                                  <Link
                                    href={`/track-order/${order.order_code}`}
                                    className="text-primary hover:underline"
                                  >
                                    {order.order_code}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-gray-900">
                                  {order.full_name}
                                </TableCell>
                                <TableCell className="text-gray-700">
                                  {order.phone_number}
                                </TableCell>
                                <TableCell
                                  className="max-w-xs text-gray-700 truncate"
                                  title={order.delivery_address}
                                >
                                  {order.delivery_address}
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="font-medium text-gray-800">
                                    {order.order_status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-gray-900">
                                  Rs. {collectionAmount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link href={`/track-order/${order.order_code}`}>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 hover:bg-gray-100"
                                    >
                                      <Eye className="h-4 w-4 text-gray-600" />
                                      <span className="sr-only">
                                        View Details
                                      </span>
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {Math.ceil(ordersData.count / ordersPageSize) > 1 && (
                      <div className="flex items-center justify-between py-2">
                        <div className="text-xs text-gray-500">
                          Showing {(ordersPage - 1) * ordersPageSize + 1} to{" "}
                          {Math.min(
                            ordersPage * ordersPageSize,
                            ordersData.count,
                          )}{" "}
                          of {ordersData.count} orders
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setOrdersPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={ordersPage === 1}
                            className="h-8 text-xs gap-1"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" /> Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setOrdersPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(ordersData.count / ordersPageSize),
                                ),
                              )
                            }
                            disabled={
                              ordersPage ===
                              Math.ceil(ordersData.count / ordersPageSize)
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
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
