import mongoose, { Schema, Types } from "mongoose";
import { ICoupon } from "./coupon.interface";
import { CouponType } from "./coupon.constant";

const couponSchema = new Schema<ICoupon>(
  {
    store: { type: Types.ObjectId, ref: "Store", required: true },
    countries: [{ type: String, required: true }],
    link: { type: String, required: true },
    arabicLink: { type: String, required: false },
    fakeUses: { type: Number, default: 0 },
    realUses: { type: Number, default: 0 },
    code: { type: String },
    title: { type: String, required: true },
    arabicTitle: { type: String, required: false },
    subtitle: { type: String, required: true },
    arabicSubtitle: { type: String, required: false },
    validity: { type: String, required: true },
    type: { type: String, enum: ["free", "premium"], default: "free" },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    applicableUserType: {
      type: String,
      enum: Object.values(CouponType),
      required: true,
    },
    discountPercentage: { type: String, required: true },
    howToUse: { type: [String], required: true },
    arabicHowToUse: { type: [String], required: false },
    terms: { type: [String], required: true },
    arabicTerms: { type: [String], required: false },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
export default Coupon;
