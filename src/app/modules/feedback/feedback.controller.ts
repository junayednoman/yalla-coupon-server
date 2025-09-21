import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { feedbackServices } from "./feedback.service";

const sendFeedback = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await feedbackServices.sendFeedback(req.body, req.user!.email);

  successResponse(res, {
    message: "Contact message sent successfully!",
    data: result,
  });
})

export const feedbackController = {
  sendFeedback,
}