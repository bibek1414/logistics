import { RidersResponse } from "@/types/rider";

export class EditOrderService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async editOrder(order_id: string, data: any) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(
      `${this.baseURL}/api/sales/orders/${order_id}/`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          ...data,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to edit order"}`
      );
    }

    return response.json();
  }
}
