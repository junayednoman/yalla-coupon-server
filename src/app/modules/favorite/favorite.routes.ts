import { Router } from "express";
import favoriteController from "./favorite.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { favoriteZodSchema } from "./favorite.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.user]),
  handleZodValidation(favoriteZodSchema),
  favoriteController.addOrRemoveFavorite
);

router.get(
  "/",
  authVerify([userRoles.user]),
  favoriteController.getAllFavorites
);

export const favoriteRoutes = router;