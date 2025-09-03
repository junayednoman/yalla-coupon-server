import { z } from "zod";

export const updateViewerZod = z.object({
  name: z.string({ invalid_type_error: "Name must be a string!" }).optional(),
  phone: z
    .string({ invalid_type_error: "Phone number must be a string!" })
    .optional(),
})