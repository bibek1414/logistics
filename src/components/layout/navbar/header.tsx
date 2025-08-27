"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          </div>

          {/* Mobile Menu - Sheet Component */}
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
                <div>
                  {/* Navigation Links */}
                  <div className="space-y-4">
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
                    <Button
                      asChild
                      variant="default"
                      className="w-1/2"
                      size="lg"
                    >
                      <Link href="/quote" onClick={closeMobileMenu}>
                        Request a Quote
                      </Link>
                    </Button>
                  </div>
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
