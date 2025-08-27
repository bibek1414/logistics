"use client";
import React, { useState } from "react";
import { Search, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrderTracking } from "@/hooks/use-order-tracking";

interface TrackingLandingProps {
  onTrackingFound?: () => void;
}

export const TrackingLanding: React.FC<TrackingLandingProps> = ({
  onTrackingFound,
}) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { validateTrackingCode } = useOrderTracking();

  const handleTrack = () => {
    setError(null);

    try {
      // Use the hook's validation utility
      const validatedCode = validateTrackingCode(trackingNumber);

      // Handle navigation at component level
      router.push(`/track-order/${encodeURIComponent(validatedCode)}`);

      // Call the callback if provided
      if (onTrackingFound) {
        onTrackingFound();
      }
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
    <div className="bg-primary min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary-foreground rounded-full blur-xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary-foreground rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-16 sm:w-24 h-16 sm:h-24 bg-primary-foreground rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-full p-3 sm:p-4">
              <Package className="w-8 h-8 sm:w-12 sm:h-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 tracking-tight px-4">
            Track Your Order
          </h1>

          <p className="text-base sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            Get real-time updates on your shipment status. Enter your order code
            or tracking number to see detailed progress and delivery
            information.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-card text-card-foreground border shadow-2xl">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-semibold">
                Enter Your Tracking Number
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base px-2">
                Track your order using order code (e.g., ORD-BF2DF613) or
                tracking number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Your Order Code or Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 text-base sm:text-lg"
                />
                <Button
                  onClick={handleTrack}
                  disabled={!trackingNumber.trim()}
                  className="h-12 px-6 sm:px-8 w-full sm:w-auto"
                  size="lg"
                >
                  <Search className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                  TRACK
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Help Section */}
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                  Need help finding your tracking number?
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <p>
                    • Order codes start with &apos;ORD-&apos; (e.g.,
                    ORD-BF2DF613)
                  </p>
                  <p>• Tracking numbers are provided by the delivery service</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          <div className="text-center text-primary-foreground/80">
            <div className="bg-primary-foreground/10 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 sm:w-8 h-6 sm:h-8" />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Real-time Updates
            </h3>
            <p className="text-xs sm:text-sm">
              Get live updates on your order status and location
            </p>
          </div>

          <div className="text-center text-primary-foreground/80">
            <div className="bg-primary-foreground/10 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 sm:w-8 h-6 sm:h-8" />
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Easy Tracking
            </h3>
            <p className="text-xs sm:text-sm">
              Simply enter your order code or tracking number
            </p>
          </div>

          <div className="text-center text-primary-foreground/80 sm:col-span-1 col-span-1">
            <div className="bg-primary-foreground/10 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mx-auto mb-4">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              Delivery Timeline
            </h3>
            <p className="text-xs sm:text-sm">
              View complete journey from order to delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
