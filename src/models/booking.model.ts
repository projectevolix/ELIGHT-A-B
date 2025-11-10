import { Schema, model, Document, Types } from "mongoose";
import { IBooking } from "../types/booking.types";
import { BOOKING_STATUS_LIST, BookingStatus } from "../constants/booking.constants";

const bookingSchema = new Schema<IBooking>({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: BOOKING_STATUS_LIST,
        default: BookingStatus.Pending
    }
}, { timestamps: true });

export const Booking = model<IBooking>("Booking", bookingSchema);
