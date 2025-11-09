import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import * as bookingController from "../controllers/booking.controller";
import { ROLES } from "../constants/roles.constants";

const router = Router();

router.use(authenticate)

router.post(
    '/create',
    authorize([ROLES.User]),
    bookingController.createBooking
);

router.delete(
    '/:bookingId',
    authorize([ROLES.Admin]),
    bookingController.deleteBooking
);

export default router;