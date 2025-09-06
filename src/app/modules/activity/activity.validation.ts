import { z } from "zod";
import { Types } from "mongoose";

export const activityZodSchema = z.object({
  coupon: z.string().min(1, "Coupon ID is required").transform((id) => new Types.ObjectId(id)),
  type: z.enum(["COPY", "VIEW"]),
});

export type TActivityZod = z.infer<typeof activityZodSchema>;