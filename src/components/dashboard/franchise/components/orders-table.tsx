"use client";

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

import { OrderDetailsDialog } from "./order-details-dialog";
import type { SaleItem } from "@/types/sales";
import { SearchableAgentSelect } from "./searchable-agent-select";
import { useRouter } from "next/navigation";

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
}: OrdersTableProps) {
  const router = useRouter();
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
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${getStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status.toUpperCase()}
                  </Badge>
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
                      disabled={assigningOrders.has(order.id.toString())}
                      placeholder="Assign Rider"
                    />
                    <OrderDetailsDialog
                      order={order}
                      getStatusColor={getStatusColor}
                      formatDate={formatDate}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
