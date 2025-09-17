import cron from "node-cron";
import Coupon from "../modules/coupon/coupon.model";

export const startCouponStatusJob = () => {
  // runs every 1 hour
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    await Coupon.updateMany(
      { validity: { $lt: now }, status: "active" },
      { $set: { status: "expired" } }
    );
  });
};
