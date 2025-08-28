"use client";

import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export function Navigation() {
  const { id } = useParams();
  const pathname = usePathname();
  const dashboardId = Array.isArray(id) ? id[0] : id;
  const basePath = `/dashboard/${dashboardId}`;
  const isDashboardPage = pathname === basePath || pathname === `${basePath}/`;
  const isOrdersPage = pathname.startsWith(`${basePath}/orders`);
  return (
    <div className="mb-6">
      <nav className="flex space-x-0.5 items-center justify-center max-w-[230px] mx-auto bg-white rounded-lg p-1 shadow-none border">
        <Button
          asChild
          variant={isDashboardPage ? "default" : "ghost"}
          className={`${
            isDashboardPage
              ? "bg-primary hover:bg-primary/90 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          } px-4 py-2 rounded-md text-sm font-medium`}
        >
          <Link href={basePath}>DASHBOARD</Link>
        </Button>
        <Button
          asChild
          variant={isOrdersPage ? "default" : "ghost"}
          className={`${
            isOrdersPage
              ? "bg-primary hover:bg-primary/90 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          } px-4 py-2 rounded-md text-sm font-medium`}
        >
          <Link href={`${basePath}/orders`}>ORDERS</Link>
        </Button>
      </nav>
    </div>
  );
}
