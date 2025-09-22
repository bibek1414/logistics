"use client";
import { useGetInvoices } from "@/hooks/use-invoice";
import InvoiceTable from "@/components/invoice/invoice-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id as string | undefined;
  const franchiseId = useMemo(
    () => (idParam ? parseInt(idParam) : undefined),
    [idParam]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [status, setStatus] = useState<string>("all");
  const [isApproved, setIsApproved] = useState<string>("all");

  const { data, isLoading, isError, error, isRefetching } = useGetInvoices({
    page: currentPage,
    pageSize,
    status,
    isApproved,
    franchise: franchiseId,
  });

  const invoices = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4 mx-auto max-w-7xl">
      {isError ? (
        <div className="text-red-600 text-sm">
          {(error as Error)?.message || "Failed to load invoices"}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing {invoices.length} of {totalCount} invoices
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={status}
              onValueChange={(v) => {
                setCurrentPage(1);
                setStatus(v);
              }}
            >
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={isApproved}
              onValueChange={(v) => {
                setCurrentPage(1);
                setIsApproved(v);
              }}
            >
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approval</SelectItem>
                <SelectItem value="true">Approved</SelectItem>
                <SelectItem value="false">Not Approved</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setStatus("all");
                setIsApproved("all");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <InvoiceTable
        invoices={invoices}
        isLoading={isLoading || isRefetching}
        onCreate={() => router.push(`/dashboard/${idParam}/invoice/create`)}
      />

      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-between py-3 border-t">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalCount} total invoices)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
