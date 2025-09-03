import { Router } from "express";
import userController from "./user.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { userZodSchema } from "./user.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/multerS3Uploader";

const router = Router();

router.post(
  "/signup",
  handleZodValidation(userZodSchema),
  userController.signup
);

router.put(
  "/",
  authVerify([userRoles.user]),
  upload.single("image"),
  handleZodValidation(userZodSchema.partial(), { formData: true }),
  userController.updateProfile
);

router.get(
  "/profile",
  authVerify([userRoles.user]),
  userController.getProfile
);

router.get(
  "/",
  authVerify([userRoles.admin]),
  userController.getAllUsers
);

router.get(
  "/:id",
  authVerify([userRoles.admin, userRoles.user]),
  userController.getSingleUser
);

router.patch(
  "/:id",
  authVerify([userRoles.admin]),
  userController.changeUserStatus
);

export const userRoutes = router;