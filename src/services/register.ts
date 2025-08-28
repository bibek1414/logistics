import { siteConfig } from "@/config/site";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
} from "@/types/user";

const API_BASE_URL = siteConfig.apiBaseUrl;

interface ApiErrorData {
  response?: {
    data?: Record<string, string | string[]> | string;
  };
}

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
    let errorData: Record<string, string | string[]> | string = {};
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch {
      // If parsing fails, keep empty object
    }

    const error = new Error("API Error") as Error & ApiErrorData;
    error.response = { data: errorData };
    throw error;
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
    return (responseData as ApiResponse<T>).data;
  }
  return responseData as T;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/api/account/users/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  await handleResponse(response);
  const data: ApiResponse<User[]> | User[] = await response.json();
  const extractedData = extractData<User[]>(data);

  if (!Array.isArray(extractedData)) {
    throw new Error("Invalid response format from server");
  }

  return extractedData;
};

export const getUserByPhone = async (phoneNumber: string): Promise<User> => {
  const response = await fetch(
    `${API_BASE_URL}/api/account/users/${phoneNumber}/`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  await handleResponse(response);
  const data: ApiResponse<User> | User = await response.json();
  return extractData<User>(data);
};

export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/account/users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  await handleResponse(response);
  const data: ApiResponse<User> | User = await response.json();
  return extractData<User>(data);
};

export const updateUser = async (
  phoneNumber: string,
  userData: UpdateUserRequest
): Promise<User> => {
  const response = await fetch(
    `${API_BASE_URL}/api/account/users/${phoneNumber}/`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    }
  );

  await handleResponse(response);
  const data: ApiResponse<User> | User = await response.json();
  return extractData<User>(data);
};

export const deleteUser = async (phoneNumber: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/account/users/${phoneNumber}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  await handleResponse(response);
};
