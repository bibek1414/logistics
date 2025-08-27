"use client";
import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OrderData } from "@/types/order";

interface OrderDetailsProps {
  orderData: OrderData | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onRefresh: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderData,
  isLoading,
  error,
  onBack,
  onRefresh,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Processing: "bg-purple-100 text-purple-800",
      Shipped: "bg-orange-100 text-orange-800",
      "Out for Delivery": "bg-indigo-100 text-indigo-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: string) => {
    return `NPR ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error || "Order not found"}</AlertDescription>
            </Alert>
            <Link href="/">
              <Button className="w-full mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                Order Tracking
              </h1>
              <p className="text-gray-600 text-sm sm:text-base truncate">
                {orderData.order_code}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onRefresh}
            size="sm"
            className="shrink-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <Badge
                  className={`${getStatusColor(
                    orderData.order_status
                  )} text-xs`}
                >
                  {orderData.order_status}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Order Date:</span>
                <span className="text-sm font-medium">
                  {formatDate(orderData.created_at)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Total Amount:</span>
                <span className="font-semibold text-sm">
                  {formatCurrency(orderData.total_amount)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Delivery Charge:</span>
                <span className="text-sm">
                  {formatCurrency(orderData.delivery_charge)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Payment Method:</span>
                <span className="text-sm">{orderData.payment_method}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-gray-600 text-sm">Customer:</span>
                <p className="font-semibold text-sm">{orderData.full_name}</p>
              </div>

              <div>
                <span className="text-gray-600 text-sm">Delivery Address:</span>
                <div className="text-sm">
                  <p>{orderData.delivery_address}</p>
                  {orderData.city && <p>{orderData.city}</p>}
                  {orderData.landmark && (
                    <p className="text-gray-500">{orderData.landmark}</p>
                  )}
                </div>
              </div>

              <div>
                <span className="text-gray-600 text-sm">Phone:</span>
                <p className="text-sm">{orderData.phone_number}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Delivery Type:</span>
                <span className="text-sm">{orderData.delivery_type}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Logistics:</span>
                <span className="text-sm">{orderData.logistics}</span>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.order_products.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Person */}
          {orderData.sales_person && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5" />
                  Sales Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Name:</span>
                  <p className="font-medium text-sm">
                    {orderData.sales_person.first_name}{" "}
                    {orderData.sales_person.last_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {orderData.sales_person.phone_number}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Franchise:</span>
                  <span className="text-sm">
                    {orderData.sales_person.franchise}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Factory:</span>
                  <span className="text-sm">
                    {orderData.sales_person.factory}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Remarks */}
        {orderData.remarks && (
          <Card className="mt-6 sm:mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm sm:text-base break-words">
                {orderData.remarks}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
