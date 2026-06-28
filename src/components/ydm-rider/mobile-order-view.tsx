"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, LocateIcon, MapPin, Phone, Pin } from "lucide-react";
import Link from "next/link";
import { SaleItem, YDMRiderOrderFilters } from "@/types/sales";
import { CommentDialog } from "@/components/ui/comment-dialog";
import { ContactButton } from "./contact-button";
import { CustomerPhone } from "./customer-phone";
import { StatusSelector } from "./status-selector";

const getWhatsAppLink = (
  phone: string | null | undefined,
  countryCode?: string | null,
) => {
  if (!phone) return "";

  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("00")) {
    formattedPhone = "+" + formattedPhone.substring(2);
  }

  if (formattedPhone.startsWith("+")) {
    return `https://wa.me/${formattedPhone.replace(/\D/g, "")}`;
  }

  let cleaned = formattedPhone.replace(/\D/g, "");
  const cleanedCountry = countryCode ? countryCode.replace(/\D/g, "") : "";

  if (cleanedCountry && !cleaned.startsWith(cleanedCountry)) {
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    cleaned = cleanedCountry + cleaned;
  } else if (!cleanedCountry) {
    if (
      cleaned.length === 10 &&
      (cleaned.startsWith("98") ||
        cleaned.startsWith("97") ||
        cleaned.startsWith("96") ||
        cleaned.startsWith("95"))
    ) {
      cleaned = "977" + cleaned;
    }
  }

  return `https://wa.me/${cleaned}`;
};

interface MobileOrderViewProps {
  orders: SaleItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onFiltersChange: (filters: YDMRiderOrderFilters) => void;
  onStatusUpdate: (
    orderId: string,
    newStatus: string,
    comment?: string,
  ) => void;
  onVerifyOrder?: (orderCode: string, deliveryLocationType: string) => void;
}

type StatusTab =
  | "all"
  | "out_for_delivery"
  | "delivered"
  | "rescheduled"
  | "return_pending";

const statusTabs = [
  { key: "all" as StatusTab, label: "All Orders", value: "" },
  {
    key: "out_for_delivery" as StatusTab,
    label: "Out for Delivery",
    value: "Out For Delivery",
  },
  { key: "delivered" as StatusTab, label: "Delivered", value: "Delivered" },
  {
    key: "rescheduled" as StatusTab,
    label: "Rescheduled",
    value: "Rescheduled",
  },
  {
    key: "return_pending" as StatusTab,
    label: "Return Pending",
    value: "Return Pending",
  },
];

