import mongoose, { Schema, Types } from "mongoose";
import { ICoupon } from "./coupon.interface";
import { CouponType } from "./coupon.constant";

const couponSchema = new Schema<ICoupon>(
  {
    store: { type: Types.ObjectId, ref: "Store", required: true },
    categories: [{ type: Types.ObjectId, ref: "Category", required: true }],
    countries: [{ type: String, required: true }],
    link: { type: String, required: true },
    fakeUses: { type: Number, min: 0 },
    realUses: { type: Number, min: 0 },
    code: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    validity: { type: String, required: true },
    applicableUserType: {
      type: String,
      enum: Object.values(CouponType),
      required: true,
    },
    howToUse: { type: [String], required: true },
    terms: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
export default Coupon;