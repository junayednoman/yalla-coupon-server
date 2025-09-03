import { TFile } from "../../../interface/file.interface";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { TAdmin } from "./admin.interface";
import Admin from "./admin.model";

const getAdminProfile = async (email: string) => {
  const admin = await Admin.findOne({ email }).select("email name image phone");
  return admin;
};

const updateAdminProfile = async (email: string, payload: Partial<TAdmin>) => {
  const result = await Admin.findOneAndUpdate({ email }, payload, { new: true });
  return result;
};

const updateAdminProfileImage = async (email: string, file: TFile) => {
  const admin = await Admin.findOne({ email });
  if (!file) throw new Error("Image is required!");
  const image = await uploadToS3(file);
  const result = await Admin.findOneAndUpdate({ email }, { image }, { new: true });
  if (result) {
    if (admin?.image) deleteFileFromS3(admin?.image.split(".com/")[1]);
  }
  return result;
};

export const adminServices = { updateAdminProfile, getAdminProfile, updateAdminProfileImage };
