"use client";
import React, { useState } from "react";
import { Search, Package } from "lucide-react";
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

export const TrackingLanding: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleTrack = () => {
    setError(null);

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    // Navigate to tracking page
    window.location.href = `/track-order/${encodeURIComponent(
      trackingNumber.trim()
    )}`;
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
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-foreground rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-foreground rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-foreground rounded-full blur-xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-full p-4">
              <Package className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 tracking-tight">
            Track Your Order
          </h1>

          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Get real-time updates on your shipment status. Enter your order code
            or tracking number to see detailed progress and delivery
            information.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card text-card-foreground border shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold">
                Enter Your Tracking Number
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Track your order using order code (e.g., ORD-BF2DF613) or
                tracking number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Your Order Code or Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 text-lg"
                />
                <Button
                  onClick={handleTrack}
                  disabled={!trackingNumber.trim()}
                  className="h-12 px-8"
                >
                  <Search className="w-5 h-5 mr-2" />
                  TRACK
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Help Section */}
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                  Need help finding your tracking number?
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Order codes start with "ORD-" (e.g., ORD-BF2DF613)</p>
                  <p>• Tracking numbers are provided by the delivery service</p>
                  <p>• Check your order confirmation email or SMS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center text-primary-foreground/80">
            <div className="bg-primary-foreground/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm">
              Get live updates on your order status and location
            </p>
          </div>

          <div className="text-center text-primary-foreground/80">
            <div className="bg-primary-foreground/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Easy Tracking</h3>
            <p className="text-sm">
              Simply enter your order code or tracking number
            </p>
          </div>

          <div className="text-center text-primary-foreground/80">
            <div className="bg-primary-foreground/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-2">Delivery Timeline</h3>
            <p className="text-sm">
              View complete journey from order to delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
