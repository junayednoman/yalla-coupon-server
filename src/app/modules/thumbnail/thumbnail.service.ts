import Thumbnail from "./thumbnail.model";
import { AppError } from "../../classes/appError";
import { IThumbnail } from "./thumbnail.interface";
import { TFile } from "../../../interface/file.interface";
import Coupon from "../coupon/coupon.model";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";

const addThumbnail = async (payload: IThumbnail, file: TFile) => {
  if (!file) throw new AppError(400, "Image is required!");
  const coupon = await Coupon.findById(payload.coupon);
  if (!coupon) {
    throw new AppError(400, "Invalid coupon id");
  }
  const thumbnailData = { ...payload, image: await uploadToS3(file) };
  const result = await Thumbnail.create(thumbnailData);
  return result;
};

const getThumbnail = async (thumbnailId: string) => {
  const thumbnail = await Thumbnail.findById(thumbnailId).populate("coupon", "code title");
  if (!thumbnail) throw new AppError(404, "Thumbnail not found");
  return thumbnail;
};

const getAllThumbnails = async () => {
  const thumbnails = await Thumbnail.find().populate("coupon", "code title");
  return thumbnails;
}

const updateThumbnail = async (thumbnailId: string, payload: Partial<IThumbnail>, file?: TFile) => {
  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) {
    throw new AppError(404, "Thumbnail not found");
  }

  const coupon = await Coupon.findById(payload.coupon);
  if (!coupon) {
    throw new AppError(400, "Invalid coupon id");
  }

  if (file) payload.image = await uploadToS3(file);
  const result = await Thumbnail.findByIdAndUpdate(thumbnailId, payload, { new: true });

  if (result && payload.image && thumbnail.image) await deleteFromS3(thumbnail.image);
  return result;
};

const deleteThumbnail = async (thumbnailId: string) => {
  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) throw new AppError(404, "Thumbnail not found");
  const result = await Thumbnail.findByIdAndDelete(thumbnailId);
  if (result && thumbnail.image) await deleteFromS3(thumbnail.image)
  return result;
};

const thumbnailService = {
  addThumbnail,
  getAllThumbnails,
  getThumbnail,
  updateThumbnail,
  deleteThumbnail,
};

export default thumbnailService;