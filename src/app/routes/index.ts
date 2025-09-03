import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import adminRoutes from "../modules/admin/admin.routes";
import { legalRoutes } from "../modules/legal/legal.routes";
import notificationRoutes from "../modules/notification/notification.routes";
import { uploadFileRoutes } from "../modules/uploadFile/uploadFile.routes";
import categoryRoutes from "../modules/category/category.routes";
import { userRoutes } from "../modules/user/user.routes";
import { editorRoutes } from "../modules/editor/editor.routes";
import { viewerRoutes } from "../modules/viewer/viewer.routes";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/admins", route: adminRoutes },
  { path: "/users", route: userRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/editors", route: editorRoutes },
  { path: "/viewers", route: viewerRoutes },




  { path: "/legal", route: legalRoutes },
  { path: "/notifications", route: notificationRoutes },
  { path: "/upload-files", route: uploadFileRoutes },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;