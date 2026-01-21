import { ObjectId } from "mongoose";

export type TNotificationPayload = {
  receiver: ObjectId;
  title: string;
  arabicTitle: string;
  body: string;
  arabicBody: string;
  coupon: ObjectId;
  hasRead?: boolean;
  countries: string[];
  type: "alert" | "others";
};
