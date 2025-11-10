import { NextFunction, Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { Types } from "mongoose";
import { logger } from "../config/logger.config";
import { BadRequestError, NotFoundError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { IBooking } from "../types/booking.types";

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

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // --- 1. Parse Query Parameters ---
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = (req.query.search as string) || "";

    // --- 2. Call Service with Options ---
    const result = await bookingService.getAllBookings({
      page,
      limit,
      search,
    });

    // --- 3. Send Paginated Response ---
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
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

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new BadRequestError("Status is required");
    }

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status
    );

    if (!updatedBooking) {
      throw new NotFoundError("Booking not found");
    }

    // res.status(200).json({
    //   message: "Status updated",
    //   data: updatedBooking
    // });

    res
      .status(200)
      .json(new ApiResponse(200, updatedBooking, "Status updated"));
  } catch (error) {
    logger.error("Error updating booking status:", error);
    next(error);
  }
};

export const updateBookingDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { checkInDate, checkOutDate, description } = req.body;

    // Create the update object
    const updateData: Partial<IBooking> = {};
    if (checkInDate) updateData.checkInDate = checkInDate;
    if (checkOutDate) updateData.checkOutDate = checkOutDate;
    if (description !== undefined) updateData.description = description;

    // Check if any valid data was sent
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided for update.");
    }

    // Call the service
    const updatedBooking = await bookingService.updateBookingDetails(
      bookingId,
      updateData
    );

    // Handle if booking was not found
    if (!updatedBooking) {
      throw new NotFoundError("Booking not found");
    }

    // --- USE ApiResponse CLASS FOR SUCCESS ---
    res.status(200).json(
      new ApiResponse(
        200,
        updatedBooking,
        "Booking details updated successfully"
      )
    );
    
  } catch (error) {
    logger.error("Error updating booking details:", error);
    next(error);
  }
};
