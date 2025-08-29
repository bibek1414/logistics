"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role, getRoleDashboardRoute } from "@/context/AuthContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectToRoleDashboard?: boolean;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectToRoleDashboard = true 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (!allowedRoles.includes(user.role)) {
        if (redirectToRoleDashboard) {
          // Redirect to user's role-appropriate dashboard
          const dashboardRoute = getRoleDashboardRoute(user.role);
          router.push(dashboardRoute);
        } else {
          // Redirect to unauthorized page or home
          router.push("/unauthorized");
        }
      }
    }
  }, [user, isLoading, allowedRoles, redirectToRoleDashboard, router]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}