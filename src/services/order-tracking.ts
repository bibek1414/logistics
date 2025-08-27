import { ApiResponse, OrderData } from "../types/order";

export class OrderTrackingAPI {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  /**
   * Universal tracking method - handles both order codes and dash codes
   */
  static async trackAny(trackingCode: string): Promise<ApiResponse<OrderData>> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/track-order/?order_code=${encodeURIComponent(
          trackingCode
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || "Failed to track order"}`
        );
      }

      const data: OrderData = await response.json();

      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error("Error tracking order:", error);
      return {
        data: {} as OrderData,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Order not found with the provided tracking code",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
