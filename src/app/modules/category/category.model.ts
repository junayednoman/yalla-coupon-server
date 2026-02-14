import mongoose, { Schema } from "mongoose";
import { TCategory } from "./category.interface";

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true },
    arabicName: { type: String, required: true },
    image: { type: String, required: true },
    arabicImage: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model<TCategory>("Category", CategorySchema);

export default Category;
