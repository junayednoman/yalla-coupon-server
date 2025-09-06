import { Router } from "express";
import activityController from "./activity.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { activityZodSchema } from "./activity.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.user]),
  handleZodValidation(activityZodSchema),
  activityController.addActivity
);

router.get(
  "/",
  authVerify([userRoles.admin, userRoles.editor, userRoles.user, userRoles.viewer]),
  activityController.getAllActivities
);

export const activityRoutes = router;