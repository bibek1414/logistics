import type { SaleItem } from "@/types/sales";

export async function printOrders({ orders }: { orders: SaleItem[] }) {
  // Minimal client-only print implementation
  try {
    const html = `
      <html>
        <head>
          <title>Orders</title>
          <style>
            body { font-family: sans-serif; padding: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
          </style>
        </head>
        <body>
          <h2>Orders (${orders.length})</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Products</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .map(
                  (o, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${o.full_name}</td>
                  <td>${o.phone_number}</td>
                  <td>${o.delivery_address}, ${o.city}</td>
                  <td>${o.order_products
                    .map((p) => `${p.product.name} x${p.quantity}`)
                    .join(", ")}</td>
                  <td>${o.total_amount}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  } catch (e) {
    console.error("printOrders failed", e);
  }
}
