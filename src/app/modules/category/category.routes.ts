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
  upload.single("image"),
  handleZodValidation(CategoryValidationSchema, { formData: true }),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.put(
  "/:id",
  authVerify([userRoles.admin]),
  upload.single("image"),
  handleZodValidation(CategoryValidationSchema.partial(), { formData: true }),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authVerify([userRoles.admin]),
  categoryController.deleteCategory,
);

export default router;
