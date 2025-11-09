import { Schema, model, Document, Types } from "mongoose";
import { IBooking } from "../types/booking.types";

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
    }
}, { timestamps: true });

export const Booking = model<IBooking>("Booking", bookingSchema);
