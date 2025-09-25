import { ObjectId, PipelineStage } from "mongoose";
import Notification from "./notification.model";
import generateOTP from "../../utils/generateOTP";
import QueryBuilder from "../../classes/queryBuilder";
import Coupon from "../coupon/coupon.model";
import { TNotificationPayload } from "./notification.interface";
import Auth from "../auth/auth.model";
import { userRoles } from "../../constants/global.constant";
import { AppError } from "../../classes/appError";
import Alert from "../alert/alert.model";

const sendAlert = async (payload: Partial<TNotificationPayload>) => {
  const coupon = await Coupon.findById(payload.coupon);
  if (!coupon) throw new AppError(400, "Invalid coupon id");
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

  const session = await Auth.startSession();
  try {
    session.startTransaction();

    await Alert.create([payload], { session });

    for (const user of users) {
      const notificationData = {
        receiver: user._id,
        type: "alert",
        ...payload
      }
      await Notification.create([notificationData], { session });
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
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

  const total = await userQuery.countTotal();
  const result = await userQuery.queryModel


  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
}

const getAllAlerts = async (query: Record<string, any>) => {
  const searchableFields = ["title"];
  const userQuery = new QueryBuilder(
    Alert.find(),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await userQuery.countTotal();
  const result = await userQuery.queryModel.populate([
    { path: "coupon", populate: { path: "store", select: "name image", populate: { path: "categories", select: "name" } } },
  ]);

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

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

export const notificationServices = { getAllNotifications, markAllAsRead, createNotification, getUnreadNotificationCount, deleteSingleNotification, deleteMyNotifications, sendAlert, getAllAlerts };