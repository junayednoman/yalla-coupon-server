import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import storeService from "./store.service";

const createStore = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await storeService.createStore(req.body, req.files as any);
  successResponse(res, {
    message: "Store created successfully!",
    data: result,
    status: 201,
  });
});

const getAllStores = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await storeService.getAllStores(req.query);
  successResponse(res, {
    message: "Stores retrieved successfully!",
    data: result,
  });
});

const getTopStores = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await storeService.getTopStores();
  successResponse(res, {
    message: "Stores retrieved successfully!",
    data: result,
  });
});

const getSingleStore = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await storeService.getSingleStore(req.params.id);
  successResponse(res, {
    message: "Store retrieved successfully!",
    data: result,
  });
});

const updateStore = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await storeService.updateStore(
    req.params.id,
    req.body,
    req.files as any
  );
  successResponse(res, {
    message: "Store updated successfully!",
    data: result,
  });
});

const deleteStore = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await storeService.deleteStore(req.params.id);
  successResponse(res, {
    message: "Store deleted successfully!",
    data: result,
  });
});

const storeController = {
  createStore,
  getAllStores,
  getTopStores,
  getSingleStore,
  updateStore,
  deleteStore,
};

export default storeController;
