import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import activityService from "./activity.service";

const addActivity = handleAsyncRequest(async (req: TRequest, res) => {
  req.body.user = req.user!.id;
  const result = await activityService.addActivity(req.body);
  successResponse(res, {
    message: "Activity added successfully!",
    data: result,
    status: 201,
  });
});

const getAllActivities = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await activityService.getAllActivities(req.query);
  successResponse(res, {
    message: "Activities retrieved successfully!",
    data: result,
  });
});

const activityController = {
  addActivity,
  getAllActivities,
};

export default activityController;