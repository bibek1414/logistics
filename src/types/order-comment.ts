export interface OrderCommentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  franchise: string | null;
  address: string;
}

export interface OrderComment {
  id: number;
  order: number;
  user: OrderCommentUser;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderCommentRequest {
  order: number;
  comment: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}
