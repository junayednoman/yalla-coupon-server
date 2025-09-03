import { Router } from "express";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import {
  changePasswordValidationSchema,
  emailValidationSchema,
  loginUserValidationSchema,
  moderatorZodSchema,
  resetForgottenPasswordSchema,
  verifyOtpSchema,
} from "./auth.validation";
import AuthController from "./auth.controller";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";

const authRoutes = Router();

authRoutes.post(
  "/moderators/signup",
  handleZodValidation(moderatorZodSchema),
  AuthController.createModerator
);

authRoutes.post(
  "/login",
  handleZodValidation(loginUserValidationSchema),
  AuthController.loginUser
);

authRoutes.post(
  "/logout",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer, userRoles.user]),
  AuthController.logOut
);
authRoutes.post(
  "/send-otp",
  handleZodValidation(emailValidationSchema),
  AuthController.sendOtp
);
authRoutes.post(
  "/verify-otp",
  handleZodValidation(verifyOtpSchema),
  AuthController.verifyOtp
);
authRoutes.post(
  "/reset-forgotten-password",
  handleZodValidation(resetForgottenPasswordSchema),
  AuthController.resetForgottenPassword
);
authRoutes.post(
  "/change-password",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer, userRoles.user]),
  handleZodValidation(changePasswordValidationSchema),
  AuthController.changePassword
);
authRoutes.get(
  "/refresh-token",
  AuthController.getNewAccessToken
);
authRoutes.delete("/", authVerify([userRoles.editor, userRoles.viewer, userRoles.user]), AuthController.deleteUser)

export default authRoutes;
