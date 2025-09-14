"use client";
import TodayOrdersView from "@/components/dashboard/franchise/today-orders-view";
import { use } from "react";

interface TodayOrdersPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TodayOrders({ params }: TodayOrdersPageProps) {
  const { id } = use(params);
  return <TodayOrdersView id={Number(id)} />;
}