import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { feedbackZodSchema } from "./feedback.validation";
import { feedbackController } from "./feedback.controller";

const router = Router();

router.post("/", authVerify([userRoles.user]), handleZodValidation(feedbackZodSchema), feedbackController.sendFeedback);

export const feedbackRoutes = router;