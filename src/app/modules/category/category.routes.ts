import { Router } from "express";
import { userRoles } from "../../constants/global.constant";
import authVerify from "../../middlewares/authVerify";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { CategoryValidationSchema } from "./category.validation";
import categoryController from "./category.controller";
import { upload } from "../../utils/awss3";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.admin]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "arabicImage", maxCount: 1 },
  ]),
  handleZodValidation(CategoryValidationSchema, { formData: true }),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.put(
  "/:id",
  authVerify([userRoles.admin]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "arabicImage", maxCount: 1 },
  ]),
  handleZodValidation(CategoryValidationSchema.partial(), { formData: true }),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  categoryController.deleteCategory,
);

export default router;
