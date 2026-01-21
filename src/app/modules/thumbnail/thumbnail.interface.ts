import { ObjectId } from "mongoose";
import { TFile } from "../../../interface/file.interface";

export interface IThumbnail {
  image: string;
  arabicImage: string;
  coupon: ObjectId;
}

export type TThumbnailFiles = {
  image: TFile[];
  arabicImage: TFile[];
};
