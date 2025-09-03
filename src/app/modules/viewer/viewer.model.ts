import mongoose, { Schema } from "mongoose";
import { TViewer } from "./viewer.interface";

const viewerSchema = new Schema<TViewer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    image: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Viewer = mongoose.model<TViewer>("Viewer", viewerSchema);
export default Viewer;