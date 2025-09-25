import { ObjectId } from "mongoose";
import { TFile } from "../../../interface/file.interface";

export interface IStore {
  name: string;
  image: string;
  thumbnail: string
  categories: ObjectId[]
}

export interface TStoreFiles {
  image: TFile[]
  thumbnail: TFile[]
}