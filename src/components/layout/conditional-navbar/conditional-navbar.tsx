
"use client";

import { useAuth, Role } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/navbar/header";
import RiderHeader from "@/components/layout/rider-navbar/rider-navbar";

const ConditionalHeader = () => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return null;
  }

  const isRiderRoute = pathname.startsWith('/ydm-rider');

  if ((user && user.role === Role.YDM_Rider) || isRiderRoute) {
    return <RiderHeader />;
  }

  // For all other cases (logistics, operator, or no user), show main header
  return <Header />;
};

export default ConditionalHeader;