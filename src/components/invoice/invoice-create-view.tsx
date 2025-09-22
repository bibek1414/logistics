"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { SignatureContextProvider } from "@/context/SignatureContext";
import SignatureModal from "./signature/SignatureModal";
import { useCreateInvoice, useGetTotalAmount } from "@/hooks/use-invoice";
import { useParams } from "next/navigation";
import { useFranchises } from "@/hooks/use-franchises";
import { downloadInvoicePDF } from "./utils/pdf-generator";

interface InvoiceData {
  invoiceCode: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  paymentType: "Cash" | "Bank Transfer" | "Cheque";
  status: "Draft" | "Partially Paid" | "Pending" | "Paid";
  franchise: string;
  createdBy: string;
  signedBy: string;
  signatureDate: string;
  notes: string;
  signature?: File | string | null;
}

export default function InvoiceCreateView() {
  const params = useParams<{ id: string }>();
  const franchiseParamId = (params?.id ?? "").toString();
  const { mutate, isPending } = useCreateInvoice();
  const { data: totalAmount } = useGetTotalAmount(Number(franchiseParamId));
  const { franchises } = useFranchises();
  const selectedFranchiseName = franchises.find(
    (f) => f.id === Number(franchiseParamId)
  )?.name;
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceCode: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentType: "Cash",
    status: "Draft",
    franchise: "",
    createdBy: "",
    signedBy: "",
    signatureDate: "",
    notes: "",
    signature: null,
  });

  // Derived signature preview URL for rendering drawn/uploaded signature in the preview
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string>("");
  useEffect(() => {
    // Handle string (e.g., data URL) or File
    if (!invoiceData.signature) {
      setSignaturePreviewUrl("");
      return;
    }

    if (typeof invoiceData.signature === "string") {
      setSignaturePreviewUrl(invoiceData.signature);
      return;
    }

    // File case
    const url = URL.createObjectURL(invoiceData.signature);
    setSignaturePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [invoiceData.signature]);

  const updateField = (field: keyof InvoiceData, value: string | boolean) => {
    setInvoiceData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "totalAmount" || field === "paidAmount") {
        const total =
          Number.parseFloat(
            field === "totalAmount" ? (value as string) : updated.totalAmount
          ) || 0;
        const paid =
          Number.parseFloat(
            field === "paidAmount" ? (value as string) : updated.paidAmount
          ) || 0;
        updated.dueAmount = Math.max(0, total - paid).toString();

        if (paid === 0) {
          updated.status = total > 0 ? "Pending" : "Draft";
        } else if (paid >= total && total > 0) {
          updated.status = "Paid";
        } else if (paid > 0 && paid < total) {
          updated.status = "Partially Paid";
        }
      }

      return updated;
    });
  };

  // Sync total amount from API
  useEffect(() => {
    if (typeof totalAmount === "number" && !Number.isNaN(totalAmount)) {
      updateField("totalAmount", totalAmount.toString());
    }
  }, [totalAmount]);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateInvoice = async () => {
    try {
      let signaturePayload: string | null = null;
      if (invoiceData.signature) {
        if (typeof invoiceData.signature === "string") {
          signaturePayload = invoiceData.signature;
        } else {
          signaturePayload = await fileToDataUrl(invoiceData.signature);
        }
      }

      const payload = {
        invoice_code: invoiceData.invoiceCode,
        total_amount: invoiceData.totalAmount,
        paid_amount: invoiceData.paidAmount,
        due_amount: invoiceData.dueAmount,
        payment_type: invoiceData.paymentType,
        status: invoiceData.status,
        franchise: franchiseParamId || invoiceData.franchise,
        notes: invoiceData.notes,
        signature: signaturePayload,
      };

      mutate(payload as unknown as Record<string, unknown>);
    } catch (e) {
      // errors are surfaced via toast in the mutation onError
      console.error(e);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = Number.parseFloat(amount);
    return isNaN(num)
      ? "Nrs 0.00"
      : `Nrs ${num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  };

  const handleSignatureChange = (file: File | null) => {
    setInvoiceData((prev) => ({ ...prev, signature: file }));
  };

  const handleDownloadPDF = async () => {
    try {
      let signatureUrl: string | undefined;

      // Convert signature to data URL if it exists
      if (invoiceData.signature) {
        if (typeof invoiceData.signature === "string") {
          signatureUrl = invoiceData.signature;
        } else {
          // Convert File to data URL
          signatureUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(invoiceData.signature as File);
          });
        }
      }

      await downloadInvoicePDF(
        invoiceData,
        selectedFranchiseName || invoiceData.franchise,
        signatureUrl
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // You can add toast notification here for error handling
    }
  };
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Invoice</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <FileText className="h-5 w-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceCode" className="text-card-foreground">
                    Invoice Code
                  </Label>
                  <Input
                    id="invoiceCode"
                    placeholder="INV-2024-001"
                    value={invoiceData.invoiceCode}
                    onChange={(e) => updateField("invoiceCode", e.target.value)}
                    className="bg-input border-border text-foreground font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-card-foreground">
                    Status
                  </Label>
                  <Select
                    value={invoiceData.status}
                    onValueChange={(value) =>
                      updateField("status", value as InvoiceData["status"])
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Partially Paid">
                        Partially Paid
                      </SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="franchise" className="text-card-foreground">
                    Franchise
                  </Label>
                  <Input
                    id="franchise"
                    placeholder="Loading franchise..."
                    value={selectedFranchiseName || invoiceData.franchise}
                    readOnly
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  Payment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="totalAmount"
                      className="text-card-foreground"
                    >
                      Total Amount
                    </Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      readOnly
                      value={invoiceData.totalAmount}
                      onChange={(e) =>
                        updateField("totalAmount", e.target.value)
                      }
                      className="bg-input border-border text-foreground font-mono text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="paidAmount"
                      className="text-card-foreground"
                    >
                      Paid Amount
                    </Label>
                    <Input
                      id="paidAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={invoiceData.paidAmount}
                      onChange={(e) =>
                        updateField("paidAmount", e.target.value)
                      }
                      className="bg-input border-border text-foreground font-mono text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueAmount" className="text-card-foreground">
                      Due Amount
                    </Label>
                    <Input
                      id="dueAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={invoiceData.dueAmount}
                      readOnly
                      className="bg-muted border-border text-muted-foreground font-mono text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentType" className="text-card-foreground">
                    Payment Type
                  </Label>
                  <Select
                    value={invoiceData.paymentType}
                    onValueChange={(value) =>
                      updateField(
                        "paymentType",
                        value as InvoiceData["paymentType"]
                      )
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Signature
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <SignatureContextProvider
                      initialSignature={
                        invoiceData.signature
                          ? typeof invoiceData.signature === "string"
                            ? invoiceData.signature
                            : URL.createObjectURL(invoiceData.signature)
                          : ""
                      }
                      onSignatureChange={handleSignatureChange}
                    >
                      <SignatureModal />
                    </SignatureContextProvider>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-card-foreground">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or comments..."
                  value={invoiceData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleGenerateInvoice}
                disabled={isPending}
              >
                {isPending ? "Generating..." : "Generate Invoice"}
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isPending}>
                Download Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Live Preview Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
                {/* Company Header */}
                <div className="border-b-4 border-black p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-black mb-2">
                        YDM
                      </h1>
                      <p className="text-gray-700 text-sm font-medium uppercase tracking-wide">
                        Professional Business Services
                      </p>
                      <div className="mt-4 space-y-1 text-gray-600 text-sm">
                        <p>Kathmandu, Nepal</p>
                        <p>Phone: +977-981-3492594</p>
                        <p>Email: ydmnepal@gmail.com</p>
                      </div>
                    </div>
                    <div className="text-right border-2 border-black p-4">
                      <h2 className="text-2xl font-bold text-black mb-1 tracking-wider">
                        INVOICE
                      </h2>
                      <p className="text-gray-700 font-mono text-sm font-semibold">
                        {invoiceData.invoiceCode || "INV-XXXX-XXX"}
                      </p>
                      <div className="mt-3">
                        <div className="inline-block border-2 border-gray-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-700">
                          {invoiceData.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-3 border-b-2 border-gray-400 pb-2 uppercase tracking-wide">
                        Invoice To
                      </h3>
                      <div className="space-y-2">
                        <p className="text-black font-bold text-lg capitalize">
                          {selectedFranchiseName ||
                            invoiceData.franchise ||
                            "Franchise Name"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black mb-3 border-b-2 border-gray-400 pb-2 uppercase tracking-wide">
                        Invoice Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm font-medium">
                            Invoice Date:
                          </span>
                          <span className="text-black font-bold text-sm">
                            {new Date().toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium">
                            Payment Type:
                          </span>
                          <span className="text-black font-bold">
                            {invoiceData.paymentType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="border-2 border-gray-300 bg-gray-50 p-6 mb-6">
                    <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                      Payment Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b-2 border-gray-300">
                        <span className="text-black font-bold text-lg uppercase tracking-wide">
                          Total Amount
                        </span>
                        <span className="text-3xl font-bold text-black font-mono">
                          {formatCurrency(invoiceData.totalAmount)}
                        </span>
                      </div>

                      {invoiceData.paidAmount &&
                        Number.parseFloat(invoiceData.paidAmount) > 0 && (
                          <div className="flex justify-between items-center py-2 border border-gray-400 bg-white px-3">
                            <span className="font-bold text-gray-700 uppercase tracking-wide">
                              Amount Paid
                            </span>
                            <span className="font-mono font-bold text-lg text-black">
                              {formatCurrency(invoiceData.paidAmount)}
                            </span>
                          </div>
                        )}

                      {invoiceData.dueAmount &&
                        Number.parseFloat(invoiceData.dueAmount) > 0 && (
                          <div className="flex justify-between items-center py-3 border-2 border-black bg-white px-3">
                            <span className="font-bold text-black uppercase tracking-wide text-lg">
                              Amount Due
                            </span>
                            <span className="font-mono font-bold text-xl text-black">
                              {formatCurrency(invoiceData.dueAmount)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Notes */}
                  {invoiceData.notes && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-black mb-3 border-b-2 border-gray-400 pb-2 uppercase tracking-wide">
                        Additional Notes
                      </h4>
                      <div className="border-2 border-gray-300 p-4">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                          {invoiceData.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Signature Section */}
                  {(signaturePreviewUrl || invoiceData.signatureDate) && (
                    <div className="border-t-2 border-gray-400 pt-8">
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          {signaturePreviewUrl && (
                            <div className="mb-3">
                              <img
                                src={signaturePreviewUrl}
                                alt="Signature"
                                className="h-16 object-contain"
                              />
                            </div>
                          )}
                          <div className="border-b-2 border-black w-64 mb-3"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-100 px-8 py-4 border-t-2 border-gray-300">
                  <p className="text-center text-gray-700 text-sm font-medium">
                    Thank you for your business. For questions regarding this
                    invoice, please contact us immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
