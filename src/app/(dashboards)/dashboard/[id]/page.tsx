"use client";

import { use } from "react";
import FranchiseView from "@/components/dashboard/franchise/franchise-view";

interface FranchiseDashboardProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FranchiseDashboard({
  params,
}: FranchiseDashboardProps) {
  const { id } = use(params); 
  return <FranchiseView id={Number(id)} />;
}
