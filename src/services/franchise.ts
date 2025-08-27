import { Franchise } from "@/types/franchise";
import type { SalesResponse } from "@/types/sales";

export class FranchiseAPI {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async list(): Promise<Franchise[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(`${this.baseURL}/api/account/franchises`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch franchises"}`
      );
    }

    const json = await response.json();
    return (json.results || json) as Franchise[];
  }

  static async get(id: number): Promise<SalesResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const response = await fetch(
      `${this.baseURL}/api/sales/orders/?franchise=${id}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to fetch franchise"}`
      );
    }

    const json = await response.json();
    return json as SalesResponse;
  }
}
