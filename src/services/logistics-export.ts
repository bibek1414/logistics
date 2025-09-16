import { OrderStatus } from './../types/order';
export interface LogisticsExportFilters {
  franchise?: number;
  startDate?: string;
  endDate?: string;
  orderStatus?:string;
}

export class LogisticsAPI {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async exportOrders(filters: LogisticsExportFilters): Promise<Blob> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    // Build URL with parameters
    const params = new URLSearchParams();
    
    if (filters.franchise) {
      params.append("franchise", filters.franchise.toString());
    }
    
    if (filters.startDate) {
      params.append("start_date", filters.startDate);
    }
    
    if (filters.endDate) {
      params.append("end_date", filters.endDate);
    }
 if (filters.orderStatus && filters.orderStatus !== "all") {
      params.append("order_status", filters.orderStatus);
    }
    

    const url = `${this.baseURL}/api/logistics/export-orders/?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || "Failed to export orders"}`
      );
    }

    return response.blob();
  }

  static downloadCSV(blob: Blob, filename: string = "orders-export") {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Add timestamp to filename
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `${filename}-${timestamp}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}