"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth, Role, getRoleDashboardRoute } from "@/context/AuthContext";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { useFranchises } from "@/hooks/use-franchises";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, ChartColumn, ShoppingBag, Users } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth(pathname);
  }, [user, isLoading, pathname]);

  // Auto-redirect riders to their dashboard
  useEffect(() => {
    if (!isLoading && user && user.role === Role.YDM_Rider) {
      const riderDashboardRoute = getRoleDashboardRoute(user.role);
      router.push(riderDashboardRoute);
    }
  }, [user, isLoading, router]);

  const {
    franchises: fetchedFranchises,
    isLoading: isFranchiseLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useFranchises();

  const handleFranchiseAnalyticsClick = (franchiseId: number) => {
    router.push(`/dashboard/${franchiseId}`);
  };

  const handleFranchiseOrdersClick = (franchiseId: number) => {
    router.push(`/dashboard/${franchiseId}/orders`);
  };

  // Show loading skeleton while checking authentication
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Desktop Loading */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-16 w-48" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show loading skeleton while redirecting riders (instead of just text)
  if (user.role === Role.YDM_Rider) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>

        {/* Loading skeleton while redirecting */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-16 w-48" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:hidden space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={[Role.YDM_Logistics, Role.YDM_Operator]}>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Franchises
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Manage and view all franchise locations
              </p>
            </div>
            <Badge variant="secondary" className="text-sm w-fit">
              {fetchedFranchises?.length || 0} Total
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {(isFranchiseLoading || isRefetching) && (
          <>
            {/* Desktop Loading */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-16 w-48" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Loading */}
            <div className="md:hidden space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Failed to load franchises
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error?.message || "An unknown error occurred"}
            </p>
            <div className="mt-4">
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </div>
        )}

        {/* Franchises Display */}
        {!isFranchiseLoading && !isError && fetchedFranchises && (
          <>
            {fetchedFranchises.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No franchises found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No franchises available
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Card className="shadow-none">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-100">
                            <TableHead className="font-semibold">#</TableHead>
                            <TableHead className="font-semibold w-fit">
                              Franchise Name
                            </TableHead>
                            <TableHead className="font-semibold">
                              Contacts
                            </TableHead>
                            <TableHead className="font-semibold">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fetchedFranchises.map((franchise, index) => (
                            <TableRow
                              key={franchise.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-bold text-gray-900">
                                    {franchise.name}
                                    {franchise.new_order_count > 0 && (
                                      <span className="text-sm ml-2 font-semibold border-2 border-red-500 bg-red-500/60 text-white px-2 py-1 rounded-md w-fit">
                                        {franchise.new_order_count} New Orders
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-2">
                                  {franchise.franchise_contact_numbers.length >
                                  0 ? (
                                    franchise.franchise_contact_numbers.map(
                                      (contact, index) => (
                                        <a
                                          key={index}
                                          href={
                                            contact.phone_number
                                              ? `tel:${contact.phone_number}`
                                              : "#"
                                          }
                                          onClick={(e) => {
                                            if (!contact.phone_number) {
                                              e.preventDefault();
                                            }
                                          }}
                                          className={`${
                                            contact.phone_number
                                              ? "hover:text-blue-600 cursor-pointer"
                                              : "cursor-not-allowed"
                                          } transition-colors`}
                                        >
                                          <div className="text-md border rounded p-1 bg-gray-50 cursor-pointer">
                                            <div className="font-medium text-gray-700">
                                              {contact.first_name}{" "}
                                              {contact.last_name}
                                              <span className="text-gray-500 ml-2">
                                                {contact.phone_number ||
                                                  "No number"}
                                              </span>
                                            </div>
                                          </div>
                                        </a>
                                      )
                                    )
                                  ) : (
                                    <div className="text-xs text-gray-400 italic">
                                      No contacts
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFranchiseAnalyticsClick(franchise.id);
                                  }}
                                  className="flex items-center space-x-1"
                                >
                                  <ChartColumn className="h-4 w-4" />
                                  <span>Analytics</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFranchiseOrdersClick(franchise.id);
                                  }}
                                  className="flex items-center space-x-1"
                                >
                                  <ShoppingBag className="h-4 w-4" />
                                  <span>Orders</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {fetchedFranchises.map((franchise, index) => (
                    <Card
                      key={franchise.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                              {franchise.name}{" "}
                              {franchise.new_order_count > 0 && (
                                <span className="text-sm ml-2 font-semibold border-2 border-red-500 bg-red-500/60 text-white px-2 py-0.5 rounded-md w-fit">
                                  New Orders: {franchise.new_order_count}
                                </span>
                              )}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Contacts Section */}
                        <div>
                          <div className="flex items-center space-x-1 mb-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              Contacts (
                              {franchise.franchise_contact_numbers.length})
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                            {franchise.franchise_contact_numbers.length > 0 ? (
                              franchise.franchise_contact_numbers.map(
                                (contact, index) => (
                                  <a
                                    key={index}
                                    href={
                                      contact.phone_number
                                        ? `tel:${contact.phone_number}`
                                        : "#"
                                    }
                                    onClick={(e) => {
                                      if (!contact.phone_number) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className={`${
                                      contact.phone_number
                                        ? "hover:text-blue-600 cursor-pointer"
                                        : "cursor-not-allowed"
                                    } transition-colors`}
                                  >
                                    <div className="text-xs border rounded p-2 bg-gray-50">
                                      <div className="font-medium text-gray-700">
                                        {contact.first_name} {contact.last_name}
                                        <span className="text-gray-500 ml-2">
                                          {contact.phone_number || "No number"}
                                        </span>
                                      </div>
                                    </div>
                                  </a>
                                )
                              )
                            ) : (
                              <div className="text-xs text-gray-400 italic">
                                No contacts available
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          className="w-full mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFranchiseAnalyticsClick(franchise.id);
                          }}
                        >
                          View Dashboard
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </RoleGuard>
  );
}