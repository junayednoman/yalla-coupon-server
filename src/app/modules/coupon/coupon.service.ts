import Coupon from "./coupon.model";
import { AppError } from "../../classes/appError";
import { ICoupon } from "./coupon.interface";
import Store from "../store/store.model";
import AggregationBuilder from "../../classes/AggregationBuilder";
import QueryBuilder from "../../classes/queryBuilder";
import mongoose from "mongoose";
import Auth from "../auth/auth.model";
import { userRoles } from "../../constants/global.constant";

const createCoupon = async (payload: ICoupon) => {
  const store = await Store.findById(payload.store);
  if (!store) throw new AppError(400, "Invalid store id");
  const result = await Coupon.create(payload);
  return result;
};

const getAllCoupons = async (query: Record<string, any>, userId: string, userRole: "Admin" | "Editor" | "Viewer" | "User") => {
  const searchableFields = ["store.name", "title", "howToUse", "terms"];

  const pipeline = [];

  if (userRole === userRoles.user) {
    const auth = await Auth.findById(userId).populate("user", "country");

    pipeline.push(
      {
        $match: {
          countries: { $in: [(auth?.user as any)?.country] }
        }
      },
      {
        $match: {
          status: "active"
        }
      },
      {
        $lookup: {
          from: "favorites",
          let: { couponId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$coupon", "$$couponId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] }
                  ],
                },
              },
            },
          ],
          as: "favoriteDocs",
        },
      },
      {
        $addFields: {
          isFavorite: {
            $cond: {
              if: { $gt: [{ $size: "$favoriteDocs" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
    )
  }

  pipeline.push(
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store",
      }
    },
    {
      $match: {
        status: "active"
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      }
    },
  )

  const couponQuery = new AggregationBuilder(Coupon, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
  // .selectFields();

  const total = await couponQuery.countTotal();
  const result = await couponQuery.execute();

  const meta = {
    total,
    limit: query.limit || 10,
    page: query.page || 1
  }

  if (userRole !== "User") {
    const total = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: { $sum: "$realUses" }
        }
      }
    ])

    return { data: result, meta, totalCopies: total[0]?.totalCopies || 10 };
  }

  return { data: result, meta };
};

const getTrendingCoupons = async (query: Record<string, any>, userId: string) => {
  const searchableFields = ["store.name", "title", "howToUse", "terms"];
  query.sort = "-fakeUses"
  query.limit = 2
  const auth = await Auth.findById(userId).populate("user", "country");
  const pipeline = [];

  pipeline.push(
    {
      $match: {
        countries: { $in: [(auth?.user as any)?.country] }
      }
    },
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store",
      }
    },
    {
      $match: {
        status: "active"
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      }
    },
    {
      $match: {
        status: "active"
      }
    },
    {
      $lookup: {
        from: "favorites",
        let: { couponId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$coupon", "$$couponId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(userId)] }
                ],
              },
            },
          },
        ],
        as: "favoriteDocs",
      },
    },
    {
      $addFields: {
        isFavorite: {
          $cond: {
            if: { $gt: [{ $size: "$favoriteDocs" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    }
  )

  const couponQuery = new AggregationBuilder(Coupon, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()

  const result = await couponQuery.execute();

  return { data: result };
};

const getFeaturedCoupons = async (query: Record<string, any>, userId: string) => {
  const searchableFields = ["store.name", "title", "howToUse", "terms"];
  query.isFeatured = true
  query.limit = 2
  const auth = await Auth.findById(userId).populate("user", "country");
  const pipeline = [];

  pipeline.push(
    {
      $match: {
        countries: { $in: [(auth?.user as any)?.country] }
      }
    },
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store",
      }
    },
    {
      $match: {
        status: "active"
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      }
    },
    {
      $match: {
        status: "active"
      }
    },
    {
      $lookup: {
        from: "favorites",
        let: { couponId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$coupon", "$$couponId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(userId)] }
                ],
              },
            },
          },
        ],
        as: "favoriteDocs",
      },
    },
    {
      $addFields: {
        isFavorite: {
          $cond: {
            if: { $gt: [{ $size: "$favoriteDocs" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    }
  )

  const couponQuery = new AggregationBuilder(Coupon, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()

  const result = await couponQuery.execute();

  return { data: result };
};

const getCouponsByStoreId = async (storeId: string, query: Record<string, any>) => {
  const searchableFields = ["title", "subtitle", "howToUse", "terms", "code"];
  query.store = storeId
  const couponQuery = new QueryBuilder(Coupon.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await couponQuery.countTotal();
  const result = await couponQuery.queryModel.populate("store");

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
}

const getSingleCoupon = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId)
    .populate([
      {
        path: "store",
        select: "name image"
      },
    ])
  return coupon;
};

const updateCoupon = async (couponId: string, payload: Partial<ICoupon>) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new AppError(404, "Coupon not found");
  const result = await Coupon.findByIdAndUpdate(couponId, payload, {
    new: true,
  });
  return result;
};

const copyCoupon = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new AppError(404, "Coupon not found");
  const result = await Coupon.findByIdAndUpdate(couponId, { $inc: { realUses: 1 } }, { new: true });
  return result;
};

const deleteCoupon = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new AppError(404, "Coupon not found");
  const result = await Coupon.findByIdAndDelete(couponId);
  return result;
};

const toggleFeaturedStatus = async (id: string) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new AppError(404, "Coupon not found");
  const result = await Coupon.findByIdAndUpdate(id, { $set: { isFeatured: !coupon.isFeatured } }, { new: true });
  return result;
}

const couponService = {
  createCoupon,
  getAllCoupons,
  getTrendingCoupons,
  getFeaturedCoupons,
  getSingleCoupon,
  updateCoupon,
  copyCoupon,
  deleteCoupon,
  toggleFeaturedStatus,
  getCouponsByStoreId
};

export default couponService;