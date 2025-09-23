import { TFile } from "../../../interface/file.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import editorService from "./editor.service";

const updateProfile = handleAsyncRequest(async (req: any, res) => {
  const result = await editorService.updateProfile(req.user.id, req.body, req.file as TFile);
  successResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const getProfile = handleAsyncRequest(async (req: any, res) => {
  const result = await editorService.getProfile(req.user.id);
  successResponse(res, {
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const getAllEditors = handleAsyncRequest(async (req: any, res) => {
  const result = await editorService.getAllEditors(req.query);
  successResponse(res, {
    message: "Editors retrieved successfully!",
    data: result,
  });
});

const getSingleEditor = handleAsyncRequest(async (req: any, res) => {
  const result = await editorService.getSingleEditor(req.params.id);
  successResponse(res, {
    message: "Editor retrieved successfully!",
    data: result,
  });
});

const changeEditorStatus = handleAsyncRequest(async (req: any, res) => {
  const result = await editorService.changeEditorStatus(req.params.id);
  successResponse(res, {
    message: `Editor ${result?.isBlocked ? "blocked" : "unblocked"} successfully!`,
    data: result,
  });
});

const deleteEditor = handleAsyncRequest(async (req: any, res) => {
  const result = await editorService.deleteEditor(req.params.id);
  successResponse(res, {
    message: `Editor deleted successfully!`,
    data: result,
  });
});

const editorController = {
  updateProfile,
  getProfile,
  getAllEditors,
  getSingleEditor,
  changeEditorStatus,
  deleteEditor
};

export default editorController;