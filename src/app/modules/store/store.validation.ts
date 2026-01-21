import { z } from "zod";

export const storeZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  arabicName: z.string().min(1, "Arabic name is required"),
  categories: z
    .array(z.string().min(1, "Category ID is required"))
    .min(1, "At least one category is required"),
});
