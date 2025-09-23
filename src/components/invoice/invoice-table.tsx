"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { InvoiceCommentDialog } from "./invoice-comment-dialog";
import type { Invoice } from "@/types/invoice";

type InvoiceTableProps = {
  invoices: Invoice[];
  isLoading?: boolean;
  onCreate?: () => void;
  onEdit?: (invoiceId: number) => void;
  onDownloadPdf?: (invoice: Invoice) => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";
    case "Partially Paid":
      return "bg-yellow-100 text-yellow-700";
    case "Pending":
      return "bg-gray-100 text-gray-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDateTime = (iso: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export function InvoiceTable({
  invoices,
  isLoading = false,
  onCreate,
  onEdit,
  onDownloadPdf,
}: InvoiceTableProps) {
  const router = useRouter();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [selectedInvoiceCode, setSelectedInvoiceCode] = useState<string>("");

  const handleCommentClick = (invoiceId: number, invoiceCode: string) => {
    setSelectedInvoiceId(invoiceId);
    setSelectedInvoiceCode(invoiceCode);
    setCommentDialogOpen(true);
  };

  return (
    <div className="space-y-4 mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <Button onClick={onCreate}>Create Invoice</Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-semibold">S.N.</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Paid</TableHead>
              <TableHead className="font-semibold">Due</TableHead>
              <TableHead className="font-semibold">Payment Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Approved</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Updated At</TableHead>
              <TableHead className="font-semibold">Signature</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-gray-500"
                >
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-gray-500"
                >
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv, idx) => (
                <TableRow
                  key={inv.id}
                  className="border-gray-50 hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    <span
                      className="font-mono text-sm text-primary font-medium cursor-pointer hover:underline"
                      onClick={() => router.push(`#`)}
                    >
                      {inv.invoice_code}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {Number(inv.total_amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {Number(inv.paid_amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {Number(inv.due_amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{inv.payment_type}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs font-medium ${getStatusColor(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`${
                      inv.is_approved ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {inv.is_approved ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{formatDateTime(inv.created_at)}</TableCell>
                  <TableCell>{formatDateTime(inv.updated_at)}</TableCell>
                  <TableCell>
                    {inv.signature ? (
                      <a
                        href={inv.signature}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onEdit
                          ? onEdit(inv.id)
                          : router.push(
                              `/dashboard/${inv.franchise}/invoice/${inv.id}/edit`
                            )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadPdf && onDownloadPdf(inv)}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCommentClick(inv.id, inv.invoice_code)
                      }
                    >
                      Comments
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Comment Dialog */}
      {selectedInvoiceId && (
        <InvoiceCommentDialog
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
          invoiceId={selectedInvoiceId}
          invoiceCode={selectedInvoiceCode}
        />
      )}
    </div>
  );
}

export default InvoiceTable;
