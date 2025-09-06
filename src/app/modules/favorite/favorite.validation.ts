import { z } from "zod";
import { Types } from "mongoose";

export const favoriteZodSchema = z.object({
  coupon: z.string().min(1, "User ID is required").transform((id) => new Types.ObjectId(id))
});