import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../constants/roles.constants";
import * as treatmentController from "../controllers/treatment.controller";

const router = Router();

router.use(authenticate)

router.get(
    '/',
    authorize([]),
    treatmentController.getAllTreatments
);

router.post(
    '/create',
    authorize([ROLES.Admin]),
    treatmentController.createTreatment
);

export default router;