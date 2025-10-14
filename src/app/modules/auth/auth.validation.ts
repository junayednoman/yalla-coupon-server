import { z } from "zod";
import { emailZod, passwordZod } from "../../validation/global.validation";

export const loginUserValidationSchema = z.object({
  email: emailZod,
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
  fcmToken: z.string().optional(),
  isMobile: z.boolean().optional().default(false),
});

export type ILoginUser = z.infer<typeof loginUserValidationSchema>;

export const socialLoginZod = z.object({
  email: emailZod,
  name: z.string().nonempty("Name is required"),
  image: z.string().optional(),
  fcmToken: z.string().optional(),
  country: z.string().nonempty("Country is required"),
  provider: z.enum(["google", "facebook", "apple"]),
  isMobile: z.boolean().optional().default(false),
});

export type ISocialLogin = z.infer<typeof socialLoginZod>;

export const emailValidationSchema = z.object({
  email: emailZod,
});

export const verifyOtpSchema = z.object({
  email: emailZod,
  otp: z.string().nonempty("OTP is required"),
  verifyAccount: z.boolean().optional(),
});

export const resetForgottenPasswordSchema = z.object({
  email: emailZod,
  password: passwordZod,
});

export const changePasswordValidationSchema = z.object({
  oldPassword: z.string().nonempty("Old Password is required"),
  newPassword: passwordZod,
});

export const moderatorZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailZod,
  role: z.enum(["Editor", "Viewer"]),
});

export type TModeratorSignUp = z.infer<typeof moderatorZodSchema>;

export const changeModeratorRoleValidationSchema = z.object({
  role: z.enum(["Editor", "Viewer"]),
});
