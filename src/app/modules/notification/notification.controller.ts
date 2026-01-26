import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { notificationServices } from "./notification.service";

const sendAlert = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await notificationServices.sendAlert(req.body);
  successResponse(res, {
    message: "Alert sent successfully!",
    status: 201,
    data: result,
  });
});

const createNotification = handleAsyncRequest(async (req: TRequest, res) => {
  const id = req.user!.id;
  const result = await notificationServices.createNotification(id);
  successResponse(res, {
    message: "Notifications created successfully!",
    data: result,
  });
});

const getAllNotifications = handleAsyncRequest(async (req: TRequest, res) => {
  const query = req.query;
  const id = req.user!.id;
  const result = await notificationServices.getAllNotifications(query, id);
  successResponse(res, {
    message: "Notifications retrieved successfully!",
    data: result,
  });
});

const getAllAlerts = handleAsyncRequest(async (req: TRequest, res) => {
  const query = req.query;
  const result = await notificationServices.getAllAlerts(query);
  successResponse(res, {
    message: "Notifications retrieved successfully!",
    data: result,
  });
});

const markAllAsRead = handleAsyncRequest(async (req: TRequest, res) => {
  const id = req.user!.id;
  const result = await notificationServices.markAllAsRead(id);
  successResponse(res, {
    message: "All notification marked as read successfully!",
    data: result,
  });
});

const getUnreadNotificationCount = handleAsyncRequest(
  async (req: TRequest, res) => {
    const id = req.user!.id;
    const result = await notificationServices.getUnreadNotificationCount(id);
    successResponse(res, {
      message: "Unread notification count retrieved successfully!",
      data: result,
    });
  },
);

const deleteSingleNotification = handleAsyncRequest(
  async (req: TRequest, res) => {
    const id = req.params.id;
    const result = await notificationServices.deleteSingleNotification(id);
    successResponse(res, {
      message: "Notification deleted successfully!",
      data: result,
    });
  },
);

const deleteSingleAlert = handleAsyncRequest(async (req: TRequest, res) => {
  const id = req.params.alertId;
  const result = await notificationServices.deleteSingleAlert(id);
  successResponse(res, {
    message: "Alert deleted successfully!",
    data: result,
  });
});

const deleteMyNotifications = handleAsyncRequest(async (req: TRequest, res) => {
  const id = req.user!.id;
  const result = await notificationServices.deleteMyNotifications(id);
  successResponse(res, {
    message: "Notifications deleted successfully!",
    data: result,
  });
});

export const notificationController = {
  sendAlert,
  getAllNotifications,
  markAllAsRead,
  createNotification,
  getUnreadNotificationCount,
  deleteSingleNotification,
  deleteMyNotifications,
  getAllAlerts,
  deleteSingleAlert,
};
