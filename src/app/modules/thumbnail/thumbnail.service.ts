import Thumbnail from "./thumbnail.model";
import { AppError } from "../../classes/appError";
import { IThumbnail, TThumbnailFiles } from "./thumbnail.interface";
import Coupon from "../coupon/coupon.model";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";

const addThumbnail = async (payload: IThumbnail, files: TThumbnailFiles) => {
  if (!files.image.length) throw new AppError(400, "Image is required!");
  if (!files.arabicImage.length)
    throw new AppError(400, "Arabic image is required!");
  if (payload.coupon) {
    const coupon = await Coupon.findById(payload.coupon);
    if (!coupon) {
      throw new AppError(400, "Invalid coupon id");
    }
  }
  const image = await uploadToS3(files.image[0]);
  const arabicImage = await uploadToS3(files.arabicImage[0]);

  const thumbnailData = { ...payload, image, arabicImage };
  const result = await Thumbnail.create(thumbnailData);
  return result;
};

const getThumbnail = async (thumbnailId: string) => {
  const thumbnail = await Thumbnail.findById(thumbnailId).populate(
    "coupon",
    "code title",
  );
  if (!thumbnail) throw new AppError(404, "Thumbnail not found");
  return thumbnail;
};

const getAllThumbnails = async () => {
  const thumbnails = await Thumbnail.find().populate("coupon", "code title");
  return thumbnails;
};

const updateThumbnail = async (
  thumbnailId: string,
  payload: Partial<IThumbnail>,
  files?: TThumbnailFiles,
) => {
  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) {
    throw new AppError(404, "Thumbnail not found");
  }

  if (payload.coupon) {
    const coupon = await Coupon.findById(payload.coupon);
    if (!coupon) {
      throw new AppError(400, "Invalid coupon id");
    }
  }

  if (files?.image?.length) payload.image = await uploadToS3(files.image[0]);
  if (files?.arabicImage?.length)
    payload.arabicImage = await uploadToS3(files.image[0]);
  const result = await Thumbnail.findByIdAndUpdate(thumbnailId, payload, {
    new: true,
  });

  if (result) {
    if (payload.image && thumbnail.image) {
      await deleteFromS3(thumbnail.image);
    }
    if (payload.arabicImage && thumbnail.arabicImage) {
      await deleteFromS3(thumbnail.arabicImage);
    }
  }
  return result;
};

const deleteThumbnail = async (thumbnailId: string) => {
  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) throw new AppError(404, "Thumbnail not found");
  const result = await Thumbnail.findByIdAndDelete(thumbnailId);
  if (result && thumbnail.image) await deleteFromS3(thumbnail.image);
  if (result && thumbnail.arabicImage)
    await deleteFromS3(thumbnail.arabicImage);
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
