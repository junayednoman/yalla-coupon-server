import { TFile } from "../../../interface/file.interface";
import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import bannerService from "./banner.service";

const createBanner = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await bannerService.createBanner(req.body, req.file as TFile);
  successResponse(res, {
    message: "Banner created successfully!",
    data: result,
    status: 201,
  });
});

const getAllBanners = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await bannerService.getAllBanners(req.query);
  successResponse(res, {
    message: "Banners retrieved successfully!",
    data: result,
  });
});

const getSingleBanner = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await bannerService.getSingleBanner(req.params.id);
  successResponse(res, {
    message: "Banner retrieved successfully!",
    data: result,
  });
});

const updateBanner = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await bannerService.updateBanner(req.params.id, req.body, req.file);
  successResponse(res, {
    message: "Banner updated successfully!",
    data: result,
  });
});

const deleteBanner = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await bannerService.deleteBanner(req.params.id);
  successResponse(res, {
    message: "Banner deleted successfully!",
    data: result,
  });
});

const bannerController = {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
};

export default bannerController;