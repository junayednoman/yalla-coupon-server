import { ObjectId } from "mongoose";
import { TFile } from "../../../interface/file.interface";

export interface IPopup {
  title?: string;
  arabicTitle?: string;
  image: string;
  arabicImage: string;
  coupon?: ObjectId;
}

export type TPopupFiles = {
  image: TFile[];
  arabicImage: TFile[];
};
