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
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
          <div className="hidden md:flex items-center space-x-8">
            {!isLoading && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Button variant="destructive" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
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
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

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
                <div className="space-y-4 mt-4">
                  {!isLoading && user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
