"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Search,
} from "lucide-react";

const Footer = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTrack = () => {
    setError(null);

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    try {
      // Navigate to the tracking page
      router.push(`/track-order/${encodeURIComponent(trackingNumber.trim())}`);

      // Clear the input after successful navigation
      setTrackingNumber("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && trackingNumber.trim()) {
      handleTrack();
    }
  };

  return (
    <footer className="bg-secondary text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Track Parcel Section - Centered */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <Card className="bg-muted border-primary/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-background rounded-lg">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Track your Parcel
                      </h3>
                      <p className="text-muted-foreground">
                        Enter the Tracking ID
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-1 max-w-md gap-2">
                      <Input
                        placeholder="Tracking Code"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-background"
                      />
                      <Button
                        onClick={handleTrack}
                        disabled={!trackingNumber.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        TRACK ORDER
                      </Button>
                    </div>
                    {/* Error Display */}
                    {error && (
                      <Alert variant="destructive" className="max-w-md">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.png"
                    alt="YDM Logistics"
                    width={120}
                    height={40}
                    className="h-16 w-auto"
                  />
                </div>
                <p className="text-muted-foreground text-sm">YDM Logistics</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">
                  QUICK LINKS
                </h4>
                <div className="space-y-2">
                  <Link
                    href="/about"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/services"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    Our Services
                  </Link>
                  <Link
                    href="/branches"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    Our Branches
                  </Link>
                  <Link
                    href="/terms"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/privacy"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy & Policy
                  </Link>
                  <Link
                    href="/careers"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Contact Us */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">
                  CONTACT US
                </h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-foreground mb-1">
                      ADDRESS
                    </h5>
                    <p className="text-muted-foreground text-sm">
                      Kathmandu, Nepal
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-1">PHONE</h5>
                    <p className="text-muted-foreground text-sm">
                      +977-1-XXXXXXX
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} YDM Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
