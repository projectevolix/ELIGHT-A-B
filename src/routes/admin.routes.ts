import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../constants/roles.constants";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.use(authenticate)

router.post(
    '/create',
    authorize([ROLES.Admin]), 
    adminController.createAdminUser
);

export default router;