import { ObjectId } from "mongoose";
import { TFile } from "../../../interface/file.interface";

export interface IStore {
  name: string;
  arabicName: string;
  image: string;
  arabicImage?: string;
  thumbnail: string;
  arabicThumbnail: string;
  categories: ObjectId[];
  isFeatured: boolean;
}

export interface TStoreFiles {
  image: TFile[];
  arabicImage: TFile[];
  thumbnail: TFile[];
  arabicThumbnail: TFile[];
}
