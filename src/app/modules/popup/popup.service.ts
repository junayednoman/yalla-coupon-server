import { AppError } from "../../classes/appError";
import Coupon from "../coupon/coupon.model";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import { IPopup, TPopupFiles } from "./popup.interface";
import Popup from "./popup.model";

const addPopup = async (payload: IPopup, files: TPopupFiles) => {
  const existing = await Popup.findOne();
  if (!existing) {
    if (!files.image.length) throw new AppError(400, "Image is required!");
    if (!files.arabicImage.length)
      throw new AppError(400, "Arabic image is required!");
  }

  if (payload.coupon) {
    const coupon = await Coupon.findById(payload.coupon);
    if (!coupon) {
      throw new AppError(400, "Invalid coupon id");
    }
  }

  const image = await uploadToS3(files.image[0]);
  const arabicImage = await uploadToS3(files.arabicImage[0]);

  const popupData = { ...payload, image, arabicImage };
  if (existing) {
    const result = await Popup.findByIdAndUpdate(existing._id, popupData, {
      new: true,
    });
    return result;
  } else {
    const result = await Popup.create(popupData);
    return result;
  }
};

const getPopup = async (popupId: string) => {
  const popup = await Popup.findById(popupId).populate("coupon", "code title");
  if (!popup) throw new AppError(404, "Popup not found");
  return popup;
};

const getAllPopups = async () => {
  const popups = await Popup.find().populate("coupon", "code title");
  return popups;
};

const deletePopup = async (popupId: string) => {
  const popup = await Popup.findById(popupId);
  if (!popup) throw new AppError(404, "Popup not found");
  const result = await Popup.findByIdAndDelete(popupId);
  if (result && popup.image) await deleteFromS3(popup.image);
  if (result && popup.arabicImage) await deleteFromS3(popup.arabicImage);
  return result;
};

const popupService = {
  addPopup,
  getAllPopups,
  getPopup,
  deletePopup,
};

export default popupService;
