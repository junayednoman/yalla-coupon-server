import { ObjectId, PipelineStage } from "mongoose";
import Notification from "./notification.model";
import generateOTP from "../../utils/generateOTP";
import QueryBuilder from "../../classes/queryBuilder";
import Coupon from "../coupon/coupon.model";
import { TNotificationPayload } from "./notification.interface";
import Auth from "../auth/auth.model";
import { userRoles } from "../../constants/global.constant";

const sendAlert = async (payload: Partial<TNotificationPayload>) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        role: userRoles.user
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    }
  ];

  if (payload.countries!.length > 0 && !payload.countries!.includes("all")) {
    pipeline.push({
      $match: {
        "user.country": {
          $in: payload.countries
        }
      }
    })
  }

  const users = await Auth.aggregate(pipeline);

  for (const user of users) {
    const notificationData = {
      receiver: user._id, ...payload
    }
    await Notification.create(notificationData);
  }
}

const createNotification = async (id: string) => {
  const otp = generateOTP()
  const coupon = await Coupon.find()
  const notificationData = {
    receiver: id as unknown as ObjectId,
    title: `New Notification-${otp}`,
    body: 'You have a new notification',
    coupon: coupon[0]._id,
    countries: ["all"]
  }
  const result = await Notification.create(notificationData);
  return result;
}

const getAllNotifications = async (query: Record<string, any>, id: string) => {
  const searchableFields = ["title",];
  const userQuery = new QueryBuilder(
    Notification.find({ receiver: id }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel;

  return { data: result, meta };
}

const markAllAsRead = async (id: string) => {
  const result = await Notification.updateMany({ hasRead: false, receiver: id }, { hasRead: true });
  return result;
}

const getUnreadNotificationCount = async (id: string) => {
  const result = await Notification.countDocuments({ hasRead: false, receiver: id });
  return result;
}

const deleteSingleNotification = async (id: string) => {
  const result = await Notification.findByIdAndDelete(id);
  return result;
}

const deleteMyNotifications = async (id: string) => {
  const result = await Notification.deleteMany({ receiver: id });
  return result;
}

export const notificationServices = { getAllNotifications, markAllAsRead, createNotification, getUnreadNotificationCount, deleteSingleNotification, deleteMyNotifications, sendAlert };