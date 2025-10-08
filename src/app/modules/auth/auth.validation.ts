import { z } from "zod";

export const loginUserValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
  fcmToken: z.string().optional(),
});

export const googleLoginUserValidationSchema = z.object({
  fcmToken: z.string().optional(),
  idToken: z.string().min(1, "ID token is required"),
});

export const emailValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
  otp: z.string().nonempty("OTP is required"),
  verifyAccount: z.boolean().optional(),
});

export const resetForgottenPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
  password: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const changePasswordValidationSchema = z.object({
  oldPassword: z.string().nonempty("Old Password is required"),
  newPassword: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const moderatorZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  role: z.enum(["Editor", "Viewer"]),
});

export type TModeratorSignUp = z.infer<typeof moderatorZodSchema>;

export const changeModeratorRoleValidationSchema = z.object({
  role: z.enum(["Editor", "Viewer"]),
});
