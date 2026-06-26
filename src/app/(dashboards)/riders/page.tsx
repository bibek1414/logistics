"use client";

import { useState, useEffect } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { useRiders } from "@/hooks/use-riders";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Rider } from "@/types/rider";

export default function RidersPage() {
  const pathname = usePathname();
  const { user, isLoading: isAuthLoading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth(pathname);
  }, [user, isAuthLoading, pathname]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const {
    data,
    isLoading: isRidersLoading,
    isError,
    error,
    refetch,
  } = useRiders({
    search: debouncedSearchTerm,
    page: currentPage,
    pageSize,
  });

  const riders = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10 animate-pulse">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="rounded-md border p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-48" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={[Role.YDM_Logistics, Role.YDM_Operator]}>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:px-10">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                Riders Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                View, search, and monitor all YDM Riders
              </p>
            </div>
          </div>
        </div>

        {/* Controls: Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search riders by name, phone, email, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 w-full"
            />
          </div>
        </div>

        {/* Riders Table Container */}
        <div className="rounded-md border bg-card text-card-foreground">
          {isRidersLoading ? (
            <div className="p-12 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Failed to load riders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {error?.message || "An unknown error occurred"}
              </p>
              <div className="mt-4">
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </div>
          ) : riders.length === 0 ? (
            <div className="text-center py-16">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No riders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No riders are currently registered"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 font-semibold">S.N.</TableHead>
                      <TableHead className="font-semibold">
                        Rider Name
                      </TableHead>
                      <TableHead className="font-semibold">
                        Phone Number
                      </TableHead>
                      <TableHead className="font-semibold">
                        Email Address
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riders.map((rider, index) => (
                      <TableRow
                        key={rider.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-500">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          <Link
                            href={`/riders/${encodeURIComponent(rider.phone_number || "")}`}
                            className="hover:underline text-primary font-semibold transition-colors focus:outline-none"
                          >
                            {rider.first_name} {rider.last_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {rider.phone_number || (
                              <span className="text-gray-400 italic">
                                N/A
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          <div className="flex items-center text-xs">
                            <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {rider.email || (
                              <span className="text-gray-400 italic">
                                N/A
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden divide-y">
                {riders.map((rider, index) => (
                  <div
                    key={rider.id}
                    className="p-4 space-y-3 hover:bg-gray-50/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/riders/${encodeURIComponent(rider.phone_number || "")}`}
                          className="hover:underline text-primary font-semibold block focus:outline-none"
                        >
                          {rider.first_name} {rider.last_name}
                        </Link>
                        <span className="text-xs text-gray-400">
                          S.N. {(currentPage - 1) * pageSize + index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                        {rider.phone_number || (
                          <span className="italic text-gray-400">N/A</span>
                        )}
                      </div>
                      <div className="flex items-center text-xs">
                        <Mail className="h-3.5 w-3.5 mr-2 text-gray-400" />
                        {rider.email || (
                          <span className="italic text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination footer */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t gap-4">
                  <div className="text-sm text-gray-600">
                    Showing Page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages}</strong> ({totalCount} total riders)
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
                      <ChevronLeft className="w-4 h-4 mr-1" />
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
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
