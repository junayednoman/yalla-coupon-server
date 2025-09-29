import Banner from "./banner.model";
import { AppError } from "../../classes/appError";
import { IBanner } from "./banner.interface";
import QueryBuilder from "../../classes/queryBuilder";
import { TFile } from "../../../interface/file.interface";
import Coupon from "../coupon/coupon.model";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";

const createBanner = async (payload: IBanner, file: TFile) => {
  const coupon = await Coupon.findById(payload.coupon.toString());
  if (!coupon) {
    throw new AppError(400, "Invalid coupon id");
  }

  if (!file) throw new AppError(400, "Image is required!");

  payload.image = await uploadToS3(file);
  const result = await Banner.create(payload);
  return result;
};

const getAllBanners = async (query: Record<string, any>) => {
  const searchableFields = ["title", "subTitle"];

  const bannerQuery = new QueryBuilder(Banner.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields()

  const total = await bannerQuery.countTotal();
  const result = await bannerQuery.queryModel.populate("coupon", "code type");

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
};

const getSingleBanner = async (bannerId: string) => {
  const banner = await Banner.findById(bannerId).populate([
    {
      path: "coupon", populate: {
        path: "store",
      }
    },
  ]);
  return banner;
};

const updateBanner = async (bannerId: string, payload: Partial<IBanner>, file?: TFile) => {
  if (payload.coupon) {
    const coupon = await Coupon.findById(payload.coupon)
    if (!coupon) {
      throw new AppError(400, "Invalid coupon id");
    }
  }
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new AppError(404, "Banner not found");
  }

  if (file) payload.image = await uploadToS3(file);
  const result = await Banner.findByIdAndUpdate(bannerId, payload, {
    new: true,
    runValidators: true,
  });

  if (banner.image && payload.image && result) await deleteFromS3(banner.image);

  return result;
};

const deleteBanner = async (bannerId: string) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) throw new AppError(404, "Banner not found");
  const result = await Banner.findByIdAndDelete(bannerId);
  if (result) await deleteFromS3(banner.image)
  return result;
};

const bannerService = {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
};

export default bannerService;