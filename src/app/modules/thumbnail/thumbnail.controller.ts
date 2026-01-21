import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import thumbnailService from "./thumbnail.service";

const addThumbnail = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await thumbnailService.addThumbnail(
    req.body,
    req.files as any,
  );
  successResponse(res, {
    message: "Thumbnail added successfully!",
    data: result,
    status: 201,
  });
});

const getAllThumbnails = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await thumbnailService.getAllThumbnails();
  successResponse(res, {
    message: "Thumbnails retrieved successfully!",
    data: result,
  });
});

const getThumbnail = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await thumbnailService.getThumbnail(req.params.id);
  successResponse(res, {
    message: "Thumbnail retrieved successfully!",
    data: result,
  });
});

const updateThumbnail = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await thumbnailService.updateThumbnail(
    req.params.id,
    req.body,
    req.files as any,
  );
  successResponse(res, {
    message: "Thumbnail updated successfully!",
    data: result,
  });
});

const deleteThumbnail = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await thumbnailService.deleteThumbnail(req.params.id);
  successResponse(res, {
    message: "Thumbnail deleted successfully!",
    data: result,
  });
});

const thumbnailController = {
  addThumbnail,
  getThumbnail,
  updateThumbnail,
  deleteThumbnail,
  getAllThumbnails,
};

export default thumbnailController;
