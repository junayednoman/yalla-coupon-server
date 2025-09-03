import mongoose, { Schema } from "mongoose";
import { IStore } from "./store.routes";

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model<IStore>("Store", storeSchema);
export default Store;