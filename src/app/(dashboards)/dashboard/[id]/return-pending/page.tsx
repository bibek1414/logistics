"use client";

import ReturnPendingView from "@/components/dashboard/franchise/return-pending-view";
import { use } from "react";

interface ReturnPendingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReturnPending({ params }: ReturnPendingPageProps) {
  const { id } = use(params);
  return <ReturnPendingView id={Number(id)} />;
}