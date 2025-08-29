import { RidersResponse } from "@/types/rider";

export class RiderService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async getRiders(filter: string): Promise<RidersResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    let baseurl = `${this.baseURL}/api/logistics/ydm-riders/`;
    if (filter) {
      baseurl += `?search=${filter}`;
    } else {
      baseurl += `?search=`;
    }
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
}
