"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const RiderHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavigationSkeleton = () => (
    <div className="hidden md:flex items-center space-x-8">
      <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
      <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
      <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
    </div>
  );

  const MobileNavigationSkeleton = () => (
    <div className="space-y-4 mt-4">
      <div className="h-12 w-full bg-muted animate-pulse rounded-md"></div>
      <div className="h-12 w-full bg-muted animate-pulse rounded-md"></div>
      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
    </div>
  );

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="YDM Logistics"
                width={120}
                height={120}
                className="h-12 sm:h-16 w-auto"
              />
            </Link>
          </div>

          {/* User Info and Welcome Message */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome, {user.first_name}!
                </p>
                <p className="text-xs text-gray-500">Rider Dashboard</p>
              </div>
            </div>
          )}

          {/* Desktop Navigation Links */}
          {isLoading ? (
            <NavigationSkeleton />
          ) : user ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/ydm-rider/dashboard"
                onClick={closeMobileMenu}
                className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
              >
                Dashboard
              </Link>
              <Button
                variant="destructive"
                onClick={() => logout()}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          ) : (
            // Fallback for non-authenticated users (shouldn't happen in rider context)
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>

              <Button asChild variant="outline" className="hover:bg-muted">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
               

                {isLoading ? (
                  <MobileNavigationSkeleton />
                ) : user ? (
                  <div className="space-y-4 mt-6">
                    {/* User Info in Mobile */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.role.replace("YDM_", "")} • {user.phone_number}
                      </p>
                    </div>

                    {/* Navigation Links */}
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                   Home
                    </Link>
                   

                    <Link
                      href="/ydm-rider/dashboard"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                       Dashboard
                    </Link>

                    {/* Logout Button */}
                    <Button
                      variant="destructive"
                      className="w-fit ml-3"
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        "Logout"
                      )}
                    </Button>
                  </div>
                ) : (
                  // Fallback for non-authenticated users
                  <div className="space-y-4 mt-6">
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      🏠 Home
                    </Link>
                    <Link
                      href="/about"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      ℹ️ About Us
                    </Link>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={closeMobileMenu}>
                        🔑 Login
                      </Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default RiderHeader;
