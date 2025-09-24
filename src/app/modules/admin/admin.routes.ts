import { Router } from "express";
import adminControllers from "./admin.controller";
import authVerify from "../../middlewares/authVerify";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import updateAdminProfileValidationSchema from "./admin.validation";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/awss3";
const adminRoutes = Router();

adminRoutes.get("/", authVerify([userRoles.admin]), adminControllers.getAdminProfile);
adminRoutes.put(
  "/",
  authVerify([userRoles.admin]),
  handleZodValidation(updateAdminProfileValidationSchema),
  adminControllers.updateAdminProfile
);
adminRoutes.patch(
  "/image",
  authVerify([userRoles.admin]),
  upload.single("image"),
  adminControllers.updateAdminProfileImage
);
export default adminRoutes;
