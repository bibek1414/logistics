"use client";
import React, { useState } from "react";
import { Search, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function ShipmentTrackingLanding() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  return (
    <div className="bg-primary min-h-screen relative overflow-hidden">
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
            Track Your Shipment
          </h1>

          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Get the status of your shipment quickly. Our online result gives you
            real-time, detailed progress as your shipment moves & you can keep a
            constant eye on your delivery and view its status at any time.
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
                Track packages from any carrier worldwide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Your Tracking Number eg (123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button
                  disabled={isTracking || !trackingNumber.trim()}
                  className="h-12 px-8"
                >
                  {isTracking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      TRACK
                    </>
                  )}
                </Button>
              </div>

              {trackingResult && (
                <div className="mt-8 space-y-6">
                  <Separator />

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Tracking Timeline
                    </h4>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
