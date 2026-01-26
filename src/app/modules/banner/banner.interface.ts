import { ObjectId } from "mongoose";
import { TFile } from "../../../interface/file.interface";

export interface IBanner {
  coupon?: ObjectId;
  image: string;
  arabicImage: string;
  title: string;
  arabicTitle: string;
  subTitle: string;
  arabicSubTitle: string;
}

export interface TBannerFiles {
  image: TFile[];
  arabicImage: TFile[];
}
