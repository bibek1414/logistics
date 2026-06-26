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
} from "@/hooks/use-riders";
import DateRangePicker from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

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

  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);

  const startDateStr = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined;
  const endDateStr = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd")
    : undefined;

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
    startDateStr,
    endDateStr,
    !!decodedPhone
  );

  const {
    data: packageData,
    isLoading: isPackageLoading,
    isError: isPackageError,
    error: packageError,
    refetch: refetchPackages,
  } = useRiderPackageStats(
    decodedPhone,
    startDateStr,
    endDateStr,
    !!decodedPhone
  );

  const handleRetry = () => {
    refetchCommission();
    refetchPackages();
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
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-gray-200 pb-4">
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
            {rider && (
              <div className="text-xs text-gray-500 space-y-1 md:text-right">
                {rider.email && <div>Email: {rider.email}</div>}
                {rider.address && <div>Address: {rider.address}</div>}
                {rider.franchise && <div>Franchise: {rider.franchise}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Date Filter */}
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
            {/* Financial Performance Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                Financial Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium">
                    Period Earnings
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    Rs.{" "}
                    {(commissionData?.commission_earned || 0).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 1, maximumFractionDigits: 2 }
                    )}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium">
                    Remaining Balance
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    Rs.{" "}
                    {(commissionData?.remaining_balance || 0).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 1, maximumFractionDigits: 2 }
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

            {/* Delivery Performance Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                Delivery Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium">
                    Assigned (Period)
                  </div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {packageData?.packages_assigned || 0}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium">
                    Delivered (Period)
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
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