export const MobileOrderView: React.FC<MobileOrderViewProps> = ({
  orders,
  loading,
  error,
  totalCount,
  currentPage,
  pageSize,
  onFiltersChange,
  onStatusUpdate,
  onVerifyOrder,
}) => {
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatuses, setUpdatingStatuses] = useState<Set<string>>(
    new Set(),
  );
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    newStatus: string;
  } | null>(null);
  // Track which order codes are in "pick delivery location" mode
  const [pendingLocationOrders, setPendingLocationOrders] = useState<Set<string>>(new Set());

  const handleVerifyClick = (orderCode: string) => {
    setPendingLocationOrders((prev) => new Set(prev).add(orderCode));
  };

  const handleLocationSelect = (orderCode: string, locationType: string) => {
    setPendingLocationOrders((prev) => {
      const next = new Set(prev);
      next.delete(orderCode);
      return next;
    });
    onVerifyOrder?.(orderCode, locationType);
  };

  const handleLocationCancel = (orderCode: string) => {
    setPendingLocationOrders((prev) => {
      const next = new Set(prev);
      next.delete(orderCode);
      return next;
    });
  };

  // Function to handle phone calls
  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    const statusValue = statusTabs.find((t) => t.key === tab)?.value || "";
    // Fixed: Use 'orderStatus' instead of 'status' to match YDMRiderOrderFilters interface
    onFiltersChange({ orderStatus: statusValue, page: 1 });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ search: value, page: 1 });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "Rescheduled" || newStatus === "Return Pending") {
      setPendingStatusUpdate({ orderId, newStatus });
      setCommentDialogOpen(true);
    } else {
      handleStatusUpdate(orderId, newStatus);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: string,
    comment?: string,
  ) => {
    setUpdatingStatuses((prev) => new Set(prev).add(orderId));
    try {
      await onStatusUpdate(orderId, newStatus, comment);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingStatuses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCommentSubmit = (comment: string) => {
    if (pendingStatusUpdate) {
      handleStatusUpdate(
        pendingStatusUpdate.orderId,
        pendingStatusUpdate.newStatus,
        comment,
      );
      setCommentDialogOpen(false);
      setPendingStatusUpdate(null);
    }
  };

  const getStatusActions = (order: SaleItem) => {
    const orderId = String(order.id);
    const isUpdating = updatingStatuses.has(orderId);

    switch (order.order_status) {
      case "Out For Delivery":
        return (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white mx-auto "
              onClick={() => handleStatusChange(orderId, "Delivered")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
              ) : null}
              Mark Delivered
            </Button>
            <StatusSelector
              currentStatus={order.order_status}
              orderId={orderId}
              isUpdating={isUpdating}
              onStatusChange={handleStatusChange}
              isMobile={true}
            />
          </div>
        );

      case "Rescheduled":
        return (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusChange(orderId, "Delivered")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
              ) : null}
              Mark Delivered
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleStatusChange(orderId, "Rescheduled")}
                disabled={isUpdating}
              >
                Reschedule Again
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleStatusChange(orderId, "Return Pending")}
                disabled={isUpdating}
              >
                Return Pending
              </Button>
            </div>
          </div>
        );

      case "Return Pending":
        return null;

      case "Delivered":
        return null;

      default:
        return (
          <StatusSelector
            currentStatus={order.order_status}
            orderId={orderId}
            isUpdating={isUpdating}
            onStatusChange={handleStatusChange}
            isMobile={true}
          />
        );
    }
  };

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
    <div className="lg:hidden">
      <h1 className="text-xl font-bold mb-4">Your Assigned Orders</h1>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4">
        <div className="flex space-x-1 min-w-max">
          {statusTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap text-xs px-3 py-2 ${
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search by order code, customer name..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="py-0 gap-1 overflow-hidden">
              {/* Skeleton header */}
              <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <CardContent className="py-0 p-3 space-y-3">
                {/* Customer info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>

                {/* Payment box */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <Skeleton className="h-4 w-28 mb-1" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-center">
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => {
            const serialNumber = (currentPage - 1) * pageSize + index + 1;
            const collectionAmount =
              parseFloat(order.total_amount?.toString() ?? "0") -
              parseFloat(order.prepaid_amount?.toString() ?? "0");

            return (
              <Card key={String(order.id)} className="py-0 gap-1">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[10px] font-medium text-gray-600 bg-white px-2 py-1 rounded border">
                      {serialNumber}
                    </span>
                    <Link
                      href={`/track-order/${order.order_code}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="text-xs font-bold text-primary truncate">
                        {order.order_code}
                      </div>
                    </Link>
                    <span
                      className={`text-[10px]  rounded-full px-2 py-1 ${
                        order.order_status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.order_status === "Out For Delivery"
                            ? "bg-blue-100 text-blue-800"
                            : order.order_status === "Return Pending"
                              ? "bg-red-100 text-red-800"
                              : order.order_status === "Rescheduled"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/track-order/${order.order_code}`}>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardContent className="py-0 p-3">
                  {/* Customer Info */}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      <span className="font-medium text-sm">
                        {order.full_name}
                      </span>
                    </div>

                    <CustomerPhone
                      primaryPhone={order.phone_number}
                      alternatePhone={order.alternate_phone_number}
                      onPhoneCall={handlePhoneCall}
                    />

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          order.delivery_address,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm"
                      >
                        {order.delivery_address}
                      </a>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      💰 Payment Details
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">
                          Rs. {order.total_amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prepaid:</span>
                        <span className="text-red-600 font-medium">
                          Rs. {order.prepaid_amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t">
                        <span>Collection:</span>
                        <span className=" text-green-600 font-medium">
                          Rs. {collectionAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status / Verification Actions */}
                  <div className="mt-2 mb-1">
                    {!order.is_rider_verified ? (
                      pendingLocationOrders.has(order.order_code) ? (
                        // Location picker — shown after "Verify Order" is tapped
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-xs text-gray-500 font-medium">Select delivery location:</p>
                          <div className="flex gap-2 w-full">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleLocationSelect(order.order_code, "Inside Ringroad")
                              }
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium h-8 text-xs"
                            >
                              Inside Ringroad
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleLocationSelect(order.order_code, "Outside Ringroad")
                              }
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-8 text-xs"
                            >
                              Outside Ringroad
                            </Button>
                          </div>
                          <button
                            onClick={() => handleLocationCancel(order.order_code)}
                            className="text-[10px] text-gray-400 underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        // Initial "Verify Order" button
                        <div className="flex justify-center w-full">
                          <Button
                            size="sm"
                            onClick={() => handleVerifyClick(order.order_code)}
                            className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-medium h-8 text-xs flex items-center justify-center gap-1 px-4"
                          >
                            Verify Order
                          </Button>
                        </div>
                      )
                    ) : (
                      <div>{getStatusActions(order)}</div>
                    )}
                  </div>

                  {/* Contact Section */}
                  {order.is_rider_verified && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex flex-col gap-2">
                        <ContactButton
                          contacts={[
                            {
                              phone_number: order.sales_person.phone_number,
                              first_name: order.sales_person.first_name,
                              last_name: order.sales_person.last_name,
                            },
                          ]}
                          buttonText="Salesperson"
                        />
                        {order.sales_person.franchise_contact_numbers &&
                          order.sales_person.franchise_contact_numbers.length >
                            0 && (
                            <ContactButton
                              contacts={
                                order.sales_person.franchise_contact_numbers
                              }
                              buttonText=" Franchise"
                            />
                          )}
                        {getWhatsAppLink(
                          order.phone_number,
                          order.country_code,
                        ) && (
                          <a
                            href={getWhatsAppLink(
                              order.phone_number,
                              order.country_code,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs px-2 py-1.5 h-8 flex items-center justify-center gap-1 border-green-500 text-green-700 hover:bg-green-50 hover:text-green-700 bg-white"
                            >
                              <img
                                src="/WhatsApp_icon.png"
                                alt="WhatsApp"
                                className="w-3.5 h-3.5 object-contain"
                              />
                              <span>WhatsApp</span>
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination for Mobile */}
      {totalCount > pageSize && (
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <div className="text-xs text-gray-500 text-center">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            orders
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: currentPage - 1 })}
              disabled={currentPage === 1}
              className="px-2 py-1 h-8 text-xs"
            >
              <span className="mr-1">←</span>
              Previous
            </Button>

            {/* Show current page info */}
            <div className="px-3 py-1 text-xs bg-gray-100 rounded">
              {currentPage} of {Math.ceil(totalCount / pageSize)}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: currentPage + 1 })}
              disabled={currentPage === Math.ceil(totalCount / pageSize)}
              className="px-2 py-1 h-8 text-xs"
            >
              Next
              <span className="ml-1">→</span>
            </Button>
          </div>
        </div>
      )}

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        onCommentSubmit={handleCommentSubmit}
        isLoading={
          pendingStatusUpdate
            ? updatingStatuses.has(pendingStatusUpdate.orderId)
            : false
        }
        status={pendingStatusUpdate?.newStatus}
      />
    </div>
  );
};
