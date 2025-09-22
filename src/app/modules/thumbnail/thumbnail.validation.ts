import mongoose from "mongoose";
import { z } from "zod";

export const thumbnailZodSchema = z.object({
  coupon: z.string().min(1, "Coupon ID is required").transform((id) => new mongoose.Types.ObjectId(id)),
});