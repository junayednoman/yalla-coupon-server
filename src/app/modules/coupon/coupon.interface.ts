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
  subtitle: string;
  validity: string;
  status: "active" | "expired";
  applicableUserType: "FIRST_TIME" | "REPEAT" | "BOTH";
  howToUse: string[];
  terms: string[];
}