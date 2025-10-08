import { TFile } from "../../../interface/file.interface";
import { userRoles } from "../../constants/global.constant";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import Auth from "../auth/auth.model";
import Editor from "../editor/editor.model";
import Viewer from "../viewer/viewer.model";
import { TAdmin } from "./admin.interface";
import Admin from "./admin.model";

const getAdminProfile = async (email: string) => {
  const auth = await Auth.findOne({ email });
  if (auth?.role === userRoles.admin) {
    const admin = await Admin.findOne({ email }).select(
      "email name image phone"
    );
    return admin;
  } else if (auth?.role === userRoles.editor) {
    const editor = await Editor.findOne({ email }).select(
      "email name image phone"
    );
    return editor;
  } else if (auth?.role === userRoles.viewer) {
    const viewer = await Viewer.findOne({ email }).select(
      "email name image phone"
    );
    return viewer;
  }
};

const updateAdminProfile = async (email: string, payload: Partial<TAdmin>) => {
  const auth = await Auth.findOne({ email });
  if (auth?.role === userRoles.admin) {
    await Admin.findOneAndUpdate({ email }, payload, {
      new: true,
    });
  } else if (auth?.role === userRoles.editor) {
    await Editor.findOneAndUpdate({ email }, payload, {
      new: true,
    });
  } else if (auth?.role === userRoles.viewer) {
    await Viewer.findOneAndUpdate({ email }, payload, {
      new: true,
    });
  }
};

const updateAdminProfileImage = async (email: string, file: TFile) => {
  const auth = await Auth.findOne({ email });
  if (!file) throw new Error("Image is required!");
  const image = await uploadToS3(file);
  if (auth?.role === userRoles.admin) {
    const admin = await Admin.findOne({ email });
    const result = await Admin.findOneAndUpdate(
      { email },
      { image },
      { new: true }
    );
    if (result) {
      if (admin?.image) deleteFromS3(admin.image);
    }
    return result;
  } else if (auth?.role === userRoles.editor) {
    const editor = await Editor.findOne({ email });
    const result = await Editor.findOneAndUpdate(
      { email },
      { image },
      { new: true }
    );
    if (result) {
      if (editor?.image) deleteFromS3(editor.image);
    }
    return result;
  } else if (auth?.role === userRoles.viewer) {
    const viewer = await Viewer.findOne({ email });
    const result = await Viewer.findOneAndUpdate(
      { email },
      { image },
      { new: true }
    );
    if (result) {
      if (viewer?.image) deleteFromS3(viewer.image);
    }
    return result;
  }
};

export const adminServices = {
  updateAdminProfile,
  getAdminProfile,
  updateAdminProfileImage,
};
