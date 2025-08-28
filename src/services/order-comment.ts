import { siteConfig } from "@/config/site";
import {
  OrderComment,
  CreateOrderCommentRequest,
  ApiResponse,
} from "@/types/order-comment";

const API_BASE_URL = siteConfig.apiBaseUrl;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Simplified error handling
const handleResponse = async (response: Response) => {
  if (response.status === 401) {
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

  return response;
};

// Helper to extract data from API response
const extractData = <T>(responseData: ApiResponse<T> | T): T => {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as ApiResponse<T>).data!;
  }
  return responseData as T;
};

export const createOrderComment = async (
  commentData: CreateOrderCommentRequest
): Promise<OrderComment> => {
  const response = await fetch(`${API_BASE_URL}/api/logistics/order-comment/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(commentData),
  });

  await handleResponse(response);
  const data: ApiResponse<OrderComment> | OrderComment = await response.json();
  return extractData<OrderComment>(data);
};
