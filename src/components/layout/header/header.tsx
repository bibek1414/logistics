"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Loader2,
  ChevronDown,
  Settings2,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useAuth, Role } from "@/context/AuthContext";

/** Desktop hover-dropdown for Settings */
const SettingsDropdown = () => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1 text-foreground hover:text-primary transition-colors font-medium focus:outline-none"
      >
        Settings
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="bg-white border border-gray-200 rounded-xl  overflow-hidden min-w-[200px]">
            <Link
              href="/commissions"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              <div>
                <div className="font-medium">Commission</div>
                <div className="text-xs text-gray-400">Manage rider slabs</div>
              </div>
            </Link>

            <div className="h-px bg-gray-100 mx-3" />

            <Link
              href="/delivery-charges"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              <div>
                <div className="font-medium">Delivery Charges</div>
                <div className="text-xs text-gray-400">Ringroad zone rates</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

/** Mobile collapsible settings section */
const MobileSettingsSection = ({ onClose }: { onClose: () => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-sm font-medium text-foreground py-3 px-4 rounded-md hover:bg-muted transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">Settings</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="ml-4 border-l border-gray-200 pl-3 space-y-1 mb-1">
          <Link
            href="/commissions"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-muted"
          >
            Commission
          </Link>
          <Link
            href="/delivery-charges"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-muted"
          >
            Delivery Charges
          </Link>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const isOperatorOrLogistics = useMemo(() => {
    return (
      user &&
      (user.role === Role.YDM_Operator || user.role === Role.YDM_Logistics)
    );
  }, [user]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAuthenticatedUser = useMemo(() => Boolean(user), [user]);
  const isLogoutLoading = useMemo(() => isLoading, [isLoading]);

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
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>

            {isAuthenticatedUser ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Franchise List
                </Link>
                {isOperatorOrLogistics && (
                  <>
                    <Link
                      href="/riders"
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      Riders
                    </Link>
                    {/* Settings dropdown (Commission + Delivery Charges) */}
                    <SettingsDropdown />
                  </>
                )}
                <Button asChild variant="default" size="sm">
                  <Link href="/user-management">User Management</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => logout()}
                  disabled={isLogoutLoading}
                >
                  {isLogoutLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                className="hover:bg-muted"
                size="sm"
              >
                <Link href="/login">Login</Link>
              </Button>
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

                <div className="space-y-1 mt-4">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                  >
                    Home
                  </Link>

                  {isAuthenticatedUser ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                      >
                        Franchise List
                      </Link>
                      {isOperatorOrLogistics && (
                        <>
                          <Link
                            href="/riders"
                            onClick={closeMobileMenu}
                            className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-md hover:bg-muted"
                          >
                            Riders
                          </Link>
                          {/* Mobile collapsible Settings section */}
                          <MobileSettingsSection onClose={closeMobileMenu} />
                        </>
                      )}
                      <div className="flex flex-col gap-2 w-fit">
                        <Button
                          asChild
                          variant="outline"
                          className="w-fit border-none"
                        >
                          <Link
                            href="/user-management"
                            onClick={closeMobileMenu}
                          >
                            User Management
                          </Link>
                        </Button>

                        <Button
                          variant="destructive"
                          className="w-fit ml-3"
                          onClick={() => {
                            logout();
                            closeMobileMenu();
                          }}
                          disabled={isLogoutLoading}
                        >
                          {isLogoutLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging out...
                            </>
                          ) : (
                            "Logout"
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={closeMobileMenu}>
                        Login
                      </Link>
                    </Button>
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
