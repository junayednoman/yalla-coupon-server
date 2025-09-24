import { Router } from "express";
import editorController from "./editor.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { updateEditorZod } from "./editor.validation";
import { upload } from "../../utils/awss3";

const router = Router();

router.put(
  "/",
  authVerify([userRoles.editor]),
  upload.single("image"),
  handleZodValidation(updateEditorZod, {
    formData: true
  }),
  editorController.updateProfile
);

router.get(
  "/profile",
  authVerify([userRoles.editor]),
  editorController.getProfile
);

router.get(
  "/",
  authVerify([userRoles.admin]),
  editorController.getAllEditors
);

router.get(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  editorController.getSingleEditor
);

router.patch(
  "/:id",
  authVerify([userRoles.admin]),
  editorController.changeEditorStatus
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  editorController.deleteEditor
);

export const editorRoutes = router;