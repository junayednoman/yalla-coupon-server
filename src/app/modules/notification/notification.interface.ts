import { ObjectId } from "mongoose";

export type TNotificationPayload = {
  receiver: ObjectId;
  title: string;
  body: string;
  coupon: ObjectId;
  hasRead?: boolean;
  countries: string[];
  type: "alert" | 'others';
};
