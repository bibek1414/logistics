import { OrderChart } from "@/components/dashboard/components/order-chart";
import { SidebarStats } from "@/components/dashboard/components/sidebar-stats";
import { StatusCards } from "@/components/dashboard/components/status-cards";
import { Totals } from "@/components/dashboard/components/totals";

import { use } from "react";

interface FranchiseDashboardProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Dashboard({ params }: FranchiseDashboardProps) {
  const { id } = use(params);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-fit mx-auto">
      {/* Left side - Status Cards and Chart */}
      <div className="lg:col-span-3 space-y-4">
        <StatusCards id={Number(id)} />
        <Totals id={Number(id)} />
        <OrderChart id={Number(id)} />
      </div>

      {/* Right Sidebar */}
      <SidebarStats id={Number(id)} />
    </div>
  );
}
