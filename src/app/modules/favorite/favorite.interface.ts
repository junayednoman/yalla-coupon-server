import { ObjectId } from "mongoose";

export interface IFavorite {
  user: ObjectId;
  coupon: ObjectId;
}