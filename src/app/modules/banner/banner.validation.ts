import { z } from "zod";
import { Types } from "mongoose";

export const bannerZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Sub-title is required"),
  coupon: z.string().min(1, "Coupon ID is required").transform((id) => new Types.ObjectId(id)),
});