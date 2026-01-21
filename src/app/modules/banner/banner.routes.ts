import { Router } from "express";
import bannerController from "./banner.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { bannerZodSchema } from "./banner.validation";
import authVerify, { optionalAuthVerify } from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.admin, userRoles.editor]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "arabicImage", maxCount: 1 },
  ]),
  handleZodValidation(bannerZodSchema, {
    formData: true,
  }),
  bannerController.createBanner,
);

router.get(
  "/",
  optionalAuthVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  bannerController.getAllBanners,
);

router.get(
  "/:id",
  optionalAuthVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  bannerController.getSingleBanner,
);

router.put(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "arabicImage", maxCount: 1 },
  ]),
  handleZodValidation(bannerZodSchema.partial(), { formData: true }),
  bannerController.updateBanner,
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  bannerController.deleteBanner,
);

export const bannerRoutes = router;
