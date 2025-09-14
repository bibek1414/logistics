import { ApiResponse, OrderData, OrderTrackingResponse } from "../types/order";

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
        // Handle different HTTP status codes
        if (response.status === 404) {
          return {
            data: {} as OrderData,
            success: false,
            message: "Order not found with the provided tracking code",
            error: "Order not found",
          };
        } else if (response.status >= 500) {
          return {
            data: {} as OrderData,
            success: false,
            message: "Server error. Please try again later.",
            error: "Server error",
          };
        } else {
          return {
            data: {} as OrderData,
            success: false,
            message: "Failed to track order. Please check your tracking code and try again.",
            error: `HTTP ${response.status}`,
          };
        }
      }

      // Parse the full response structure
      const responseData: OrderTrackingResponse = await response.json();
      
      // Check if the response indicates no order found (backend specific check)
      if (!responseData.order || !responseData.order.id) {
        return {
          data: {} as OrderData,
          success: false,
          message: "Order not found with the provided tracking code",
          error: "Order not found",
        };
      }

      const orderData: OrderData = {
        ...responseData.order,
        order_change_log: responseData.order_change_log,
        order_comment: responseData.order_comment,
      };

      return {
        data: orderData,
        success: true,
      };
    } catch (error) {
      console.error("Error tracking order:", error);
      
      // Network or parsing errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          data: {} as OrderData,
          success: false,
          message: "Network error. Please check your connection and try again.",
          error: "Network error",
        };
      }
      
      return {
        data: {} as OrderData,
        success: false,
        message: "Order not found with the provided tracking code",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}