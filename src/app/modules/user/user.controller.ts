import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import userService from "./user.service";

const signup = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await userService.userSignUp(req.body);
  successResponse(res, {
    message: "User signed up successfully!",
    data: result,
    status: 201,
  });
});

const updateProfile = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await userService.updateProfile(req.user!.id, req.body, req.file);
  successResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const getProfile = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await userService.getProfile(req.user!.id);
  successResponse(res, {
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const getAllUsers = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await userService.getAllUsers(req.query);
  successResponse(res, {
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingleUser = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await userService.getSingleUser(req.params.id);
  successResponse(res, {
    message: "User retrieved successfully!",
    data: result,
  });
});

const changeUserStatus = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await userService.changeUserStatus(req.params.id);
  successResponse(res, {
    message: `User ${result?.isBlocked ? "blocked" : "unblocked"} successfully!`,
    data: result,
  });
});

const userController = {
  signup,
  updateProfile,
  getProfile,
  getAllUsers,
  getSingleUser,
  changeUserStatus
};

export default userController;