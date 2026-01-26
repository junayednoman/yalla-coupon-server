import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import popupService from "./popup.service";

const addPopup = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await popupService.addPopup(req.body, req.files as any);
  successResponse(res, {
    message: "Popup added successfully!",
    data: result,
    status: 201,
  });
});

const getAllPopups = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await popupService.getAllPopups();
  successResponse(res, {
    message: "Popups retrieved successfully!",
    data: result,
  });
});

const getPopup = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await popupService.getPopup(req.params.id);
  successResponse(res, {
    message: "Popup retrieved successfully!",
    data: result,
  });
});

const deletePopup = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await popupService.deletePopup(req.params.id);
  successResponse(res, {
    message: "Popup deleted successfully!",
    data: result,
  });
});

const popupController = {
  addPopup,
  getPopup,
  deletePopup,
  getAllPopups,
};

export default popupController;
