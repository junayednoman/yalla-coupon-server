import { Router } from "express";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/awss3";
import { PopupZodSchema } from "./popup.validation";
import popupController from "./popup.controller";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.admin, userRoles.editor]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "arabicImage", maxCount: 1 },
  ]),
  handleZodValidation(PopupZodSchema, { formData: true }),
  popupController.addPopup,
);

router.get("/", popupController.getAllPopups);

router.get("/:id", popupController.getPopup);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  popupController.deletePopup,
);

export const popupRoutes = router;
