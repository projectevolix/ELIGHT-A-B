import { Booking } from "../models/booking.model";
import { CreateBookingInput, IBooking } from "../types/booking.types";

export const createBooking = async (
  data: CreateBookingInput
): Promise<IBooking> => {
  const newBooking = new Booking(data);

  await newBooking.save();

  return newBooking;
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  await Booking.findByIdAndDelete(bookingId);
}