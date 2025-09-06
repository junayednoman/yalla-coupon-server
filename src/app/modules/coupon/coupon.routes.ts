import { Router } from "express";
import couponController from "./coupon.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { couponZodSchema } from "./coupon.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.admin, userRoles.editor]),
  handleZodValidation(couponZodSchema),
  couponController.createCoupon
);

router.get(
  "/",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer, userRoles.user]),
  couponController.getAllCoupons
);

router.get(
  "/single/:id",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer]),
  couponController.getSingleCoupon
);

router.get(
  "/:storeId",
  authVerify([userRoles.admin, userRoles.editor, userRoles.viewer]),
  couponController.getCouponsByStoreId
);

router.put(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  handleZodValidation(couponZodSchema.partial()),
  couponController.updateCoupon
);

router.delete(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  couponController.deleteCoupon
);

export const couponRoutes = router;