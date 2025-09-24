import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import couponService from "./coupon.service";

const createCoupon = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.createCoupon(req.body);
  successResponse(res, {
    message: "Coupon created successfully!",
    data: result,
    status: 201,
  });
});

const getAllCoupons = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.getAllCoupons(req.query, req.user!.id, req.user!.role as "Admin" | "Editor" | "Viewer" | "User");
  successResponse(res, {
    message: "Coupons retrieved successfully!",
    data: result,
  });
});

const getTrendingCoupons = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.getTrendingCoupons(req.query, req.user!.id);
  successResponse(res, {
    message: "Coupons retrieved successfully!",
    data: result,
  });
});

const getFeaturedCoupons = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.getFeaturedCoupons(req.query, req.user!.id);
  successResponse(res, {
    message: "Coupons retrieved successfully!",
    data: result,
  });
});

const getCouponsByStoreId = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.getCouponsByStoreId(req.params.storeId, req.query);
  successResponse(res, {
    message: "Coupons retrieved successfully!",
    data: result,
  });
});

const getSingleCoupon = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.getSingleCoupon(req.params.id);
  successResponse(res, {
    message: "Coupon retrieved successfully!",
    data: result,
  });
});

const updateCoupon = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.updateCoupon(req.params.id, req.body);
  successResponse(res, {
    message: "Coupon updated successfully!",
    data: result,
  });
});

const toggleFeaturedStatus = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.toggleFeaturedStatus(req.params.id);
  successResponse(res, {
    message: `Coupon ${result?.isFeatured ? "featured" : "unfeatured"} successfully`,
    data: result,
  });
});

const deleteCoupon = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await couponService.deleteCoupon(req.params.id);
  successResponse(res, {
    message: "Coupon deleted successfully!",
    data: result,
  });
});

const couponController = {
  createCoupon,
  getAllCoupons,
  getTrendingCoupons,
  getFeaturedCoupons,
  getCouponsByStoreId,
  getSingleCoupon,
  updateCoupon,
  toggleFeaturedStatus,
  deleteCoupon,
};

export default couponController;