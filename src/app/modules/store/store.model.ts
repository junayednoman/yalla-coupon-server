import mongoose, { Schema } from "mongoose";
import { IStore } from "./store.interface";

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    thumbnail: { type: String, required: true },
    categories: { type: [String], ref: "Category", required: true },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model<IStore>("Store", storeSchema);
export default Store;