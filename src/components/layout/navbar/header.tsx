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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavigationSkeleton = () => (
    <div className="hidden md:flex items-center space-x-8">
      <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
      <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
      <div className="h-9 w-28 bg-muted animate-pulse rounded"></div>
      <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
    </div>
  );

  const MobileNavigationSkeleton = () => (
    <div className="space-y-4 mt-4">
      <div className="h-12 w-full bg-muted animate-pulse rounded-md"></div>
      <div className="h-12 w-full bg-muted animate-pulse rounded-md"></div>
      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
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
                href="/about"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Button asChild variant="default">
                <Link href="/register">Register</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => logout()}
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
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                About Us
              </Link>
              <Button asChild variant="default">
                <Link href="/quote">Request a Quote</Link>
              </Button>
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
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>

                {isLoading ? (
                  <MobileNavigationSkeleton />
                ) : user ? (
                  <div className="space-y-4 mt-4">
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      Home
                    </Link>
                    <Link
                      href="/about"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      Dashboard
                    </Link>
                    <Button asChild variant="default" className="w-full">
                      <Link href="/register" onClick={closeMobileMenu}>
                        Register
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
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
                  <div className="space-y-4 mt-4">
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      Home
                    </Link>
                    <Link
                      href="/about"
                      onClick={closeMobileMenu}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                    >
                      About Us
                    </Link>
                    <Button asChild variant="default" className="w-full">
                      <Link href="/quote" onClick={closeMobileMenu}>
                        Request a Quote
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={closeMobileMenu}>
                        Login
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

export default Header;
