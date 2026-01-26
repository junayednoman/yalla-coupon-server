import mongoose, { Schema, Types } from "mongoose";
import { IPopup } from "./popup.interface";

const PopupSchema = new Schema<IPopup>(
  {
    title: { type: String, required: false },
    arabicTitle: { type: String, required: false },
    image: { type: String, required: true },
    arabicImage: { type: String, required: false },
    coupon: { type: Types.ObjectId, ref: "Coupon", required: false },
  },
  {
    timestamps: true,
  },
);

const Popup = mongoose.model<IPopup>("Popup", PopupSchema);
export default Popup;
