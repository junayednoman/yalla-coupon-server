import { z } from "zod";

// Define Zod schema for User
export const userZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

// Export for type inference
export type TUserZod = z.infer<typeof userZodSchema>;