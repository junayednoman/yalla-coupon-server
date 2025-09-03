import { TFile } from "../../../interface/file.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import viewerService from "./viewer.service";

const updateProfile = handleAsyncRequest(async (req: any, res) => {
  const result = await viewerService.updateProfile(req.user.id, req.body, req.file as TFile);
  successResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const getProfile = handleAsyncRequest(async (req: any, res) => {
  const result = await viewerService.getProfile(req.user.id);
  successResponse(res, {
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const getAllViewers = handleAsyncRequest(async (req: any, res) => {
  const result = await viewerService.getAllViewers(req.query);
  successResponse(res, {
    message: "Viewers retrieved successfully!",
    data: result,
  });
});

const getSingleViewer = handleAsyncRequest(async (req: any, res) => {
  const result = await viewerService.getSingleViewer(req.params.id);
  successResponse(res, {
    message: "Viewer retrieved successfully!",
    data: result,
  });
});

const changeViewerStatus = handleAsyncRequest(async (req: any, res) => {
  const result = await viewerService.changeViewerStatus(req.params.id);
  successResponse(res, {
    message: `Viewer ${result?.isBlocked ? "blocked" : "unblocked"} successfully!`,
    data: result,
  });
});

const viewerController = {
  updateProfile,
  getProfile,
  getAllViewers,
  getSingleViewer,
  changeViewerStatus,
};

export default viewerController;