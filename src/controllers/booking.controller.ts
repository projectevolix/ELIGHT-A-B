import { Request, Response } from "express";
import * as bookingService from "../services/booking.service";
import { Types } from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  asyncHandler,
} from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { IBooking } from "../types/booking.types";

// Helper function to parse pagination parameters
const parsePaginationParams = (req: Request) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  return { page, limit };
};

// Helper function to get authenticated user ID
const getAuthenticatedUserId = (req: Request): string => {
  if (!req.user) {
    throw new UnauthorizedError("Not authorized. Please log in.");
  }
  return req.user.id.toString();
};

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { checkInDate, checkOutDate, description } = req.body;

    if (!req.user) {
      throw new UnauthorizedError("Not authorized, no user");
    }

    const bookingData = {
      userId: new Types.ObjectId(req.user.id),
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      description,
    };

    const newBooking = await bookingService.createBooking(bookingData);

    res.status(201).json(
      new ApiResponse(201, newBooking, "Booking created successfully")
    );
  }
);

export const getAllBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = parsePaginationParams(req);
    const search = (req.query.search as string) || "";
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const result = await bookingService.getAllBookings({
      page,
      limit,
      search,
      startDate,
      endDate,
    });

    if (result.data.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, result, "No bookings found")
      );
    }

    res.status(200).json(
      new ApiResponse(200, result, "Bookings retrieved successfully")
    );
  }
);

export const deleteBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    if (!Types.ObjectId.isValid(bookingId)) {
      throw new NotFoundError("Booking not found");
    }

    await bookingService.deleteBooking(bookingId);

    res.status(200).json(
      new ApiResponse(200, null, "Booking deleted successfully")
    );
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

    res.status(200).json(
      new ApiResponse(200, updatedBooking, "Status updated successfully")
    );
  }
);

export const updateBookingDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { checkInDate, checkOutDate, description } = req.body;

    const updateData: Partial<IBooking> = {};
    if (checkInDate) updateData.checkInDate = checkInDate;
    if (checkOutDate) updateData.checkOutDate = checkOutDate;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided for update.");
    }

    const updatedBooking = await bookingService.updateBookingDetails(
      bookingId,
      updateData
    );

    if (!updatedBooking) {
      throw new NotFoundError("Booking not found");
    }

    res.status(200).json(
      new ApiResponse(200, updatedBooking, "Booking details updated successfully")
    );
  }
);

export const getMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(req);
    const { page, limit } = parsePaginationParams(req);

    const result = await bookingService.getMyBookings(userId, { page, limit });

    if (result.data.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, result, "No bookings found")
      );
    }

    res.status(200).json(
      new ApiResponse(200, result, "Bookings retrieved successfully")
    );
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

    // 3. Send the successful paginated response
    res.status(200).json(
      new ApiResponse(
        200,
        result, // This contains the { data: [...], meta: {...} } object
        result.data.length === 0 
          ? "No checked-in bookings found for today"
          : "Checked-in bookings retrieved successfully"
      )
    );
  }
);
