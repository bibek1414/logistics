"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { SaleItem } from "@/types/sales";
import { BulkPrint } from "./bulk-print";

interface BulkExportProps {
  selectedOrders: Set<string>;
  orders: SaleItem[];
  filename?: string;
}

export function BulkExport({
  selectedOrders,
  orders,
  filename = "orders",
}: BulkExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const prepareOrdersData = () => {
    const selectedOrdersData = orders.filter((order) =>
      selectedOrders.has(order.id.toString())
    );

    return selectedOrdersData.map((order, index) => ({
      "S.No": index + 1,
      "Order Code": order.order_code,
      "Customer Name": order.full_name,
      "Customer Phone": order.phone_number,
      "Customer Address": order.delivery_address,
      "Ordered By": `${order.sales_person.first_name} ${order.sales_person.last_name} ${order.sales_person.phone_number}`,
      Franchise: order.sales_person.franchise,
      "Order Date": new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      Comment: order.comments || "N/A",
    }));
  };

  const exportToExcel = async () => {
    if (selectedOrders.size === 0) return;
    setIsExporting(true);

    try {
      const excelData = prepareOrdersData();

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Auto-size columns
      const colWidths = [
        { wch: 8 },  // S.No
        { wch: 15 }, // Order Code
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Customer Phone
        { wch: 40 }, // Customer Address
        { wch: 40 }, // Ordered By
        { wch: 20 }, // Franchise
        { wch: 22 }, // Order Date
        { wch: 40 }, // Comment
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:-]/g, "");
      const finalFilename = `${filename}_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(wb, finalFilename);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-gray-200 rounded-lg w-fit ml-auto">
      <span className="text-sm font-medium text-blue-800">
        Export {selectedOrders.size} selected order
        {selectedOrders.size !== 1 ? "s" : ""}
      </span>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={exportToExcel}
          disabled={isExporting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </>
          )}
        </Button>

        <BulkPrint 
          selectedOrders={selectedOrders}
          orders={orders}
          filename={filename}
        />
      </div>
    </div>
  );
}