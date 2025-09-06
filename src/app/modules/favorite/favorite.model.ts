import mongoose, { Schema, Types } from "mongoose";
import { IFavorite } from "./favorite.interface";

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Types.ObjectId, ref: "Auth", required: true },
    coupon: { type: Types.ObjectId, ref: "Coupon", required: true },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ user: 1, coupon: 1 }, { unique: true });

const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;