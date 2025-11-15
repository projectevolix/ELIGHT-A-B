import { NextFunction, Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { Types } from "mongoose";
import { logger } from "../config/logger.config";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  asyncHandler,
} from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { IBooking } from "../types/booking.types";

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Get booking data from the request body
    const { checkInDate, checkOutDate, description } = req.body;

    // 2. Get the authenticated user's ID from req.user
    if (!req.user) {
      throw new UnauthorizedError("Not authorized, no user");
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
    res.status(201).json(
      new ApiResponse(201, newBooking, "Booking created successfully")
    );
  }
);

export const getAllBookings = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const deleteBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    if (!Types.ObjectId.isValid(bookingId)) {
      throw new NotFoundError("Booking not found");
    }
    await bookingService.deleteBooking(bookingId);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Booking deleted successfully"));
  }
);

export const updateBookingStatus = asyncHandler(
  async (req: Request, res: Response) => {
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

    res
      .status(200)
      .json(new ApiResponse(200, updatedBooking, "Status updated"));
  }
);

export const updateBookingDetails = asyncHandler(
  async (req: Request, res: Response) => {
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
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedBooking,
          "Booking details updated successfully"
        )
      );
  }
);

const getAuthAndPagination = (req: Request) => {
  if (!req.user) {
    throw new UnauthorizedError("Not authorized. Please log in.");
  }
  const userId = req.user.id.toString(); // Get user ID from token

  // Parse pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  return { userId, options: { page, limit } };
};

export const getMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, options } = getAuthAndPagination(req);
    const result = await bookingService.getMyBookings(userId, options);

    res
      .status(200)
      .json(new ApiResponse(200, result, "Bookings retrieved successfully"));
  }
);

export const getCheckedInBookingsForDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Parse pagination from query parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    // 2. Call the service
    const result = await bookingService.getCheckedInBookingsForDoctor({
      page,
      limit,
    });

    if (result.data.length === 0) {
      throw new NotFoundError("No checked-in bookings found for today");
    }

    // 3. Send the successful paginated response
    res.status(200).json(
      new ApiResponse(
        200,
        result, // This contains the { data: [...], meta: {...} } object
        "Checked-in bookings retrieved successfully"
      )
    );
  }
);
