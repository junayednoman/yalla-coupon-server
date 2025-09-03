import { Router } from "express";
import editorController from "./editor.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { moderatorZodSchema } from "./editor.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant"; // Adjust to editorRoles if defined

const router = Router();

router.post(
  "/editors/signup",
  handleZodValidation(moderatorZodSchema.extend({ password: z.string().min(6, "Password must be at least 6 characters") })),
  editorController.createModerator
);

router.put(
  "/editors/profile",
  authVerify([userRoles.editor]), // Assuming editor role
  handleZodValidation(moderatorZodSchema.partial(), true),
  editorController.updateProfile
);

router.get(
  "/editors/profile",
  authVerify([userRoles.editor]),
  editorController.getProfile
);

router.get(
  "/editors",
  authVerify([userRoles.admin]), // Admin-only access
  editorController.getAllEditors
);

router.get(
  "/editors/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  editorController.getSingleEditor
);

router.put(
  "/editors/:id/status",
  authVerify([userRoles.admin]),
  editorController.changeEditorStatus
);

export const editorRoutes = router;