import { AppError } from "../../classes/appError";
import { IStore, TStoreFiles } from "./store.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import Category from "../category/category.model";
import mongoose, { PipelineStage } from "mongoose";
import AggregationBuilder from "../../classes/AggregationBuilder";
import Store from "./store.model";
import Coupon from "../coupon/coupon.model";

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
  // if (!files?.arabicImage?.length)
  //   throw new AppError(400, "Arabic image is required!");
  if (!files?.thumbnail?.length)
    throw new AppError(400, "Thumbnail is required!");
  if (!files?.arabicImage?.length)
    throw new AppError(400, "Arabic thumbnail is required!");

  payload.image = await uploadToS3(files.image[0]);
  // payload.arabicImage = await uploadToS3(files.arabicImage[0]);
  payload.thumbnail = await uploadToS3(files.thumbnail[0]);
  payload.arabicThumbnail = await uploadToS3(files.arabicThumbnail[0]);
  const result = await Store.create(payload);
  return result;
};

const getAllStores = async (query: Record<string, any>) => {
  const searchableFields = ["name", "image"];

  const pipeline: PipelineStage[] = [];

  if (query.categories) {
    pipeline.push({
      $match: {
        categories: {
          $in: [new mongoose.Types.ObjectId(query.categories)],
        },
      },
    });

    delete query.categories;
  }

  if (query.isFeatured) {
    pipeline.push({
      $match: {
        isFeatured: query.isFeatured === "true",
      },
    });

    delete query.isFeatured;
  }

  const targetCountry = query.country;
  delete query.country;

  pipeline.push({
    $lookup: {
      from: "coupons",
      let: { storeId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$store", "$$storeId"] },

            status: "active",

            ...(targetCountry ? { countries: targetCountry } : {}),
          },
        },

        {
          $project: {
            _id: 1,
          },
        },
      ],
      as: "coupons",
    },
  });

  pipeline.push({
    $addFields: {
      couponCount: { $size: "$coupons" },
    },
  });

  pipeline.push({ $project: { coupons: 0 } });

  const storeQuery = new AggregationBuilder(Store, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort();

  const result = await storeQuery.execute();
  const total = await storeQuery.countTotal();

  const meta = {
    total,
    limit: query.limit || 10,
    page: query.page || 1,
  };

  return { data: result, meta };
};

const getTopStores = async () => {
  const topStores = await Coupon.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "storeDetails",
      },
    },

    { $unwind: "$storeDetails" },

    {
      $group: {
        _id: "$store",
        storeName: { $first: "$storeDetails.name" },
        storeImage: { $first: "$storeDetails.image" },
        totalCouponUses: { $sum: "$fakeUses" },
      },
    },

    { $sort: { totalCouponUses: -1 } },

    { $limit: 5 },
  ]);

  return topStores;
};

const getSingleStore = async (storeId: string) => {
  const store = await Store.findById(storeId);
  return store;
};

const updateStore = async (
  storeId: string,
  payload: Partial<IStore>,
  files: TStoreFiles,
) => {
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
  if (files?.arabicImage?.length)
    payload.arabicImage = await uploadToS3(files.arabicImage[0]);
  if (files?.thumbnail?.length)
    payload.thumbnail = await uploadToS3(files.thumbnail[0]);
  if (files?.arabicThumbnail?.length)
    payload.arabicThumbnail = await uploadToS3(files.arabicThumbnail[0]);

  const result = await Store.findByIdAndUpdate(storeId, payload, {
    new: true,
    runValidators: true,
  });

  if (result) {
    if (store.image && payload.image) await deleteFromS3(store.image);
    if (store.arabicImage && payload.arabicImage)
      await deleteFromS3(store.image);
    if (store.thumbnail && payload.thumbnail)
      await deleteFromS3(store.thumbnail);
    if (store.arabicThumbnail && payload.arabicThumbnail)
      await deleteFromS3(store.arabicThumbnail);
  }

  return result;
};

const deleteStore = async (storeId: string) => {
  const store = await Store.findById(storeId);
  if (!store) throw new AppError(404, "Store not found");
  const result = await Store.findByIdAndDelete(storeId);
  if (result) {
    await deleteFromS3(store.image);
    if (store.arabicImage) await deleteFromS3(store.arabicImage);
    await deleteFromS3(store.thumbnail);
    await deleteFromS3(store.arabicThumbnail);
  }
  return result;
};

const storeService = {
  createStore,
  getAllStores,
  getTopStores,
  getSingleStore,
  updateStore,
  deleteStore,
};

export default storeService;
