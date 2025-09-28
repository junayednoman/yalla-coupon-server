import { z } from 'zod';

export const loginUserValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
  password: z
    .string()
    .nonempty("Password is required"),
  fcmToken: z.string().optional(),
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
  password: z.string().nonempty("Password is required"),
});

export const changePasswordValidationSchema = z.object({
  oldPassword: z.string().nonempty("Old Password is required"),
  newPassword: z.string().nonempty("New Password is required"),
});

export const moderatorZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  role: z.enum(["Editor", "Viewer"]),
});

export type TModeratorSignUp = z.infer<typeof moderatorZodSchema>;