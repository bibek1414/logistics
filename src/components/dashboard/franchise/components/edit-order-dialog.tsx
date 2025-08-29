"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Edit,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { SaleItem } from "@/types/sales";
import { useState } from "react";
import { useEditOrder } from "@/hooks/use-edit-order";

interface EditOrderDialogProps {
  order: SaleItem;
}

interface FormErrors {
  full_name?: string;
  phone_number?: string;
  delivery_address?: string;
}

export function EditOrderDialog({ order }: EditOrderDialogProps) {
  const { mutate, isPending } = useEditOrder();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    full_name: order.full_name || "",
    phone_number: order.phone_number || "",
    alternate_phone_number: order.alternate_phone_number || "",
    delivery_address: order.delivery_address || "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Customer name is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }

    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = "Delivery address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    mutate(
      {
        order_id: order.id.toString(),
        data: formData,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFormData({
        full_name: order.full_name || "",
        phone_number: order.phone_number || "",
        alternate_phone_number: order.alternate_phone_number || "",
        delivery_address: order.delivery_address || "",
      });
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-18 bg-transparent">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit order</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            Edit Order
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-sm">
              Track Order - {order.order_code}
            </Badge>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Customer Information
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Enter customer's full name"
                className={
                  errors.full_name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isPending}
              />
              {errors.full_name && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.full_name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Phone className="h-4 w-4" />
              Contact Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-medium">
                  Primary Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={
                    errors.phone_number
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  disabled={isPending}
                />
                {errors.phone_number && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone_number}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="alternate_phone_number"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Alternate Phone <span className="text-xs">(Optional)</span>
                </Label>
                <Input
                  id="alternate_phone_number"
                  type="tel"
                  value={formData.alternate_phone_number || ""}
                  onChange={(e) =>
                    handleChange("alternate_phone_number", e.target.value)
                  }
                  placeholder="+1 (555) 987-6543"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Delivery Information
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_address" className="text-sm font-medium">
                Delivery Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="delivery_address"
                value={formData.delivery_address}
                onChange={(e) =>
                  handleChange("delivery_address", e.target.value)
                }
                placeholder="Enter complete delivery address with landmarks"
                className={`min-h-[80px] resize-none ${
                  errors.delivery_address
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                disabled={isPending}
              />
              {errors.delivery_address && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.delivery_address}
                </div>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
