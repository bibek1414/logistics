export type UserRole = "YDM_Logistics" | "YDM_Rider" | "YDM_Operator";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
  franchise: string | null;
  email?: string;
  address?: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: UserRole;
  password: string;
  franchise?: string | null;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  password?: string;
  franchise?: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
