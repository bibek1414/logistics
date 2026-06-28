import {
  YdmLogisticsSettings,
  YdmLogisticsSettingsPayload,
} from "@/types/logistics-settings";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const ENDPOINT = `${BASE_URL}/api/logistics/settings/`;

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

export const LogisticsSettingsService = {
  /** GET current settings (returns list or single object from API) */
  async get(): Promise<YdmLogisticsSettings | null> {
    const response = await fetch(ENDPOINT, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<
      YdmLogisticsSettings | YdmLogisticsSettings[]
    >(response);
    const result = Array.isArray(data) ? data[0] : data;
    return result ?? null;
  },

  /** POST – always POST to the base endpoint (create or overwrite) */
  async save(
    payload: YdmLogisticsSettingsPayload,
  ): Promise<YdmLogisticsSettings> {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<YdmLogisticsSettings>(response);
  },
};
