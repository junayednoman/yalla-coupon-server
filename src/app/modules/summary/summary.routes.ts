import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { summaryController } from "./summary.controller";

const router = Router();

router.get("/", authVerify([userRoles.admin]), summaryController.getDashboardSummary)

export const summaryRoutes = router;