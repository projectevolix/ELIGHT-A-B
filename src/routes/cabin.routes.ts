import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../constants/roles.constants";
import * as cabinController from "../controllers/cabin.controller";

const router = Router();

router.use(authenticate)

router.post(
    '/create',
    authorize([ROLES.Admin]), 
    cabinController.createCabin
);

router.get(
    '/:cabinId',
    authorize([ROLES.Admin]),
    cabinController.getCabinById
);

router.get(
    '/',
    authorize([ROLES.Admin]),
    cabinController.getAllCabins
);

router.put(
    '/:cabinId/update',
    authorize([ROLES.Admin]),
    cabinController.updateCabin
);

router.delete(
    '/:cabinId/delete',
    authorize([ROLES.Admin]),
    cabinController.deleteCabin
);

export default router;