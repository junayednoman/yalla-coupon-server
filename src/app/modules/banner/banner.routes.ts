import { Router } from "express";
import bannerController from "./banner.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { bannerZodSchema } from "./banner.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/multerS3Uploader";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.admin, userRoles.editor]),
  upload.single("image"),
  handleZodValidation(bannerZodSchema, {
    formData: true
  }),
  bannerController.createBanner
);

router.get(
  "/",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer, userRoles.user]),
  bannerController.getAllBanners
);

router.get(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer, userRoles.user]),
  bannerController.getSingleBanner
);

router.put(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  upload.single("image"),
  handleZodValidation(bannerZodSchema.partial(), { formData: true }),
  bannerController.updateBanner
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  bannerController.deleteBanner
);

export const bannerRoutes = router;