"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createUserSchema,
  editUserSchema,
  CreateUserFormData,
  EditUserFormData,
  userRoles,
} from "@/schemas/user";
import { UserRole, User } from "@/types/user";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";

interface UserFormProps {
  user?: User;
  onUserSaved?: () => void;
  onCancel?: () => void;
}

interface ApiError {
  response?: {
    data?: Record<string, string | string[]> | string;
  };
  message?: string;
}

const UserForm = ({ user, onUserSaved, onCancel }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const isEditMode = !!user;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Create form for new users
  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: undefined,
      address: "",
      password: "",
    },
  });

  // Edit form for existing users
  const editForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      role: user?.role,
      address: user?.address || "",
    },
  });

  // Update form when user prop changes (useful for edit mode)
  useEffect(() => {
    if (isEditMode && user) {
      editForm.setValue("first_name", user.first_name);
      editForm.setValue("last_name", user.last_name);
      editForm.setValue("email", user.email || "");
      editForm.setValue("phone_number", user.phone_number);
      editForm.setValue("role", user.role);
      editForm.setValue("address", user.address || "");
    }
  }, [user, isEditMode, editForm]);

  // Clear API errors when form values change
  useEffect(() => {
    if (Object.keys(apiErrors).length > 0) {
      setApiErrors({});
    }
  }, [isEditMode ? editForm.watch() : createForm.watch(), apiErrors]);

  const parseApiErrors = (error: ApiError): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Check if error has response data (from enhanced API error handling)
    if (error?.response?.data) {
      const errorData = error.response.data;

      // Handle different error formats
      if (typeof errorData === "object" && errorData !== null) {
        Object.keys(errorData).forEach((key) => {
          const value = errorData[key];
          if (Array.isArray(value)) {
            // Handle array format: ["Error message"]
            errors[key] = value[0];
          } else if (typeof value === "string") {
            // Handle string format: "Error message"
            errors[key] = value;
          }
        });
      } else if (typeof errorData === "string") {
        errors.general = errorData;
      }
    } else if (error?.message) {
      // Fallback to error message
      errors.general = error.message;
    } else {
      // Default error message
      errors.general = `${
        isEditMode ? "Update" : "Registration"
      } failed. Please try again.`;
    }

    return errors;
  };

  const showErrorToasts = (errors: Record<string, string>) => {
    // Show field-specific errors as individual toasts
    Object.entries(errors).forEach(([field, message]) => {
      if (field !== "general") {
        // Format field names for better display
        const fieldLabel = field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        toast.error(`${fieldLabel}: ${message}`, {
          duration: 5000,
        });
      }
    });

    // Show general error if exists
    if (errors.general) {
      toast.error(errors.general, {
        duration: 5000,
      });
    }
  };

  const onSubmitCreate = async (data: CreateUserFormData) => {
    try {
      setApiErrors({});
      await createUserMutation.mutateAsync(data);
      createForm.reset();

      // Show success toast
      toast.success("User registered successfully!", {
        duration: 3000,
      });

      onUserSaved?.();
    } catch (error) {
      const parsedErrors = parseApiErrors(error as ApiError);
      setApiErrors(parsedErrors);

      // Show error toasts
      showErrorToasts(parsedErrors);

      // Set form errors for specific fields
      Object.keys(parsedErrors).forEach((key) => {
        if (key !== "general" && key in createForm.getValues()) {
          createForm.setError(key as keyof CreateUserFormData, {
            type: "manual",
            message: parsedErrors[key],
          });
        }
      });
    }
  };

  const onSubmitEdit = async (data: EditUserFormData) => {
    try {
      setApiErrors({});

      const updateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        role: data.role,
      };

      await updateUserMutation.mutateAsync({
        phoneNumber: user!.phone_number,
        userData: updateData,
      });

      editForm.reset();

      // Show success toast
      toast.success("User updated successfully!", {
        duration: 3000,
      });

      onUserSaved?.();
    } catch (error) {
      const parsedErrors = parseApiErrors(error as ApiError);
      setApiErrors(parsedErrors);

      // Show error toasts
      showErrorToasts(parsedErrors);

      // Set form errors for specific fields
      Object.keys(parsedErrors).forEach((key) => {
        if (key !== "general" && key in editForm.getValues()) {
          editForm.setError(key as keyof EditUserFormData, {
            type: "manual",
            message: parsedErrors[key],
          });
        }
      });
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      editForm.reset();
      editForm.clearErrors();
    } else {
      createForm.reset();
      createForm.clearErrors();
    }
    setApiErrors({});
    onCancel?.();
  };

  const roleLabels: Record<UserRole, string> = {
    YDM_Logistics: "YDM Logistics",
    YDM_Rider: "YDM Rider",
    YDM_Operator: "YDM Operator",
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  // Render create form
  if (!isEditMode) {
    const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
      setValue,
      watch,
    } = createForm;

    return (
      <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-6">
        {/* General API Error */}
        {apiErrors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiErrors.general}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              {...register("first_name")}
              placeholder="Enter first name"
              className={
                errors.first_name || apiErrors.first_name
                  ? "border-destructive"
                  : ""
              }
            />
            {(errors.first_name || apiErrors.first_name) && (
              <p className="text-sm text-destructive">
                {errors.first_name?.message || apiErrors.first_name}
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
              className={
                errors.last_name || apiErrors.last_name
                  ? "border-destructive"
                  : ""
              }
            />
            {(errors.last_name || apiErrors.last_name) && (
              <p className="text-sm text-destructive">
                {errors.last_name?.message || apiErrors.last_name}
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
              className={
                errors.email || apiErrors.email ? "border-destructive" : ""
              }
            />
            {(errors.email || apiErrors.email) && (
              <p className="text-sm text-destructive">
                {errors.email?.message || apiErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              {...register("phone_number")}
              placeholder="Enter phone number"
              className={
                errors.phone_number || apiErrors.phone_number
                  ? "border-destructive"
                  : ""
              }
            />

            {(errors.phone_number || apiErrors.phone_number) && (
              <p className="text-sm text-destructive">
                {errors.phone_number?.message || apiErrors.phone_number}
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
              <SelectTrigger
                className={
                  errors.role || apiErrors.role ? "border-destructive" : ""
                }
              >
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
            {(errors.role || apiErrors.role) && (
              <p className="text-sm text-destructive">
                {errors.role?.message || apiErrors.role}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                className={
                  errors.password || apiErrors.password
                    ? "border-destructive pr-10"
                    : "pr-10"
                }
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
            {(errors.password || apiErrors.password) && (
              <p className="text-sm text-destructive">
                {errors.password?.message || apiErrors.password}
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
            className={
              errors.address || apiErrors.address ? "border-destructive" : ""
            }
            rows={3}
          />
          {(errors.address || apiErrors.address) && (
            <p className="text-sm text-destructive">
              {errors.address?.message || apiErrors.address}
            </p>
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
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>Register User</>
            )}
          </Button>
        </div>
      </form>
    );
  }

  // Render edit form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = editForm;

  return (
    <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
      {/* General API Error */}
      {apiErrors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiErrors.general}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="Enter first name"
            className={
              errors.first_name || apiErrors.first_name
                ? "border-destructive"
                : ""
            }
          />
          {(errors.first_name || apiErrors.first_name) && (
            <p className="text-sm text-destructive">
              {errors.first_name?.message || apiErrors.first_name}
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
            className={
              errors.last_name || apiErrors.last_name
                ? "border-destructive"
                : ""
            }
          />
          {(errors.last_name || apiErrors.last_name) && (
            <p className="text-sm text-destructive">
              {errors.last_name?.message || apiErrors.last_name}
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
            className={
              errors.email || apiErrors.email ? "border-destructive" : ""
            }
          />
          {(errors.email || apiErrors.email) && (
            <p className="text-sm text-destructive">
              {errors.email?.message || apiErrors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            {...register("phone_number")}
            placeholder="Enter phone number"
            className={
              errors.phone_number || apiErrors.phone_number
                ? "border-destructive"
                : ""
            }
          />
          {(errors.phone_number || apiErrors.phone_number) && (
            <p className="text-sm text-destructive">
              {errors.phone_number?.message || apiErrors.phone_number}
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
            <SelectTrigger
              className={
                errors.role || apiErrors.role ? "border-destructive" : ""
              }
            >
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
          {(errors.role || apiErrors.role) && (
            <p className="text-sm text-destructive">
              {errors.role?.message || apiErrors.role}
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
          className={
            errors.address || apiErrors.address ? "border-destructive" : ""
          }
          rows={3}
        />
        {(errors.address || apiErrors.address) && (
          <p className="text-sm text-destructive">
            {errors.address?.message || apiErrors.address}
          </p>
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
          disabled={isLoading || !isDirty}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>Update User</>
          )}
        </Button>
      </div>
      {/* Show unsaved changes indicator */}
      {isDirty && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          You have unsaved changes
        </div>
      )}
    </form>
  );
};

export default UserForm;
