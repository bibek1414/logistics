import { siteConfig } from "@/config/site";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
} from "@/types/user";

const API_BASE_URL = siteConfig.apiBaseUrl;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle auth errors
const handleAuthError = (response: Response) => {
  if (response.status === 401) {
    // Token might be expired, redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
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

  if (!response.ok) {
    handleAuthError(response);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch users: ${response.status}`
    );
  }

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

  if (!response.ok) {
    handleAuthError(response);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch user: ${response.status}`
    );
  }

  const data: ApiResponse<User> | User = await response.json();
  const extractedData = extractData<User>(data);
  return extractedData;
};

export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/account/users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    handleAuthError(response);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create user: ${response.status}`
    );
  }

  const data: ApiResponse<User> | User = await response.json();
  const extractedData = extractData<User>(data);
  return extractedData;
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

  if (!response.ok) {
    handleAuthError(response);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update user: ${response.status}`
    );
  }

  const data: ApiResponse<User> | User = await response.json();
  const extractedData = extractData<User>(data);
  return extractedData;
};

export const deleteUser = async (phoneNumber: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/account/users/${phoneNumber}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    handleAuthError(response);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete user: ${response.status}`
    );
  }
};
