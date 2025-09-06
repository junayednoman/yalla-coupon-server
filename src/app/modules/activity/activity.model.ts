import mongoose, { Schema, Types } from "mongoose";
import { IActivity } from "./activity.interface";
import { ActivityType } from "./activity.constant";

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Types.ObjectId, ref: "Auth", required: true },
    coupon: { type: Types.ObjectId, ref: "Coupon", required: true },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "5d" }
    }
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model<IActivity>("Activity", activitySchema);
export default Activity;