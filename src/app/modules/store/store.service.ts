
import { AppError } from "../../classes/appError";
import { IStore, TStoreFiles } from "./store.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import Category from "../category/category.model";
import mongoose, { PipelineStage } from "mongoose";
import AggregationBuilder from "../../classes/AggregationBuilder";
import Store from "./store.model";

const createStore = async (payload: IStore, files: TStoreFiles) => {
  const existingStore = await Store.findOne({ name: payload.name });
  if (existingStore) {
    throw new AppError(400, "Store already exists!");
  }

  for (const category of payload.categories) {
    const cat = await Category.findById(category);
    if (!cat) {
      throw new AppError(400, "Invalid category id: " + category);
    }
  }

  if (!files?.image?.length) throw new AppError(400, "Image is required!");
  if (!files?.thumbnail?.length) throw new AppError(400, "Thumbnail is required!");

  payload.image = await uploadToS3(files.image[0]);
  payload.thumbnail = await uploadToS3(files.thumbnail[0]);
  const result = await Store.create(payload);
  return result;
};

const getAllStores = async (query: Record<string, any>) => {
  const searchableFields = ["name", "image"];

  const pipeline: PipelineStage[] = [];

  if (query.categories) {
    pipeline.push(
      {
        $match: {
          categories: {
            $in: [new mongoose.Types.ObjectId(query.categories)]
          }
        }
      }
    )

    delete query.categories
  }

  pipeline.push(
    {
      $lookup: {
        from: "coupons",
        localField: "_id",
        foreignField: "store",
        as: "coupons"
      }
    },
    {
      $addFields: {
        couponCount: { $size: "$coupons" }
      }
    },
    { $project: { coupons: 0 } }
  )

  const storeQuery = new AggregationBuilder(Store, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()

  const result = await storeQuery.execute();
  const total = await storeQuery.countTotal();
  const meta = {
    total,
    limit: query.limit || 10,
    page: query.page || 1
  }
  return { data: result, meta };
};

const getSingleStore = async (storeId: string) => {
  const store = await Store.findById(storeId);
  return store;
};

const updateStore = async (storeId: string, payload: Partial<IStore>, files: TStoreFiles) => {
  const store = await Store.findById(storeId);
  if (!store) {
    throw new AppError(404, "Store not found");
  }

  if (payload.categories?.length) {
    for (const category of payload.categories) {
      const cat = await Category.findById(category);
      if (!cat) {
        throw new AppError(400, "Invalid category id: " + category);
      }
    }
  }

  if (files?.image?.length) payload.image = await uploadToS3(files.image[0]);
  if (files?.thumbnail?.length) payload.thumbnail = await uploadToS3(files.thumbnail[0]);

  const result = await Store.findByIdAndUpdate(storeId, payload, {
    new: true,
    runValidators: true,
  });

  if (result) {
    if (store.image && payload.image) await deleteFromS3(store.image);
    if (store.thumbnail && payload.thumbnail) await deleteFromS3(store.thumbnail);
  }

  return result;
};

const deleteStore = async (storeId: string) => {
  const store = await Store.findById(storeId);
  if (!store) throw new AppError(404, "Store not found");
  const result = await Store.findByIdAndDelete(storeId);
  if (result) {
    await deleteFromS3(store.image)
    await deleteFromS3(store.thumbnail)
  }
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