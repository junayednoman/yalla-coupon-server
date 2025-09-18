import Store from "./store.model";
import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import { IStore } from "./store.routes";
import { TFile } from "../../../interface/file.interface";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import deleteLocalFile from "../../utils/deleteLocalFile";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";

const createStore = async (payload: IStore, file: TFile) => {
  const existingStore = await Store.findOne({ name: payload.name });
  if (existingStore) {
    await deleteLocalFile(file.filename);
    throw new AppError(400, "Store already exists!");
  }
  payload.image = await uploadToS3(file);
  const result = await Store.create(payload);
  return result;
};

const getAllStores = async (query: Record<string, any>) => {
  const searchableFields = ["name", "image"];

  const storeQuery = new QueryBuilder(Store.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await storeQuery.countTotal();
  const result = await storeQuery.queryModel;

  const page = query.page || 1;
  const limit = query.limit || 10;
  const meta = { total, page, limit };

  return { data: result, meta };
};

const getSingleStore = async (storeId: string) => {
  const store = await Store.findById(storeId);
  return store;
};

const updateStore = async (storeId: string, payload: Partial<IStore>, file?: TFile) => {
  const store = await Store.findById(storeId);
  if (!store) {
    if (file) await deleteLocalFile(file.filename);
    throw new AppError(404, "Store not found");
  }
  if (file) payload.image = await uploadToS3(file);
  const result = await Store.findByIdAndUpdate(storeId, payload, {
    new: true,
    runValidators: true,
  });
  if (file && result) await deleteFileFromS3(store.image)
  return result;
};

const deleteStore = async (storeId: string) => {
  const store = await Store.findById(storeId);
  if (!store) throw new AppError(404, "Store not found");
  const result = await Store.findByIdAndDelete(storeId);
  if (result) await deleteFileFromS3(store.image)
  return result;
};

const storeService = {
  createStore,
  getAllStores,
  getSingleStore,
  updateStore,
  deleteStore,
};

export default storeService;