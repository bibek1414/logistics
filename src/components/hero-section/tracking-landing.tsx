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
    <div className="bg-primary/80 min-h-screen relative overflow-hidden">
      {/* Simplified background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 left-8 w-20 h-20 sm:w-32 sm:h-32 bg-primary-foreground rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-8 w-24 h-24 sm:w-40 sm:h-40 bg-primary-foreground rounded-full blur-xl"></div>
      </div>

      {/* Content with better mobile spacing */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-4 py-8">
        {/* Hero Section - More compact on mobile */}
        <div className="text-center mb-8 sm:mb-12">
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2 sm:mb-4 tracking-tight">
            Track Your Order
          </h1>
          
        </div>

        {/* Tracking Form - Cleaner mobile layout */}
        <div className="max-w-md sm:max-w-lg mx-auto w-full">
          <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Your Tracking Code (e.g., ORD-BF2DF613)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-12 text-base border-2 focus:border-primary"
                  />
          
                </div>

                <Button
                  onClick={handleTrack}
                  disabled={!trackingNumber.trim()}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Track Order
                </Button>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription className="text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
  );
};