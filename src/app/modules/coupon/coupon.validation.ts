import { z } from "zod";

export const couponZodSchema = z.object({
  store: z.string().min(1, "Store ID is required"),
  categories: z.array(z.string().min(1, "Category ID is required")).min(1, "At least one category is required"),
  countries: z.array(z.string().min(1, "Country is required")).min(1, "At least one country is required"),
  link: z.string().url("Link must be a valid URL").min(1, "Link is required"),
  fakeUses: z.number().min(0, "Fake uses must be a non-negative number"),
  code: z.string().min(1, "Code is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  validity: z.string().min(1, "Validity is required"),
  type: z.enum(["free", "premium"]),
  applicableUserType: z.enum(["FIRST_TIME", "REPEAT", "BOTH"]),
  howToUse: z.array(z.string().min(1, "How to use step is required")).min(1, "At least one how-to-use step is required"),
  terms: z.array(z.string().min(1, "Term is required")).min(1, "At least one term is required"),
});

export type TCouponZod = z.infer<typeof couponZodSchema>;