import { TFile } from "../../../interface/file.interface";

export type TCategory = {
  name: string;
  arabicName: string;
  image: string;
  arabicImage?: string;
};

export type TCategoryFiles = {
  image: TFile[];
  arabicImage: TFile[];
};
