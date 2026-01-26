import Favorite from "./favorite.model";
import { AppError } from "../../classes/appError";
import { IFavorite } from "./favorite.interface";
import QueryBuilder from "../../classes/queryBuilder";
import Coupon from "../coupon/coupon.model";

const addOrRemoveFavorite = async (payload: IFavorite) => {
  const { user, coupon } = payload;
  const couponData = await Coupon.findById(payload.coupon);

  if (!couponData) throw new AppError(400, "Invalid coupon id");

  const existingFavorite = await Favorite.findOne({ user, coupon });

  if (existingFavorite) {
    const result = await Favorite.findOneAndDelete({ user, coupon });
    if (!result) throw new AppError(500, "Failed to remove favorite");
    return { action: "removed", data: null };
  } else {
    const newFavorite = new Favorite({ user, coupon });
    const result = await newFavorite.save();
    return { action: "added", data: result };
  }
};

const getAllFavorites = async (query: Record<string, any>, id: string) => {
  query.user = id;
  const favoriteQuery = new QueryBuilder(Favorite.find(), query)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await favoriteQuery.countTotal();
  const result = await favoriteQuery.queryModel.populate([
    {
      path: "coupon",
      select: "title arabicTitle validity fakeUses code",
      populate: { path: "store", select: "name arabicName image arabicImage" },
    },
  ]);

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
};

const favoriteService = {
  addOrRemoveFavorite,
  getAllFavorites,
};

export default favoriteService;
