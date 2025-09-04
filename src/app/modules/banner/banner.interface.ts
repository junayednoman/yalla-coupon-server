import { ObjectId } from "mongoose";

export interface IBanner {
  coupon: ObjectId;
  image: string;
  title: string;
  subTitle: string;
}