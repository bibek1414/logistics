import { RidersResponse } from "@/types/rider";

export class RiderService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async getRiders(): Promise<RidersResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(`${this.baseURL}/api/logistics/ydm-riders/`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch riders"}`
      );
    }

    return response.json();
  }
}
