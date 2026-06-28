"use client";

import { useState, useEffect } from "react";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { Role } from "@/context/AuthContext";
import {
  useLogisticsSettings,
  useLogisticsSettingsMutations,
} from "@/hooks/use-logistics-settings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function DeliveryChargesPage() {
  const { data: settings, isLoading, error } = useLogisticsSettings();

  const [insideCharge, setInsideCharge] = useState("");
  const [outsideCharge, setOutsideCharge] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Prefill form when data loads
  useEffect(() => {
    if (settings) {
      setInsideCharge(settings.inside_ringroad_charge);
      setOutsideCharge(settings.outside_ringroad_charge);
    }
  }, [settings]);

  const { saveMutation } = useLogisticsSettingsMutations({
    onSuccess: () => {
      setSuccessMsg("Settings saved successfully!");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 3500);
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to save settings.");
      setSuccessMsg("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Always POST — backend handles create-or-overwrite
    saveMutation.mutate({
      inside_ringroad_charge: insideCharge,
      outside_ringroad_charge: outsideCharge,
    });
  };

  return (
    <RoleGuard allowedRoles={[Role.YDM_Operator, Role.YDM_Logistics]}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Main card */}
        <Card className="shadow-none border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Delivery Charge Configuration
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              These charges are applied automatically when a rider verifies an
              order based on its delivery location type.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-red-600 text-sm py-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Failed to load settings: {error.message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inside Ringroad */}
                <div className="space-y-2">
                  <Label
                    htmlFor="inside_charge"
                    className="text-sm font-medium text-gray-700"
                  >
                    Inside Ringroad Charge (Rs.)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                      Rs.
                    </span>
                    <Input
                      id="inside_charge"
                      type="number"
                      min="0"
                      step="0.01"
                      value={insideCharge}
                      onChange={(e) => setInsideCharge(e.target.value)}
                      required
                      className="pl-10"
                      placeholder="100.00"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Default charge applied for deliveries inside the ring road.
                  </p>
                </div>

                {/* Outside Ringroad */}
                <div className="space-y-2">
                  <Label
                    htmlFor="outside_charge"
                    className="text-sm font-medium text-gray-700"
                  >
                    Outside Ringroad Charge (Rs.)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                      Rs.
                    </span>
                    <Input
                      id="outside_charge"
                      type="number"
                      min="0"
                      step="0.01"
                      value={outsideCharge}
                      onChange={(e) => setOutsideCharge(e.target.value)}
                      required
                      className="pl-10"
                      placeholder="150.00"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Default charge applied for deliveries outside the ring road.
                  </p>
                </div>

                {/* Feedback */}
                {successMsg && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>

                  {settings && (
                    <span className="text-xs text-gray-400">
                      Current: Inside Rs.&nbsp;{settings.inside_ringroad_charge}{" "}
                      / Outside Rs.&nbsp;{settings.outside_ringroad_charge}
                    </span>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
