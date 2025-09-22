import { PaginatedInvoiceResponse } from "@/types/invoice";

export interface InvoiceFilters {
  page?: number;
  pageSize?: number;
  status?: string; // Pending | Partially Paid | Paid | Cancelled
  isApproved?: string; // "true" | "false"
  franchise?: number;
}

export const createInvoice = async (invoice: Record<string, unknown>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(invoice)) {
    if (value === null || value === undefined) continue;

    if (key === "signature" && value) {
      // Accept File, Blob, or data URL string
      if (value instanceof File || value instanceof Blob) {
        const file = value as File;
        formData.append(
          "signature",
          file,
          (file as File).name || "signature.png"
        );
      } else if (typeof value === "string") {
        if (value.startsWith("data:")) {
          // Convert data URL to Blob
          const blob = await (await fetch(value)).blob();
          formData.append("signature", blob, "signature.png");
        } else {
          // If backend strictly expects a file, skip non-dataURL strings
          // to avoid validation errors.
          continue;
        }
      } else {
        continue;
      }
    } else {
      formData.append(key, String(value));
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/logistics/invoice/`,
    {
      method: "POST",
      headers: {
        // Let the browser set Content-Type with boundary for multipart/form-data
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text || "Failed to create invoice"}`
    );
  }
  return response.json();
};

export const getInvoices = async (
  filters?: InvoiceFilters
): Promise<PaginatedInvoiceResponse> => {
  const base = `${process.env.NEXT_PUBLIC_API_URL}/api/logistics/invoice/`;
  const params = new URLSearchParams();

  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.pageSize) params.append("page_size", String(filters.pageSize));
  if (filters?.status && filters.status !== "all")
    params.append("status", filters.status);
  if (filters?.isApproved && filters.isApproved !== "all")
    params.append("is_approved", filters.isApproved);
  if (filters?.franchise) params.append("franchise", String(filters.franchise));

  const url = params.toString() ? `${base}?${params.toString()}` : base;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text || "Failed to get invoices"}`
    );
  }
  return response.json();
};
