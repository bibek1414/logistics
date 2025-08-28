import { z } from "zod";

export const userRoles = [
  "YDM_Logistics",
  "YDM_Rider",
  "YDM_Operator",
] as const;

// Schema for creating new users (includes password)
export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),
  role: z.enum(userRoles).refine((val) => !!val, {
    message: "Please select a role",
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

// Schema for editing existing users (no password, phone_number is editable)
export const editUserSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .or(z.literal("")),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z
    .string()
    .max(200, "Address must not exceed 200 characters")
    .or(z.literal("")),
  role: z.enum(userRoles).refine((val) => !!val, {
    message: "Please select a role",
  }),
});

// Legacy schemas for backward compatibility
export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  });

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
