import { z } from "zod";

export const storeZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
});