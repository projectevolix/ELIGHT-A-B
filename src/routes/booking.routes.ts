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

router.put(
    '/:bookingId/details',
    authorize([ROLES.User, ROLES.Admin]),
    bookingController.updateBookingDetails
);

router.post(
    '/create',
    authorize([ROLES.User]),
    bookingController.createBooking
);

router.delete(
    '/:bookingId/delete',
    authorize([ROLES.User,ROLES.Admin]),
    bookingController.deleteBooking
);

router.get(
    '/my',
    authorize([ROLES.User]),
    bookingController.getMyBookings
);

router.get(
    '/checked-in',
    authorize([ROLES.Doctor]),
    bookingController.getCheckedInBookingsForDoctor
);

export default router;