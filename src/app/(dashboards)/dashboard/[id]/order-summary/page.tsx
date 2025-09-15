"use client";

import { use } from "react";
import { OrderSummary } from "@/components/dashboard/franchise/order-summary";
import { useFranchises } from "@/hooks/use-franchises";

interface OrderSummaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderSummaryPage({ params }: OrderSummaryPageProps) {
  const { id } = use(params);
  const franchiseId = Number(id);
  const { franchises } = useFranchises();
  
  // Find the current franchise to get its name
  const currentFranchise = franchises.find(franchise => franchise.id === franchiseId);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      
      
      <OrderSummary 
        franchiseId={franchiseId} 
        franchiseName={currentFranchise?.name}
      />
    </div>
  );
}