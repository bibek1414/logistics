import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  // .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
