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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SaleItem, YDMRiderOrderFilters } from "@/types/sales";
import { CommentDialog } from "@/components/ui/comment-dialog";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatuses, setUpdatingStatuses] = useState<Set<string>>(new Set());
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    newStatus: string;
  } | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

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

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    onFiltersChange({ orderStatus: status, page: 1 });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ page });
  };

  const handlePageSizeChange = (size: string) => {
    onFiltersChange({ pageSize: parseInt(size), page: 1 });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "Rescheduled") {
      // Open comment dialog for rescheduled status
      setPendingStatusUpdate({ orderId, newStatus });
      setCommentDialogOpen(true);
    } else {
      // For other statuses, update directly
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "rescheduled":
        return "destructive";
      case "returned by customer":
        return "secondary";
      case "processing":
        return "outline";
      case "out for delivery":
        return "default";
      default:
        return "secondary";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "Returned By Customer", label: "Returned By Customer" },
    { value: "Processing", label: "Processing" },
    { value: "Out For Delivery", label: "Out For Delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Rescheduled", label: "Rescheduled" },
  ];

  // Loading skeletons for desktop view
  const DesktopSkeleton = () => (
    <div className="hidden lg:block">
      <Table>
        <TableHeader>
          <TableRow>
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

  // Loading skeletons for mobile view
  const MobileSkeleton = () => (
    <div className="lg:hidden space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent className="p-4 pt-0 text-sm space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Orders</CardTitle>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by order code, customer name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1"
              />
              {(loading || isDebouncing) && (
                <div className="absolute right-2 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading || isDebouncing ? (
            <>
              <DesktopSkeleton />
              <MobileSkeleton />
            </>
          ) : !orders || orders.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No orders found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                    {orders.map((order) => (
                      <TableRow key={String(order.id)}>
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
                          <div>
                            <div>{order.phone_number}</div>
                            {order.alternate_phone_number && (
                              <div className="text-sm text-gray-500">
                                Alt: {order.alternate_phone_number}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {order.delivery_address}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.order_status}
                            onValueChange={(newStatus) => handleStatusChange(String(order.id), newStatus)}
                            disabled={updatingStatuses.has(String(order.id))}
                          >
                            <SelectTrigger className="w-[130px]">
                              <Badge variant={getStatusColor(order.order_status)}>
                                {updatingStatuses.has(String(order.id)) ? "Updating..." : order.order_status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Returned By Customer">Returned By Customer</SelectItem>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Out For Delivery">Out For Delivery</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>NPR {parseFloat(order.total_amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Link href={`/track-order/${order.order_code}`}>
                            <Button size="icon" variant="ghost">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {orders.map((order) => (
                  <Card key={String(order.id)} className="relative">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                      <Link 
                        href={`/track-order/${order.order_code}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <CardTitle className="text-md">
                          Order: {order.order_code}
                        </CardTitle>
                      </Link>
                      <Link href={`/track-order/${order.order_code}`}>
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm space-y-2">
                      <div>
                        <strong>Customer:</strong> {order.full_name}
                      </div>
                      <div>
                        <strong>Phone:</strong> {order.phone_number}
                        {order.alternate_phone_number && (
                          <div className="text-gray-500 text-xs">
                            Alt: {order.alternate_phone_number}
                          </div>
                        )}
                      </div>
                      <div>
                        <strong>Address:</strong> {order.delivery_address}
                      </div>
                      <div>
                        <strong>Total:</strong> NPR {parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      
                      {/* Status Update for Mobile */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm font-medium">Status:</span>
                        <Select
                          value={order.order_status}
                          onValueChange={(newStatus) => handleStatusChange(String(order.id), newStatus)}
                          disabled={updatingStatuses.has(String(order.id))}
                        >
                          <SelectTrigger className="w-[140px]">
                            <Badge variant={getStatusColor(order.order_status)}>
                              {updatingStatuses.has(String(order.id)) ? "Updating..." : order.order_status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Returned By Customer">Returned By Customer</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Out For Delivery">Out For Delivery</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
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
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
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
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        onCommentSubmit={handleCommentSubmit}
        isLoading={pendingStatusUpdate ? updatingStatuses.has(pendingStatusUpdate.orderId) : false}
      />
    </>
  );
};