import { Router } from "express";
import thumbnailController from "./thumbnail.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { thumbnailZodSchema } from "./thumbnail.validation";
import authVerify from "../../middlewares/authVerify";
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
  handleZodValidation(thumbnailZodSchema, { formData: true }),
  thumbnailController.addThumbnail,
);

router.get("/", thumbnailController.getAllThumbnails);

router.get("/:id", thumbnailController.getThumbnail);

router.put(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "arabicImage", maxCount: 1 },
  ]),
  handleZodValidation(thumbnailZodSchema.partial(), { formData: true }),
  thumbnailController.updateThumbnail,
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  thumbnailController.deleteThumbnail,
);

export const thumbnailRoutes = router;
