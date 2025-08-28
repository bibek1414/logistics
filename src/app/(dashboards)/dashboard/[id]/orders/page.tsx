"use client";

import FranchiseView from "@/components/dashboard/franchise/franchise-view";
import { use } from "react";

interface FranchiseDashboardProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Orders({ params }: FranchiseDashboardProps) {
  const { id } = use(params);
  return <FranchiseView id={Number(id)} />;
}
