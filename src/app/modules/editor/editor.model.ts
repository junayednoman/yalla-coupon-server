import mongoose, { Schema } from "mongoose";
import { IEditor } from "./editor.interface";

const editorSchema = new Schema<IEditor>(
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

const Editor = mongoose.model<IEditor>("Editor", editorSchema);
export default Editor;