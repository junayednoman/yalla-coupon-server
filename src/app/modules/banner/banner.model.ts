import mongoose, { Schema, Types } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    image: { type: String, required: true },
    arabicImage: { type: String, required: false },
    title: { type: String, required: true },
    arabicTitle: { type: String, required: false },
    subTitle: { type: String, required: true },
    arabicSubTitle: { type: String, required: false },
    coupon: { type: Types.ObjectId, ref: "Coupon", required: true },
  },
  {
    timestamps: true,
  },
);

const Banner = mongoose.model<IBanner>("Banner", bannerSchema);
export default Banner;
