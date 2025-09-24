import Category from "./category.model";
import { AppError } from "../../classes/appError";
import { TCategory } from "./category.interface";
import QueryBuilder from "../../classes/queryBuilder";
import { TFile } from "../../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";

const createCategory = async (payload: TCategory, file: TFile) => {
  if (!file) throw new AppError(400, "Image is required!");
  const existing = await Category.findOne({ name: payload.name });
  if (existing) throw new AppError(400, "Category already exists!");

  payload.image = await uploadToS3(file);
  const category = await Category.create(payload);
  return category;
};

const getAllCategories = async (query: Record<string, any>) => {
  const searchableFields = ["name"];

  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const total = await categoryQuery.countTotal();
  const result = await categoryQuery.queryModel;
  const meta = {
    total,
    limit: query.limit || 10,
    page: query.page || 1
  }
  return { data: result, meta };
};

const updateCategory = async (id: string, payload: Partial<TCategory>, file?: TFile) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(400, "Invalid category ID!");
  }

  const existingWithName = await Category.findOne({ name: payload.name });
  if (existingWithName) throw new AppError(400, "Category already exists!");

  if (file) payload.image = await uploadToS3(file);
  const updated = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (updated && category.image) await deleteFromS3(category.image)
  return updated;
};

const deleteCategory = async (id: string) => {
  const existing = await Category.findById(id);
  if (!existing) {
    throw new AppError(400, "Invalid category ID!");
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (deleted?.image) await deleteFromS3(deleted.image)
  return deleted;
};

export default {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};