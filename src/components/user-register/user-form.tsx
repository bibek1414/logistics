"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  createUserSchema,
  CreateUserFormData,
  userRoles,
} from "@/schemas/user";
import { UserRole, User } from "@/types/user";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";

interface UserFormProps {
  user?: User; // If provided, form is in edit mode
  onUserSaved?: () => void; // Called after successful create/update
  onCancel?: () => void; // Called when cancel is clicked
}

const UserForm = ({ user, onUserSaved, onCancel }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!user;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: isEditMode
      ? {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email || "",
          phone_number: user.phone_number,
          role: user.role,
          address: user.address || "",
          password: "", // Always empty for security
        }
      : undefined,
  });

  // Update form when user prop changes (useful for edit mode)
  useEffect(() => {
    if (isEditMode && user) {
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("email", user.email || "");
      setValue("phone_number", user.phone_number);
      setValue("role", user.role);
      setValue("address", user.address || "");
      setValue("password", ""); // Always reset password field
    }
  }, [user, setValue, isEditMode]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      if (isEditMode) {
        // For edit mode, use original phone number as identifier
        const updateData = {
          ...data,
          originalPhoneNumber: user.phone_number, // Keep track of original phone for backend
        };
        await updateUserMutation.mutateAsync({
          phoneNumber: user.phone_number,
          userData: updateData,
        });
      } else {
        // Create mode
        await createUserMutation.mutateAsync(data);
      }

      reset();
      onUserSaved?.();
    } catch (error) {
      console.error(`${isEditMode ? "Update" : "Registration"} failed:`, error);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const roleLabels: Record<UserRole, string> = {
    YDM_Logistics: "YDM Logistics",
    YDM_Rider: "YDM Rider",
    YDM_Operator: "YDM Operator",
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="Enter first name"
            className={errors.first_name ? "border-destructive" : ""}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive">
              {errors.first_name.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            {...register("last_name")}
            placeholder="Enter last name"
            className={errors.last_name ? "border-destructive" : ""}
          />
          {errors.last_name && (
            <p className="text-sm text-destructive">
              {errors.last_name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number - Editable in both create and edit modes */}
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            {...register("phone_number")}
            placeholder="Enter phone number"
            className={errors.phone_number ? "border-destructive" : ""}
          />
          {errors.phone_number && (
            <p className="text-sm text-destructive">
              {errors.phone_number.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value) =>
              setValue("role", value as UserRole, { shouldDirty: true })
            }
            value={watch("role") || ""}
          >
            <SelectTrigger className={errors.role ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {userRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {roleLabels[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password
            {isEditMode && (
              <span className="text-xs text-muted-foreground ml-2">
                (Leave empty to keep current password)
              </span>
            )}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder={
                isEditMode ? "Enter new password (optional)" : "Enter password"
              }
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          {...register("address")}
          placeholder="Enter full address"
          className={errors.address ? "border-destructive" : ""}
          rows={3}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || (!isDirty && isEditMode)}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Registering..."}
            </>
          ) : (
            <>{isEditMode ? "Update User" : "Register User"}</>
          )}
        </Button>
      </div>

      {/* Show unsaved changes indicator */}
      {isEditMode && isDirty && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          You have unsaved changes
        </div>
      )}
    </form>
  );
};

export default UserForm;
