import { z } from "zod";
import { Types } from "mongoose";

export const bannerZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  arabicTitle: z.string().optional(),
  subTitle: z.string().min(1, "Sub-title is required"),
  arabicSubTitle: z.string().optional(),
  coupon: z
    .string()
    .min(1, "Coupon ID is required")
    .transform((id) => new Types.ObjectId(id)),
});
