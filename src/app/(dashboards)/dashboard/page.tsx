
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth, Role, getRoleDashboardRoute } from "@/context/AuthContext";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { useFranchises } from "@/hooks/use-franchises";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

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

  const handleFranchiseClick = (franchiseId: number) => {
    router.push(`/dashboard/${franchiseId}`);
  };

  if (isLoading) {
    return <p className="p-6">Checking authentication...</p>;
  }

  if (!user) {
    return null;
  }

  // Show loading while redirecting riders
  if (user.role === Role.YDM_Rider) {
    return <p className="p-6">Redirecting to your dashboard...</p>;
  }

  return (
    <RoleGuard allowedRoles={[Role.YDM_Logistics, Role.YDM_Operator]}>
      <div className="max-w-7xl mx-auto p-6 space-y-6 px-10">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Franchises</h1>
              <p className="text-gray-600 mt-1">
                Manage and view all franchise locations
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {fetchedFranchises?.length || 0} Total
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {(isFranchiseLoading || isRefetching) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

        {/* Franchises Grid */}
        {!isFranchiseLoading && !isError && (
          <>
            {fetchedFranchises.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No franchises found
                </h3>
                <p className="mt-1 text-sm text-gray-500">No franchises available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fetchedFranchises.map((franchise) => (
                  <Card
                    key={franchise.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600"
                    onClick={() => handleFranchiseClick(franchise.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {franchise.name}
                          </CardTitle>
                          {franchise.short_form && (
                            <CardDescription className="text-sm text-gray-500 mt-1">
                              {franchise.short_form}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Distributor Info */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">
                          Distributor ID: {franchise.distributor}
                        </span>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFranchiseClick(franchise.id);
                        }}
                      >
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </RoleGuard>
  );
}