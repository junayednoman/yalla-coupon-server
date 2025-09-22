import { ObjectId } from "mongoose";

export interface IThumbnail {
  image: string;
  coupon: ObjectId;
}