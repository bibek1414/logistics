"use client";

import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SaleItem, YDMRiderOrderFilters } from "@/types/sales";
import { CommentDialog } from "@/components/ui/comment-dialog";
import { ContactButton } from "./contact-button";
import { CustomerPhone } from "./customer-phone";
import { StatusSelector } from "./status-selector";
import { MobileOrderView } from "./mobile-order-view";

interface YDMRiderOrderListProps {
  orders: SaleItem[]; 
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onFiltersChange: (filters: YDMRiderOrderFilters) => void;
  onStatusUpdate: (orderId: string, newStatus: string, comment?: string) => void;
}

export const YDMRiderOrderList: React.FC<YDMRiderOrderListProps> = ({
  orders,
  loading,
  error,
  totalCount,
  currentPage,
  pageSize,
  onFiltersChange,
  onStatusUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatuses, setUpdatingStatuses] = useState<Set<string>>(new Set());
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    newStatus: string;
  } | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Function to handle phone calls
  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  // Debounce function with proper typing
  const debounce = <T extends unknown[]>(
    func: (...args: T) => void,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search handler with proper dependencies
  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      onFiltersChange({ search: value, page: 1 });
      setIsDebouncing(false);
    }, 1000),
    [onFiltersChange]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsDebouncing(true);
    debouncedSearchHandler(value);
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ page });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "Rescheduled" || newStatus === "Return Pending") {
      setPendingStatusUpdate({ orderId, newStatus });
      setCommentDialogOpen(true);
    } else {
      handleStatusUpdate(orderId, newStatus);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, comment?: string) => {
    setUpdatingStatuses(prev => new Set(prev).add(orderId));
    try {
      await onStatusUpdate(orderId, newStatus, comment);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingStatuses(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCommentSubmit = (comment: string) => {
    if (pendingStatusUpdate) {
      handleStatusUpdate(pendingStatusUpdate.orderId, pendingStatusUpdate.newStatus, comment);
      setCommentDialogOpen(false);
      setPendingStatusUpdate(null);
    }
  };

  // Loading skeletons for desktop view
  const DesktopSkeleton = () => (
    <div className="hidden lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Skeleton className="h-4 w-12" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-6 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-red-500">
          <p>Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl ">
      {/* Mobile View */}
      <MobileOrderView
        orders={orders}
        loading={loading}
        error={error}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onFiltersChange={onFiltersChange}
        onStatusUpdate={onStatusUpdate}
      />

      {/* Desktop View */}
      <div className="hidden lg:block">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Your Assigned Orders</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search by order code, customer name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 text-sm"
            />
            {(loading || isDebouncing) && (
              <div className="absolute right-2 top-2.5">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      
        <div>
          {loading || isDebouncing ? (
            <DesktopSkeleton />
          ) : !orders || orders.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No orders found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.N.</TableHead>
                      <TableHead>Order Code</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => {
                      const serialNumber = (currentPage - 1) * pageSize + index + 1;
                      return (
                        <TableRow key={String(order.id)}>
                          <TableCell className="font-medium text-gray-600">
                            {serialNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link 
                              href={`/track-order/${order.order_code}`}
                              className="text-primary hover:text-primary hover:underline"
                            >
                              {order.order_code}
                            </Link>
                          </TableCell>
                          <TableCell>{order.full_name}</TableCell>
                          <TableCell>
                            <CustomerPhone
                              primaryPhone={order.phone_number}
                              alternatePhone={order.alternate_phone_number}
                              onPhoneCall={handlePhoneCall}
                              isDesktop={true}
                            />
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={order.delivery_address}>
                              {order.delivery_address}
                            </div>
                          </TableCell>
                          <TableCell className="cursor-pointer">
                            <StatusSelector
                              currentStatus={order.order_status}
                              orderId={String(order.id)}
                              isUpdating={updatingStatuses.has(String(order.id))}
                              onStatusChange={handleStatusChange}
                            />
                          </TableCell>
                          <TableCell> 
                            {order.prepaid_amount!=0 && (
                      <div className="text-xs">
                      Prepaid Amount:{" "}
                      {order.prepaid_amount?.toLocaleString()}
                    </div>
                    )}
                    <div className="font-medium">
                      Collection Amount:{" "}
                      {(
                        parseFloat(order.total_amount?.toString() ?? "0") -
                        parseFloat(order.prepaid_amount?.toString() ?? "0")
                      ).toLocaleString()}
                    </div>
                          </TableCell>
                          <TableCell>
                            <Link href={`/track-order/${order.order_code}`}>
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination - Desktop */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalCount)} of {totalCount} orders
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const maxPages = 5;
                        let pageNum;
                        if (totalPages <= maxPages) {
                          pageNum = i + 1;
                        } else if (currentPage <= Math.ceil(maxPages/2)) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - Math.floor(maxPages/2)) {
                          pageNum = totalPages - maxPages + 1 + i;
                        } else {
                          pageNum = currentPage - Math.floor(maxPages/2) + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        onCommentSubmit={handleCommentSubmit}
        isLoading={pendingStatusUpdate ? updatingStatuses.has(pendingStatusUpdate.orderId) : false}
        status={pendingStatusUpdate?.newStatus}
      />
    </div>
  );
};