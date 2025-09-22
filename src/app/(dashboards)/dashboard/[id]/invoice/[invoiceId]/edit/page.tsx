"use client";

import { useParams } from "next/navigation";
import { useGetInvoiceById } from "@/hooks/use-invoice";
import InvoiceCreateView from "@/components/invoice/invoice-create-view";

export default function InvoiceEditPage() {
  const params = useParams<{ id: string; invoiceId: string }>();
  const invoiceId = Number(params?.invoiceId);
  const {
    data: invoice,
    isLoading,
    isError,
    error,
  } = useGetInvoiceById(invoiceId);

  if (!invoiceId || isNaN(invoiceId)) {
    return <div className="p-4 text-red-600">Invalid invoice id</div>;
  }

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-600">{(error as Error)?.message}</div>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <InvoiceCreateView mode="edit" initialInvoice={invoice as any} />;
}
