import { Router } from "express";
import storeController from "./store.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { storeZodSchema } from "./store.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.admin]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  handleZodValidation(storeZodSchema, { formData: true }),
  storeController.createStore
);

router.get(
  "/",
  authVerify([userRoles.admin, userRoles.user]),
  storeController.getAllStores
);

router.get(
  "/:id",
  authVerify([userRoles.admin, userRoles.user]),
  storeController.getSingleStore
);

router.put(
  "/:id",
  authVerify([userRoles.admin]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  handleZodValidation(storeZodSchema.partial(), { formData: true }),
  storeController.updateStore
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  storeController.deleteStore
);

export const storeRoutes = router;