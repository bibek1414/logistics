import { siteConfig } from "@/config/site";
import {
  OrderComment,
  CreateOrderCommentRequest,
  ApiResponse,
} from "@/types/order-comment";
import {
  orderCommentsResponseSchema,
  createOrderCommentRequestSchema,
  orderCommentSchema,
} from "@/schemas/order-comment";

const API_BASE_URL = siteConfig.apiBaseUrl;

export class OrderCommentAPI {
  private static baseURL = API_BASE_URL;

  /**
   * Get auth headers with token
   */
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response
   */
  private static async handleResponse(response: Response): Promise<void> {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || "Request failed"}`
      );
    }
  }

  /**
   * Extract data from API response
   */
  private static extractData<T>(data: ApiResponse<T> | T): T {
    if (typeof data === "object" && data !== null && "data" in data) {
      return (data as ApiResponse<T>).data!;
    }
    return data as T;
  }

  /**
   * Create a new comment for an order
   */
  static async createOrderComment(
    request: CreateOrderCommentRequest
  ): Promise<OrderComment> {
    // Validate request with Zod
    createOrderCommentRequestSchema.parse(request);

    const response = await fetch(
      `${this.baseURL}/api/logistics/order-comment/`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      }
    );

    await this.handleResponse(response);
    const data: ApiResponse<OrderComment> | OrderComment =
      await response.json();
    const extractedData = this.extractData<OrderComment>(data);

    // Validate response with Zod
    const validatedData = orderCommentSchema.parse(extractedData);
    return validatedData;
  }
}
