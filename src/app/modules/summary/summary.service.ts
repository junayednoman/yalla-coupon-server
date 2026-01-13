import { endOfYear, startOfYear, startOfWeek, addDays } from "date-fns";
import Coupon from "../coupon/coupon.model";
import User from "../user/user.model";

const getWeekDays = (startOfWeekDate: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startOfWeekDate, i));
  }
  return days;
};

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getDayName = (date: Date): string => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[date.getDay()];
};

interface DashboardSummaryParams {
  year?: number;
  weekStartDate?: Date;
}

interface UserSummary {
  date: string;
  users: number;
}

interface DashboardSummaryResponse {
  totalUsers: number;
  totalCoupons: number;
  userSummary: UserSummary[];
  newCoupons: any[];
}

const getDashboardSummary = async ({
  year,
  weekStartDate,
}: DashboardSummaryParams): Promise<DashboardSummaryResponse> => {
  const totalUsers = await User.countDocuments();
  const totalCoupons = await Coupon.countDocuments();

  const selectedYear = year || new Date().getFullYear();

  let users: { date: number; users: number }[] = [];
  let userSummary: UserSummary[] = [];

  if (weekStartDate) {
    const startOfWeekDate = startOfWeek(new Date(weekStartDate));
    const weekDays = getWeekDays(startOfWeekDate);

    users = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: weekDays[0],
            $lte: weekDays[6],
          },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$createdAt" },
          users: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          users: 1,
          _id: 0,
        },
      },
    ]);

    userSummary = weekDays.map((date) => {
      const dayOfYear = getDayOfYear(date);
      const found = users.find((stat) => stat.date === dayOfYear);
      return {
        date: getDayName(date),
        users: found ? found.users : 0,
      };
    });
  } else {
    const start = startOfYear(new Date(selectedYear, 0));
    const end = endOfYear(new Date(selectedYear, 0));

    users = await User.aggregate([
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    userSummary = monthNames.map((name, index) => {
      const found = users.find((stat: any) => stat.month === index + 1);
      return {
        date: name,
        users: found ? found.users : 0,
      };
    });
  }

  const newCoupons = await Coupon.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("store", "name image")
    .select("store title")
    .lean();

  return { totalUsers, totalCoupons, userSummary, newCoupons };
};

export const summaryService = {
  getDashboardSummary,
};
