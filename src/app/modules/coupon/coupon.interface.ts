import { ObjectId } from "mongoose";

export interface ICoupon {
  store: ObjectId;
  countries: string[];
  link: string;
  arabicLink?: string;
  fakeUses: number;
  realUses: number;
  code?: string;
  title: string;
  arabicTitle: string;
  subtitle: string;
  arabicSubtitle: string;
  validity: string;
  type: "free" | "premium";
  status: "active" | "expired";
  applicableUserType: "FIRST_TIME" | "REPEAT" | "BOTH";
  discountPercentage: string;
  howToUse: string[];
  arabicHowToUse: string[];
  terms: string[];
  arabicTerms: string[];
  isFeatured?: boolean;
}
