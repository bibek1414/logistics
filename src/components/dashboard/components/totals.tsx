"use client";
import { useDashboardStats } from "@/hooks/use-dashboard";
import React from "react";

// Helper to prettify keys
const formatKey = (key: string) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function Totals({ id }: { id: number }) {
  const { stats, isLoading: isLoadingStats } = useDashboardStats(id);

  if (isLoadingStats) {
    return <div>Loading...</div>;
  }

  if (!stats?.data) {
    return <div>No data available</div>;
  }

  // Helper function to format amount
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  let totalOrdersNos = 0;
  let totalOrdersAmount = 0;

  const categories: {
    name: string;
    rows: { status: string; nos: number; amount: number }[];
    subtotalNos: number;
    subtotalAmount: number;
  }[] = [];

  Object.entries(stats.data).forEach(([category, value]) => {
    if (category === "Total Orders") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalOrdersNos = (value as any).nos;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalOrdersAmount = (value as any).amount;
      return;
    }

    if (typeof value === "object" && !("nos" in value)) {
      let subtotalNos = 0;
      let subtotalAmount = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = Object.entries(value).map(([status, details]: any) => {
        subtotalNos += details.nos;
        subtotalAmount += details.amount;

        return {
          status: formatKey(status),
          nos: details.nos,
          amount: details.amount,
        };
      });

      categories.push({
        name: formatKey(category),
        rows,
        subtotalNos,
        subtotalAmount,
      });
    }
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Order Analytics</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">Category</th>
              <th className="px-4 py-2 text-left border">Status</th>
              <th className="px-4 py-2 text-right border">Nos</th>
              <th className="px-4 py-2 text-right border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <React.Fragment key={idx}>
                {cat.rows.map((row, rowIdx) => (
                  <tr key={`${idx}-${rowIdx}`}>
                    {rowIdx === 0 && (
                      <td
                        className="px-4 py-2 border font-semibold align-top"
                        rowSpan={cat.rows.length + 1} // +1 for subtotal row
                      >
                        {cat.name}
                      </td>
                    )}
                    <td className="px-4 py-2 border">{row.status}</td>
                    <td className="px-4 py-2 border text-right">{row.nos}</td>
                    <td className="px-4 py-2 border text-right">
                      {formatAmount(row.amount)}
                    </td>
                  </tr>
                ))}
                {/* Subtotal Row */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-2 border text-right">Subtotal</td>
                  <td className="px-4 py-2 border text-right">
                    {cat.subtotalNos}
                  </td>
                  <td className="px-4 py-2 border text-right">
                    {formatAmount(cat.subtotalAmount)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="bg-gray-200 font-bold">
            <tr>
              <td className="px-4 py-2 border text-right" colSpan={2}>
                Total Orders
              </td>
              <td className="px-4 py-2 border text-right">{totalOrdersNos}</td>
              <td className="px-4 py-2 border text-right">
                {formatAmount(totalOrdersAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
