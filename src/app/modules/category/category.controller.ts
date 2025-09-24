import { TFile } from "../../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import categoryService from "./category.service";

const createCategory = handleAsyncRequest(async (req: TRequest, res) => {
  successResponse(res, {
    message: "Category created successfully!",
    data: await categoryService.createCategory(req.body, req.file as TFile),
    status: 201,
  });
});

const getAllCategories = handleAsyncRequest(async (req: TRequest, res) => {
  successResponse(res, {
    message: "Categories retrieved successfully!",
    data: await categoryService.getAllCategories(req.query),
  });
});

const updateCategory = handleAsyncRequest(async (req: TRequest, res) => {
  successResponse(res, {
    message: "Category updated successfully!",
    data: await categoryService.updateCategory(req.params.id, req.body, req.file),
  });
});

const deleteCategory = handleAsyncRequest(async (req: TRequest, res) => {
  successResponse(res, {
    message: "Category deleted successfully!",
    data: await categoryService.deleteCategory(req.params.id),
  });
});

export default {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};