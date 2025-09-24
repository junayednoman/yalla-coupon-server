import Editor from "./editor.model";
import { AppError } from "../../classes/appError";
import { IEditor } from "./editor.interface";
import Auth from "../auth/auth.model";
import { startSession } from "mongoose";
import { TFile } from "../../../interface/file.interface";
import QueryBuilder from "../../classes/queryBuilder";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";

const updateProfile = async (editorId: string, payload: Partial<IEditor>, file?: TFile) => {
  const auth = await Auth.findById(editorId).populate("user");

  if (file) payload.image = await uploadToS3(file);
  const result = await Editor.findOneAndUpdate({ _id: (auth?.user as any)?._id }, payload, { new: true });
  if ((auth?.user as any).image && payload.image && result) await deleteFromS3((auth?.user as any).image);
  return result;
};

const getProfile = async (editorId: string) => {
  const editor = await Auth.findById(editorId).select("user role").populate("user");
  return editor;
};

const getAllEditors = async (query: Record<string, any>) => {
  const searchableFields = ["name", "email", "phone", "image"];

  const editorQuery = new QueryBuilder(Editor.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await editorQuery.countTotal();
  const result = await editorQuery.queryModel;

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
};

const getSingleEditor = async (editorId: string) => {
  const editor = await Editor.findById(editorId);
  return editor;
};

const changeEditorStatus = async (id: string) => {
  const editor = await Editor.findById(id);
  if (!editor) throw new AppError(400, "Invalid editor id!");

  const session = await startSession();
  session.startTransaction();
  try {
    await Auth.findOneAndUpdate({ user: editor._id }, { isBlocked: editor.isBlocked ? false : true }, { new: true, session });
    const result = await Editor.findByIdAndUpdate(id, { isBlocked: editor.isBlocked ? false : true }, { new: true, session });
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error changing editor status!");
  } finally {
    session.endSession();
  }
};

const deleteEditor = async (id: string) => {
  const editor = await Editor.findById(id);
  if (!editor) throw new AppError(400, "Invalid editor id!");

  const session = await startSession();
  try {
    session.startTransaction();

    await Auth.findOneAndDelete({ user: id });
    const result = await Editor.findByIdAndDelete(id);

    if (result?.image) await deleteFromS3(result.image);
    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error deleting editor!");
  } finally {
    session.endSession();
  }
  return editor

}

const editorService = {
  updateProfile,
  getProfile,
  getAllEditors,
  getSingleEditor,
  changeEditorStatus,
  deleteEditor
};

export default editorService;