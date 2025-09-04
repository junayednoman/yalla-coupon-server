import Coupon from "./coupon.model";
import { AppError } from "../../classes/appError";
import { ICoupon } from "./coupon.interface";
import Store from "../store/store.model";
import Category from "../category/category.model";
import AggregationBuilder from "../../classes/AggregationBuilder";
import QueryBuilder from "../../classes/queryBuilder";

const createCoupon = async (payload: ICoupon) => {
  const store = await Store.findById(payload.store);
  if (!store) throw new AppError(400, "Invalid store id");
  for (const category of payload.categories) {
    const cat = await Category.findById(category);
    if (!cat) throw new AppError(400, "Invalid category id: " + category);
  }
  const result = await Coupon.create(payload);
  return result;
};

const getAllCoupons = async (query: Record<string, any>) => {
  const searchableFields = ["categories.name", "store.name", "title", "description", "howToUse", "terms"];

  const pipeline = [
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store",
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      }
    }
  ]

  const couponQuery = new AggregationBuilder(Coupon, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await couponQuery.countTotal();
  const result = await couponQuery.execute();
  return { data: result, meta };
};

const getCouponsByStoreId = async (storeId: string, query: Record<string, any>) => {
  const searchableFields = ["title", "description", "howToUse", "terms", "code"];
  query.store = storeId
  const couponQuery = new QueryBuilder(Coupon.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await couponQuery.countTotal();
  const result = await couponQuery.queryModel.populate("store");
  return { data: result, meta };
}

const getSingleCoupon = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId)
    .populate("store", "name")
    .populate("categories", "name");
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

const couponService = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  copyCoupon,
  deleteCoupon,
  getCouponsByStoreId
};

export default couponService;