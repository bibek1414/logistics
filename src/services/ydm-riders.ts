import { siteConfig } from "@/config/site";
import { SalesResponse } from "@/types/sales";

const API_BASE_URL = siteConfig.apiBaseUrl;

interface YDMRiderOrderFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  orderStatus?: string;
  startDate?: string;
  endDate?: string;
}

export class YDMRiderOrdersAPI {
  private static getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      Accept: "application/json",
    };
  };

  private static handleResponse = async (response: Response) => {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || "Request failed"}`
      );
    }
    return response;
  };

  static async getYDMRiderOrders(
    filters?: YDMRiderOrderFilters
  ): Promise<SalesResponse> {
    const params = new URLSearchParams();

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.pageSize) {
      params.append("page_size", filters.pageSize.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.orderStatus && filters.orderStatus !== "all") {
      params.append("order_status", filters.orderStatus);
    }
    if (filters?.startDate) {
      params.append("start_date", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("end_date", filters.endDate);
    }

    const url = `${API_BASE_URL}/api/sales/orders/?${params.toString()}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);
    return response.json() as Promise<SalesResponse>;
  }

  static async updateOrderStatus(
    orderId: string,
    newStatus: string
  ): Promise<unknown> {
    const url = `${API_BASE_URL}/api/sales/orders/${orderId}/`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        order_status: newStatus,
      }),
    });

    await this.handleResponse(response);
    return response.json();
  }
}
