import { AppError } from "../../classes/appError";
import Auth from "../auth/auth.model";
import { startSession } from "mongoose";
import { TFile } from "../../../interface/file.interface";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import QueryBuilder from "../../classes/queryBuilder";
import { TViewer } from "./viewer.interface";
import Viewer from "./viewer.model";

const updateProfile = async (viewerId: string, payload: Partial<TViewer>, file?: TFile) => {
  const auth = await Auth.findById(viewerId).populate("user");

  if (file) payload.image = await uploadToS3(file);
  const result = await Viewer.findOneAndUpdate({ _id: (auth?.user as any)?._id }, payload, { new: true });
  if ((auth?.user as any).image && payload.image && result) await deleteFileFromS3((auth?.user as any).image);
  return result;
};

const getProfile = async (viewerId: string) => {
  const result = await Auth.findById(viewerId).select("user role").populate("user");
  return result;
};

const getAllViewers = async (query: Record<string, any>) => {
  const searchableFields = ["name", "email", "phone", "image"];

  const viewerQuery = new QueryBuilder(Viewer.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await viewerQuery.countTotal();
  const result = await viewerQuery.queryModel;

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
};

const getSingleViewer = async (viewerId: string) => {
  const viewer = await Viewer.findById(viewerId);
  return viewer;
};

const changeViewerStatus = async (id: string) => {
  const viewer = await Viewer.findById(id);
  if (!viewer) throw new AppError(400, "Invalid viewer id!");

  const session = await startSession();
  session.startTransaction();
  try {
    await Auth.findOneAndUpdate({ user: viewer._id }, { isBlocked: viewer.isBlocked ? false : true }, { new: true, session });
    const result = await Viewer.findByIdAndUpdate(id, { isBlocked: viewer.isBlocked ? false : true }, { new: true, session });
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error changing viewer status!");
  } finally {
    session.endSession();
  }
};

const deleteViewer = async (id: string) => {
  const viewer = await Viewer.findById(id);
  if (!viewer) throw new AppError(400, "Invalid viewer id!");

  const session = await startSession();
  try {
    session.startTransaction();

    await Auth.findOneAndDelete({ user: id });
    await Viewer.findByIdAndDelete(id);

    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error deleting viewer!");
  } finally {
    session.endSession();
  }
  return viewer

}

const viewerService = {
  updateProfile,
  getProfile,
  getAllViewers,
  getSingleViewer,
  changeViewerStatus,
  deleteViewer
};

export default viewerService;