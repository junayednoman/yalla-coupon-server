import mongoose, { Schema, Types } from "mongoose";
import { IThumbnail } from "./thumbnail.interface";

const thumbnailSchema = new Schema<IThumbnail>(
  {
    image: { type: String, required: true },
    arabicImage: { type: String, required: false },
    coupon: { type: Types.ObjectId, ref: "Coupon", required: true },
  },
  {
    timestamps: true,
  }
);

const Thumbnail = mongoose.model<IThumbnail>("Thumbnail", thumbnailSchema);
export default Thumbnail;