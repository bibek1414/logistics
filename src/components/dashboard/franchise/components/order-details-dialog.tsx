"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Eye } from "lucide-react";
import type { SaleItem } from "@/types/sales";

interface OrderDetailsDialogProps {
  order: SaleItem;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => { date: string; time: string };
}

export function OrderDetailsDialog({
  order,
  getStatusColor,
  formatDate,
}: OrderDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-18 bg-green-500 hover:bg-green-600 text-white border-green-500 cursor-pointer hover:text-white"
        >
          <Eye className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details - {order.order_code}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {order.full_name}
                </div>
                <div>
                  <strong>Phone:</strong> {order.phone_number}
                </div>
                {order.alternate_phone_number && (
                  <div>
                    <strong>Alt Phone:</strong> {order.alternate_phone_number}
                  </div>
                )}
                <div>
                  <strong>Address:</strong> {order.delivery_address}
                </div>
                <div>
                  <strong>City:</strong> {order.city}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Order Code:</strong> {order.order_code}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(order.created_at).date}{" "}
                  {formatDate(order.created_at).time}
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge
                    className={`ml-2 ${getStatusColor(order.order_status)}`}
                  >
                    {order.order_status}
                  </Badge>
                </div>
                <div>
                  <strong>Payment:</strong> {order.payment_method}
                </div>
                <div>
                  <strong>Logistics:</strong> {order.logistics}
                </div>
                {order.dash_tracking_code && (
                  <div>
                    <strong>Tracking:</strong> {order.dash_tracking_code}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Products</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_products.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">
                  Rs. {Number.parseFloat(order.total_amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-medium">
                  Rs.{" "}
                  {Number.parseFloat(order.delivery_charge).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Prepaid Amount:</span>
                <span className="font-medium">
                  Rs.{" "}
                  {Number.parseFloat(
                    order.prepaid_amount?.toString() || "0"
                  ).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Collection Amount:</span>
                <span>
                  Rs.{" "}
                  {(
                    Number.parseFloat(order.total_amount) +
                    Number.parseFloat(order.delivery_charge) -
                    Number.parseFloat(order.prepaid_amount?.toString() || "0")
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {order.remarks && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Remarks</h3>
              <p className="text-sm bg-yellow-50 p-3 rounded-lg">
                {order.remarks}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
