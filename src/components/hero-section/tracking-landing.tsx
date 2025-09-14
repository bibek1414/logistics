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
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary-foreground rounded-full blur-xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary-foreground rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 tracking-tight px-4">
            Track Your Order
          </h1>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-card text-card-foreground border ">
            <CardContent className="">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Your Tracking Code (e.g., ORD-BF2DF613)"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
