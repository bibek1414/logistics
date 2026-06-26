import { RidersResponse, RiderCommissionStats, RiderPackageStats, RiderOrdersResponse } from "@/types/rider";

export class RiderService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async getRiders(filter?: string, page?: number, pageSize?: number): Promise<RidersResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const params = new URLSearchParams();
    if (filter) {
      params.append("search", filter);
    }
    if (page) {
      params.append("page", page.toString());
    }
    if (pageSize) {
      params.append("page_size", pageSize.toString());
    }

    const queryString = params.toString();
    const baseurl = `${this.baseURL}/api/logistics/ydm-riders/${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(baseurl, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch riders"}`
      );
    }

    return response.json();
  }

  static async assignRider(orders: string[], rider: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(
      `${this.baseURL}/api/logistics/assign-order/`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          order_ids: orders,
          user_id: rider,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to assign rider"}`
      );
    }

    return response.json();
  }

  static async reassignRider(orders: string[], rider: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(
      `${this.baseURL}/api/logistics/assign-order/`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          order_ids: orders,
          user_id: rider,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to reassign rider"}`
      );
    }

    return response.json();
  }

  static async getRiderCommissionStats(
    riderPhone: string,
    startDate?: string,
    endDate?: string
  ): Promise<RiderCommissionStats> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const params = new URLSearchParams();
    params.append("rider", riderPhone);
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }

    const queryString = params.toString();
    const baseurl = `${this.baseURL}/api/logistics/rider-commission-stats/${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(baseurl, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch rider commission stats"}`
      );
    }

    return response.json();
  }

  static async getRiderPackageStats(
    riderPhone: string,
    startDate?: string,
    endDate?: string
  ): Promise<RiderPackageStats> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const params = new URLSearchParams();
    params.append("rider", riderPhone);
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }

    const queryString = params.toString();
    const baseurl = `${this.baseURL}/api/logistics/rider-package-stats/${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(baseurl, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch rider package stats"}`
      );
    }

    return response.json();
  }

  static async getRiderOrders(
    riderPhone: string,
    page?: number,
    pageSize?: number
  ): Promise<RiderOrdersResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const params = new URLSearchParams();
    params.append("rider", riderPhone);
    if (page) {
      params.append("page", page.toString());
    }
    if (pageSize) {
      params.append("page_size", pageSize.toString());
    }

    const queryString = params.toString();
    const baseurl = `${this.baseURL}/api/logistics/rider-orders/${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(baseurl, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch rider orders"}`
      );
    }

    return response.json();
  }
}

