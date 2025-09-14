"use client";

import { useAuth, Role } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/header/header";
import RiderHeader from "@/components/layout/rider-header/rider-header";
import { useEffect, useState } from "react";

const ConditionalHeader = () => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [headerType, setHeaderType] = useState<'main' | 'rider' | null>(null);

  useEffect(() => {
    // Determine header type based on route first (faster than waiting for user)
    const isRiderRoute = pathname.startsWith('/ydm-rider');
    
    if (isRiderRoute) {
      setHeaderType('rider');
    } else if (user?.role === Role.YDM_Rider && !isRiderRoute) {
      // Redirect rider to their dashboard if they're on wrong route
      setHeaderType('rider');
    } else {
      setHeaderType('main');
    }
  }, [pathname, user?.role]);

  // Show header immediately based on route, don't wait for auth loading
  if (headerType === 'rider') {
    return <RiderHeader />;
  }

  // For all other cases, show main header
  return <Header />;
};

export default ConditionalHeader;