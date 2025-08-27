"use client";
import React from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { OrderData, TrackingEvent, OrderStatus } from "@/types/order";

interface OrderDetailsProps {
  orderData: OrderData;
  onBack?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderData,
  onBack,
  onRefresh,
  isRefreshing = false,
}) => {
  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Confirmed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Processing:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Shipped:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Out for Delivery":
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      Delivered:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Returned: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const getActivityIcon = (activity: string) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("delivered"))
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (activityLower.includes("dispatch") || activityLower.includes("ship"))
      return <Truck className="w-4 h-4 text-blue-600" />;
    if (activityLower.includes("out for delivery"))
      return <MapPin className="w-4 h-4 text-orange-600" />;
    if (activityLower.includes("placed") || activityLower.includes("confirmed"))
      return <Package className="w-4 h-4 text-purple-600" />;
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold">Order Tracking</h1>
              <p className="text-muted-foreground">
                Track your order progress in real-time
              </p>
            </div>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">
                    {orderData.order_code}
                  </p>
                  <Badge className={getStatusColor(orderData.order_status)}>
                    {orderData.order_status}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {formatDateTime(orderData.created_at)}
                    </p>
                  </div>

                  {orderData.dash_tracking_code && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tracking Code
                      </p>
                      <p className="font-medium font-mono text-sm">
                        {orderData.dash_tracking_code}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Logistics Partner
                    </p>
                    <p className="font-medium">{orderData.logistics}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tracking Timeline
                </CardTitle>
                <CardDescription>
                  Follow your order's journey from placement to delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orderData.tracking_history &&
                orderData.tracking_history.length > 0 ? (
                  <div className="space-y-6">
                    {orderData.tracking_history.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center">
                            {getActivityIcon(event.activity)}
                          </div>
                          {index < orderData.tracking_history!.length - 1 && (
                            <div className="w-0.5 h-12 bg-border mt-2"></div>
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg">
                              {event.activity}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {event.activity_by}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {event.date}
                            </p>

                            {event.location && (
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </p>
                            )}

                            {event.remarks && (
                              <p className="text-foreground mt-2 p-2 bg-muted/50 rounded">
                                {event.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No tracking information available yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tracking details will appear once your order is processed.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales Person Information */}
            {orderData.sales_person && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Sales Representative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {orderData.sales_person.first_name}{" "}
                        {orderData.sales_person.last_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {orderData.sales_person.phone_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Franchise</p>
                      <p className="font-medium">
                        {orderData.sales_person.franchise}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Factory</p>
                      <p className="font-medium">
                        {orderData.sales_person.factory}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Delivery Type
                    </p>
                    <p className="font-medium">{orderData.delivery_type}</p>
                  </div>

                  {orderData.promo_code && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Promo Code
                      </p>
                      <p className="font-medium">{orderData.promo_code}</p>
                    </div>
                  )}

                  {parseFloat(orderData.prepaid_amount) > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Prepaid Amount
                      </p>
                      <p className="font-medium">
                        {formatCurrency(orderData.prepaid_amount)}
                      </p>
                    </div>
                  )}

                  {orderData.remarks && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Remarks</p>
                      <p className="font-medium p-3 bg-muted/50 rounded-lg">
                        {orderData.remarks}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
