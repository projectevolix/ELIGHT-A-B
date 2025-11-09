import { NextFunction, Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { Types } from "mongoose";
import { logger } from "../config/logger.config";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get booking data from the request body
    const { checkInDate, checkOutDate, description } = req.body;

    // 2. Get the authenticated user's ID from req.user
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no user" });
    }

    // Create a mongoose ObjectId from the string id (safer than a direct cast)
    const userId = new Types.ObjectId(req.user.id);

    // 2. Prepare data for the service
    const bookingData = {
      userId,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      description,
    };

    // 5. Call the service to create the booking
    const newBooking = await bookingService.createBooking(bookingData);

    // 6. Send the successful response
    res.status(201).json({
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    logger.error("Error creating booking:", error);
    next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        
        const { bookingId } = req.params;

        if (!Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }
        await bookingService.deleteBooking(bookingId);
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        logger.error("Error deleting booking:", error);
        next(error);
    }
};
