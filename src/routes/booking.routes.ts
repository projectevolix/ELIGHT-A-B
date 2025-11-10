import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import * as bookingController from "../controllers/booking.controller";
import { ROLES } from "../constants/roles.constants";

const router = Router();

router.use(authenticate)

router.get(
    '/get-all',
    authorize([ROLES.Admin]),
    bookingController.getAllBookings
);

router.put(
    '/:bookingId/status',
    authorize([ROLES.Admin]),
    bookingController.updateBookingStatus
);

router.post(
    '/create',
    authorize([ROLES.User]),
    bookingController.createBooking
);

router.delete(
    '/:bookingId',
    authorize([ROLES.User,ROLES.Admin]),
    bookingController.deleteBooking
);

export default router;