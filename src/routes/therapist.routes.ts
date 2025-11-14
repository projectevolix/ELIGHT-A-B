import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../constants/roles.constants";
import * as therapistController from "../controllers/therapist.controller";

const router = Router();

router.use(authenticate)

router.post(
    '/create',
    authorize([ROLES.Admin]), 
    therapistController.createTherapistUser
);

export default router;