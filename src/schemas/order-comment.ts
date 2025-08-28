import { z } from "zod";

export const orderCommentUserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  role: z.string(),
  franchise: z.nullable(z.string()),
  address: z.string(),
});

export const orderCommentSchema = z.object({
  id: z.number(),
  order: z.number(),
  user: orderCommentUserSchema,
  comment: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createOrderCommentRequestSchema = z.object({
  order: z.number().min(1, "Order ID is required"),
  comment: z.string().min(1, "Comment cannot be empty"),
});

export type OrderComment = z.infer<typeof orderCommentSchema>;
export type CreateOrderCommentRequest = z.infer<
  typeof createOrderCommentRequestSchema
>;
