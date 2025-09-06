import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import favoriteService from "./favorite.service";

const addOrRemoveFavorite = handleAsyncRequest(async (req: TRequest, res) => {
  req.body.user = req.user!.id;
  const result = await favoriteService.addOrRemoveFavorite(req.body);
  successResponse(res, {
    message: `${result.action === "added" ? "Favorite added" : "Favorite removed"} successfully!`,
    data: result.data,
    status: result.action === "added" ? 201 : 200,
  });
});

const getAllFavorites = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await favoriteService.getAllFavorites(req.query);
  successResponse(res, {
    message: "Favorites retrieved successfully!",
    data: result,
  });
});

const favoriteController = {
  addOrRemoveFavorite,
  getAllFavorites,
};

export default favoriteController;