import mongoose, { Schema, Types } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    coupon: { type: Types.ObjectId, ref: "Coupon", required: true },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model<IBanner>("Banner", bannerSchema);
export default Banner;