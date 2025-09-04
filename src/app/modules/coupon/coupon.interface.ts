import { ObjectId } from "mongoose";

export interface ICoupon {
  store: ObjectId;
  categories: ObjectId[];
  countries: string[];
  link: string;
  fakeUses: number;
  realUses: number;
  code: string;
  title: string;
  description: string;
  type: string;
  validity: string;
  applicableUserType: "FIRST_TIME" | "REPEAT" | "BOTH";
  howToUse: string[];
  terms: string[];
}