import { Router } from "express";
import viewerController from "./viewer.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { updateViewerZod } from "./viewer.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.put(
  "/",
  authVerify([userRoles.viewer]),
  upload.single("image"),
  handleZodValidation(updateViewerZod, {
    formData: true
  }),
  viewerController.updateProfile
);

router.get(
  "/profile",
  authVerify([userRoles.viewer]),
  viewerController.getProfile
);

router.get(
  "/",
  authVerify([userRoles.admin]),
  viewerController.getAllViewers
);

router.get(
  "/:id",
  authVerify([userRoles.admin, userRoles.viewer]),
  viewerController.getSingleViewer
);

router.patch(
  "/:id",
  authVerify([userRoles.admin]),
  viewerController.changeViewerStatus
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  viewerController.deleteViewer
);

export const viewerRoutes = router;