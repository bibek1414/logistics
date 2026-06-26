import { RiderCommissionRate } from "@/types/rider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const ENDPOINT = `${BASE_URL}/api/logistics/rider-commission-rate/`;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || "Request failed"}`);
  }

  return response.json() as Promise<T>;
}

export const RiderCommissionRateService = {
  /** List all commission rate slabs (no pagination) */
  async getAll(): Promise<RiderCommissionRate[]> {
    const response = await fetch(ENDPOINT, {
      headers: getAuthHeaders(),
    });
    return handleResponse<RiderCommissionRate[]>(response);
  },

  /** Create a new commission rate slab */
  async create(
    payload: Omit<RiderCommissionRate, "id">
  ): Promise<RiderCommissionRate> {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<RiderCommissionRate>(response);
  },

  /** Update an existing commission rate slab */
  async update(
    id: number,
    payload: Partial<Omit<RiderCommissionRate, "id">>
  ): Promise<RiderCommissionRate> {
    const response = await fetch(`${ENDPOINT}${id}/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<RiderCommissionRate>(response);
  },

  /** Delete a commission rate slab */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${ENDPOINT}${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text || "Delete failed"}`);
    }
  },
};
