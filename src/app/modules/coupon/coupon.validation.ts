import { z } from "zod";

export const couponZodSchema = z.object({
  store: z.string().min(1, "Store ID is required"),
  countries: z
    .array(z.string().min(1, "Country is required"))
    .min(1, "At least one country is required"),
  link: z.string().optional(),
  arabicLink: z.string().optional(),
  fakeUses: z.number().min(0, "Fake uses must be a non-negative number"),
  code: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  arabicTitle: z.string().optional(),
  subtitle: z.string().min(1, "Subtitle is required"),
  arabicSubtitle: z.string().optional(),
  validity: z.string().min(1, "Validity is required"),
  type: z.enum(["free", "premium"]),
  applicableUserType: z.enum(["FIRST_TIME", "REPEAT", "BOTH"]),
  discountPercentage: z.string().min(1, "Discount percentage is required"),
  isFeatured: z.boolean().optional(),
  howToUse: z
    .array(z.string().min(1, "How to use step is required"))
    .min(1, "At least one how-to-use step is required"),
  arabicHowToUse: z
    .array(z.string().min(1, "How to use step is required"))
    .min(1, "At least one how-to-use step is required"),
  terms: z
    .array(z.string().min(1, "Term is required"))
    .min(1, "At least one term is required"),
  arabicTerms: z
    .array(z.string().min(1, "Term is required"))
    .min(1, "At least one term is required"),
});

export type TCouponZod = z.infer<typeof couponZodSchema>;
