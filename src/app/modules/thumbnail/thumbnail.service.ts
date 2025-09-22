import Thumbnail from "./thumbnail.model";
import { AppError } from "../../classes/appError";
import { IThumbnail } from "./thumbnail.interface";
import { TFile } from "../../../interface/file.interface";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import Coupon from "../coupon/coupon.model";
import deleteLocalFile from "../../utils/deleteLocalFile";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";

const addThumbnail = async (payload: IThumbnail, file: TFile) => {
  if (!file) throw new AppError(400, "Image is required!");
  const coupon = await Coupon.findById(payload.coupon);
  if (!coupon) {
    if (file) await deleteLocalFile(file.filename);
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
    if (file) await deleteLocalFile(file.filename);
    throw new AppError(404, "Thumbnail not found");
  }

  const coupon = await Coupon.findById(payload.coupon);
  if (!coupon) {
    if (file) await deleteLocalFile(file.filename);
    throw new AppError(400, "Invalid coupon id");
  }

  if (file) payload.image = await uploadToS3(file);
  const result = await Thumbnail.findByIdAndUpdate(thumbnailId, payload, { new: true });

  if (result && payload.image && thumbnail.image) await deleteFileFromS3(thumbnail.image);
  return result;
};

const deleteThumbnail = async (thumbnailId: string) => {
  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) throw new AppError(404, "Thumbnail not found");
  const result = await Thumbnail.findByIdAndDelete(thumbnailId);
  if (result && thumbnail.image) await deleteFileFromS3(thumbnail.image)
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