"use client";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { useFranchises } from "@/hooks/use-franchises"; 

export function Navigation() {
  const { id } = useParams();
  const pathname = usePathname();
  const { franchises, isLoading } = useFranchises();
  
  const dashboardId = Array.isArray(id) ? id[0] : id;
  const basePath = dashboardId ? `/dashboard/${dashboardId}` : "/dashboard";
  
  const isDashboardPage = pathname === basePath || pathname === `${basePath}/`;
  const isOrdersPage = pathname === `${basePath}/orders`;
  const isTodayOrdersPage = pathname === `${basePath}/today-orders`;
  const isReturnPendingPage = pathname === `${basePath}/return-pending`;

  // Find the current franchise based on the dashboard ID
  const currentFranchise = useMemo(() => {
    if (!dashboardId || !franchises.length) return null;
    return franchises.find(franchise => franchise.id === parseInt(dashboardId)) || null;
  }, [dashboardId, franchises]);

  const navigationItems = useMemo(
    () => [
      { href: basePath, label: "Dashboard", isActive: isDashboardPage },
      { href: `${basePath}/orders`, label: "All Orders", isActive: isOrdersPage },
      { href: `${basePath}/today-orders`, label: "Today Orders", isActive: isTodayOrdersPage },
      { href: `${basePath}/return-pending`, label: "Return Pending", isActive: isReturnPendingPage },
    ],
    [basePath, isDashboardPage, isOrdersPage, isTodayOrdersPage, isReturnPendingPage]
  );

  return (
    <div className="mb-6">
 
       <div className="fixed  top-10 left-1/2 -translate-x-1/2 z-50   mx-auto ">
        <div className="bg-white/90 ">
          
          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {isLoading ? (
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 rounded"></div>
            ) : currentFranchise ? (
              currentFranchise.name
            ) : (
              "No franchise selected"
            )}
          </div>
          
        </div>
      </div>
      {/* Main Navigation */}
      <nav
        aria-label="Primary"
        className="sticky top-4 z-30 mx-auto w-full max-w-max rounded-2xl border bg-white/70 p-1 shadow-sm ring-1 ring-black/5 backdrop-blur-md dark:bg-neutral-900/60 dark:ring-white/10"
      >
        
        <ul className="flex  flex-wrap items-center gap-1">
          {navigationItems.map((item) => {
            const activeClasses =
              "bg-primary text-primary-foreground shadow hover:bg-primary/90";
            const baseClasses =
              "text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10";
            
            return (
            
              <li key={item.href}>
                <Button
                  asChild
                  size="sm"
                  variant={item.isActive ? "default" : "ghost"}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 data-[active=true]:translate-y-[-1px] ${
                    item.isActive ? activeClasses : baseClasses
                  }`}
                  data-active={item.isActive}
                >
                  <Link
                    href={item.href}
                    prefetch={false}
                    aria-current={item.isActive ? "page" : undefined}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}