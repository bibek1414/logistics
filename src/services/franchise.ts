import { Franchise } from "@/types/franchise";
import type { SalesResponse } from "@/types/sales";

export interface FranchiseFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  paymentMethod?: string;
  orderStatus?: string;
  deliveryType?: string;
  logistic?: string;
  salesperson?: string;
  startDate?: string;
  endDate?: string;
  isAssigned?: string;
}

export class FranchiseAPI {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async list(): Promise<Franchise[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(`${this.baseURL}/api/account/franchises`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch franchises"}`
      );
    }

    const json = await response.json();
    return (json.results || json) as Franchise[];
  }

  static async get(
    id: number,
    filters?: FranchiseFilters
  ): Promise<SalesResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    // Build URL with base parameters
    const params = new URLSearchParams();
    params.append("franchise", id.toString());

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }

    if (filters?.pageSize) {
      params.append("page_size", filters.pageSize.toString());
    }

    // Add search parameter if present
    if (filters?.search) {
      params.append("search", filters.search);
    }

    // Add payment_method parameter if selected
    if (filters?.paymentMethod && filters.paymentMethod !== "all") {
      params.append("payment_method", filters.paymentMethod);
    }

    // Add order_status parameter if selected
    if (filters?.orderStatus && filters.orderStatus !== "all") {
      params.append("order_status", filters.orderStatus);
    }

    // Add delivery_type parameter if selected
    if (filters?.deliveryType && filters.deliveryType !== "all") {
      params.append("delivery_type", filters.deliveryType);
    }

    // Add salesperson parameter if selected
    if (filters?.salesperson && filters.salesperson !== "all") {
      params.append("sales_person", filters.salesperson);
    }

    // Add logistic parameter if selected
    if (filters?.logistic && filters.logistic !== "all") {
      params.append("logistics", filters.logistic);
    }

    if (filters?.isAssigned) {
      params.append("is_assigned", filters.isAssigned);
    }

    // Add date range parameters
    if (filters?.startDate) {
      params.append("start_date", filters.startDate);
    }

    if (filters?.endDate) {
      params.append("end_date", filters.endDate);
    }

    const url = `${this.baseURL}/api/sales/orders/?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch franchise"}`
      );
    }

    const json = await response.json();
    return json as SalesResponse;
  }
}
