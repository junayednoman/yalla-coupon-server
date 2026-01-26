import mongoose from "mongoose";
import { z } from "zod";

export const PopupZodSchema = z.object({
  title: z.string().optional(),
  arabicTitle: z.string().optional(),
  coupon: z
    .string()
    .optional()
    .transform((id) => new mongoose.Types.ObjectId(id)),
});
