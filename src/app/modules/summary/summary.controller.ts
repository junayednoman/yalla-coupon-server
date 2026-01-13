import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { summaryService } from "./summary.service";

const getDashboardSummary = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await summaryService.getDashboardSummary(req.query);
  successResponse(res, {
    message: "Dashboard summary retrieved successfully!",
    data: result,
  });
});

export const summaryController = {
  getDashboardSummary,
};
