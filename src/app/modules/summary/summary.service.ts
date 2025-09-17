import { endOfYear, startOfYear } from "date-fns";
import Coupon from "../coupon/coupon.model";
import User from "../user/user.model";

const getDashboardSummary = async (year?: number) => {
  const totalUsers = await User.countDocuments();
  const totalCoupons = await Coupon.countDocuments();

  const selectedYear = year || new Date().getFullYear();

  const start = startOfYear(new Date(selectedYear, 0));
  const end = endOfYear(new Date(selectedYear, 0));

  const users = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        users: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id",
        users: 1,
        _id: 0,
      },
    },
  ]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const userSummary = monthNames.map((name, index) => {
    const found = users.find(stat => stat.month === index + 1);
    return {
      month: name,
      users: found ? found.users : 0,
    };
  });

  const newCoupons = await Coupon.find().sort({ createdAt: -1 }).limit(3).populate("store", "name image").select("store title").lean();

  return { totalUsers, totalCoupons, userSummary, newCoupons };
}

export const summaryService = {
  getDashboardSummary
}