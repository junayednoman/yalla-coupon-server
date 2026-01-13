import { Router } from "express";
import couponController from "./coupon.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { couponZodSchema } from "./coupon.validation";
import authVerify, { optionalAuthVerify } from "../../middlewares/authVerify";
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
  optionalAuthVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  couponController.getAllCoupons
);

router.get(
  "/trending",
  optionalAuthVerify([userRoles.user]),
  couponController.getTrendingCoupons
);

router.get(
  "/featured",
  optionalAuthVerify([userRoles.user]),
  couponController.getFeaturedCoupons
);

router.get(
  "/single/:id",
  optionalAuthVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  couponController.getSingleCoupon
);

router.get(
  "/:storeId",
  optionalAuthVerify([
    userRoles.admin,
    userRoles.editor,
    userRoles.viewer,
    userRoles.user,
  ]),
  couponController.getCouponsByStoreId
);

router.put(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  handleZodValidation(couponZodSchema.partial()),
  couponController.updateCoupon
);

router.patch(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  couponController.toggleFeaturedStatus
);

router.delete(
  "/:id",
  authVerify([userRoles.admin, userRoles.editor]),
  couponController.deleteCoupon
);

export const couponRoutes = router;
