"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";
import { SaleItem } from "@/types/sales";

interface BulkPrintProps {
  selectedOrders: Set<string>;
  orders: SaleItem[];
  filename?: string;
}

export function BulkPrint({
  selectedOrders,
  orders,
  filename = "orders",
}: BulkPrintProps) {
  const [isPrinting, setIsPrinting] = useState(false);

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
      "Sales Person": `${order.sales_person.first_name} ${order.sales_person.last_name}`,
      "Sales Person Phone": order.sales_person.phone_number,
      Franchise: order.sales_person.franchise,
      "Order Date": new Date(order.sent_to_ydm_date).toLocaleDateString("en-GB", {
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

  const printOrders = async () => {
    if (selectedOrders.size === 0) return;
    setIsPrinting(true);

    try {
      const ordersData = prepareOrdersData();
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      const timestamp = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Generate HTML content with Excel-like styling
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>YDM Orders Report - ${filename}</title>
          <style>
            @media print {
              @page { 
                margin: 0.5in; 
                size: A4 landscape;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;

          <table
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0 0 5px 0;
              font-size: 18px;
              color: #333;
            }
            .header p {
              margin: 0;
              color: #666;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: right;
              vertical-align: top;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #333;
              font-size: 11px;
            }
            td {
              font-size: 10px;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .summary {
              margin-bottom: 15px;
              padding: 10px;
              background-color: #e3f2fd;
              border-left: 4px solid #2196f3;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Returned Orders</h1>
            <p>Date: ${timestamp} | Total Orders: ${ordersData.length}</p>
          </div>
          
          

          <table>
            <thead>
              <tr>
                <th style="width: 5%;">S.No</th>
                <th style="width: 10%;">Order Code</th>
                <th style="width: 15%;">Customer Name</th>
                <th style="width: 10%;">Customer Phone</th>
                <th style="width: 20%;">Customer Address</th>
                <th style="width: 12%;">Ordered By</th>
                <th style="width: 8%;">Franchise</th>
                <th style="width: 12%;">Order Date</th>
                <th style="width: 18%;">Comment</th>
              </tr>
            </thead>
            <tbody>
              ${ordersData.map(order => `
                <tr>
                  <td>${order["S.No"]}</td>
                  <td>${order["Order Code"]}</td>
                  <td>${order["Customer Name"]}</td>
                  <td>${order["Customer Phone"]}</td>
                  <td>${order["Customer Address"]}</td>
                  <td>${order["Sales Person"]} ${order["Sales Person Phone"]}</td>
                  <td>${order["Franchise"]}</td>
                  <td>${order["Order Date"]}</td>
                  <td>${order["Comment"]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

       
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };

    } catch (error) {
      console.error("Print failed:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={printOrders}
      disabled={isPrinting}
      variant="outline"
      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
    >
      {isPrinting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Printing...
        </>
      ) : (
        <>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </>
      )}
    </Button>
  );
}