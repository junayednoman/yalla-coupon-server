import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { notificationController } from "./notification.controller";
import { userRoles } from "../../constants/global.constant";

const notificationRoutes = Router();

notificationRoutes.post(
  "/send-alert",
  authVerify([userRoles.admin, userRoles.editor]),
  notificationController.sendAlert,
);

notificationRoutes.post(
  "/",
  authVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  notificationController.createNotification,
);

notificationRoutes.get(
  "/",
  authVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  notificationController.getAllNotifications,
);

notificationRoutes.get(
  "/alerts",
  authVerify([userRoles.admin]),
  notificationController.getAllAlerts,
);

notificationRoutes.patch(
  "/mark-all-as-read",
  authVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  notificationController.markAllAsRead,
);

notificationRoutes.get(
  "/unread-count",
  authVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  notificationController.getUnreadNotificationCount,
);

notificationRoutes.delete(
  "/:id",
  authVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  notificationController.deleteSingleNotification,
);

notificationRoutes.delete(
  "/",
  authVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  notificationController.deleteMyNotifications,
);

notificationRoutes.delete(
  "/alerts/:alertId",
  authVerify([userRoles.admin]),
  notificationController.deleteSingleAlert,
);

export default notificationRoutes;
