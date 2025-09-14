"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { OrderDetailsDialog } from "./order-details-dialog";
import type { SaleItem } from "@/types/sales";
import { SearchableAgentSelect } from "./searchable-agent-select";
import { useRouter } from "next/navigation";
import { EditOrderDialog } from "./edit-order-dialog";
import { useEditOrder } from "@/hooks/use-edit-order";
import { useVerifyOrder } from "@/hooks/use-verify-order";

interface OrdersTableProps {
  orders: SaleItem[];
  currentPage: number;
  pageSize: number;
  selectedOrders: Set<string>;
  toggleOrderSelection: (orderId: string) => void;
  toggleAllOrders: () => void;
  orderAssignments: Record<string, string>;
  assigningOrders: Set<string>;
  handleAssignOrder: (orderId: string, userId: string) => void;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => { date: string; time: string };
  onVerifyOrder?: (orderId: string, status: string) => void;
  verifyingOrders?: Set<string>;
}

export function OrdersTable({
  orders,
  currentPage,
  pageSize,
  selectedOrders,
  toggleOrderSelection,
  toggleAllOrders,
  orderAssignments,
  assigningOrders,
  handleAssignOrder,
  getStatusColor,
  formatDate,
  onVerifyOrder,
  verifyingOrders = new Set(),
}: OrdersTableProps) {
  const router = useRouter();
  const { mutate: editOrder, isPending: isEditingOrder } = useEditOrder();
  const [pendingReturnOrder, setPendingReturnOrder] = useState<{
    orderId: string;
    newStatus: string;
  } | null>(null);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === "Return Pending") {
      setPendingReturnOrder({ orderId, newStatus });
    } else {
      editOrder({
        order_id: orderId,
        data: { order_status: newStatus },
      });
    }
  };

  const confirmReturnPending = () => {
    if (pendingReturnOrder) {
      editOrder({
        order_id: pendingReturnOrder.orderId,
        data: { order_status: pendingReturnOrder.newStatus },
      });
      setPendingReturnOrder(null);
    }
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedOrders.size === orders.length && orders.length > 0
                }
                onChange={toggleAllOrders}
                className="rounded border-gray-300"
              />
            </TableHead>
            <TableHead className="font-semibold">S.N.</TableHead>
            <TableHead className="font-semibold">Ordered On</TableHead>
            <TableHead className="font-semibold">Customer Info</TableHead>
            <TableHead className="font-semibold">Tracking Code</TableHead>
            <TableHead className="font-semibold">Current Status</TableHead>
            <TableHead className="font-semibold">Total Price (Rs.)</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No orders found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow
                key={order.id}
                className="border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.id.toString())}
                    onChange={() => toggleOrderSelection(order.id.toString())}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>
                  <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded text-center min-w-[90px]">
                    <div className="font-medium">
                      {formatDate(order.created_at).date}
                    </div>
                    <div className="text-xs opacity-90">
                      {formatDate(order.created_at).time}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {order.full_name} ({order.phone_number})
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.delivery_address}, {order.city}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className="font-mono text-sm text-primary font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      router.push(`/track-order/${order.order_code}`);
                    }}
                  >
                    {order.order_code || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.order_status}
                    onValueChange={(value) => {
                      if (
                        order.order_status === "Sent to YDM" &&
                        onVerifyOrder
                      ) {
                        onVerifyOrder(order.id.toString(), value);
                      } else {
                        handleStatusChange(order.id.toString(), value);
                      }
                    }}
                    disabled={
                      isEditingOrder ||
                      verifyingOrders.has(order.id.toString()) ||
                      order.order_status === "Return Pending"
                    }
                  >
                    <SelectTrigger
                      className={`w-full h-8 text-xs font-medium ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {order.order_status === "Sent to YDM" ? (
                        <>
                          <SelectItem value="Sent to YDM" disabled>
                            Sent to YDM
                          </SelectItem>
                          <SelectItem value="Verified">Verify</SelectItem>
                          <SelectItem value="Return Pending">
                            Return Pending
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Verified">Verified</SelectItem>
                          <SelectItem value="Rescheduled">
                            Rescheduled
                          </SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Return Pending">
                            Return Pending
                          </SelectItem>
                          <SelectItem value="Out For Delivery">
                            Out For Delivery
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      Collection Amount:{" "}
                      {Number.parseFloat(order.total_amount).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      DeliveryCharge:{" "}
                      {Number.parseFloat(
                        order.delivery_charge
                      ).toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <SearchableAgentSelect
                      orderId={order.id.toString()}
                      value={orderAssignments[order.id] || ""}
                      assignedRiderPhone={order.ydm_rider || null}
                      onValueChange={(value) =>
                        handleAssignOrder(order.id.toString(), value)
                      }
                      disabled={
                        assigningOrders.has(order.id.toString()) ||
                        order.order_status === "Sent to YDM" ||
                        order.order_status === "Return Pending"
                      }
                      placeholder={
                        order.order_status === "Sent to YDM"
                          ? "Verify order first"
                          : order.order_status === "Return Pending"
                          ? "Cannot assign rider"
                          : order.ydm_rider
                          ? "Reassign Rider"
                          : "Assign Rider"
                      }
                    />
                    <div className="flex items-center justify-center gap-2">
                      <OrderDetailsDialog
                        order={order}
                        getStatusColor={getStatusColor}
                        formatDate={formatDate}
                      />

                      <EditOrderDialog order={order} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!pendingReturnOrder}
        onOpenChange={() => setPendingReturnOrder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this order status to &apos;Return
              Pending&apos;? This action will disable further status changes and
              rider assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReturnPending}>
              Yes, Change to Return Pending
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
