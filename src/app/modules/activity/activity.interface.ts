import { ObjectId } from "mongoose";

export interface IActivity {
  user: ObjectId;
  coupon: ObjectId;
  type: "COPY" | "VIEW";
  expireAt?: Date
}