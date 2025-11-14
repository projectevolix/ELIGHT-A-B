import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../constants/roles.constants";
import * as doctorController from "../controllers/doctor.controller";

const router = Router();

router.use(authenticate)

router.post(
    '/create',
    authorize([ROLES.Admin]), 
    doctorController.createDoctorUser
);

export default router;